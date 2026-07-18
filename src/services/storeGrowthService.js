// src/services/storeGrowthService.js
import { supabase } from "../lib/supabaseClient";

/**
 * 기획서 3-7의 상점 성장 단계.
 * threshold는 "이 레벨이 되려면 필요한 누적 순환 횟수"입니다.
 * (구체적인 수치는 기획서에 명시되어 있지 않아 임의로 정한 값이라,
 *  밸런스는 나중에 조정하시면 됩니다.)
 */
const GROWTH_STAGES = [
  { level: 1, name: "땅바닥", emoji: "🥬", threshold: 0 },
  { level: 2, name: "바구니", emoji: "🧺", threshold: 5 },
  { level: 3, name: "돗자리", emoji: "🟫", threshold: 15 },
  { level: 4, name: "손수레", emoji: "🛒", threshold: 30 },
  { level: 5, name: "작은 상점", emoji: "🏪", threshold: 50 },
  { level: 6, name: "상점", emoji: "🛍️", threshold: 80 },
  { level: 7, name: "마켓", emoji: "🏬", threshold: 120 },
];

/**
 * 완료된 거래 횟수를 기준으로 현재 상점 레벨을 계산합니다.
 * "판매 금액이 아니라 순환 활동 횟수" 기준이라는 기획 의도를 그대로 반영했습니다.
 */
export async function getStoreLevel(userId) {
  const { count, error } = await supabase
    .from("products")
    .select("id, item:item_id!inner(user_id)", { count: "exact", head: true })
    .eq("item.user_id", userId)
    .eq("pick", "거래 완료");

  if (error) {
    console.error("상점 성장 정보 조회 실패:", error.message);
    return { data: null, error };
  }

  const circulationCount = count ?? 0;

  // threshold를 넘는 가장 높은 단계를 찾음
  const currentStage = [...GROWTH_STAGES]
    .reverse()
    .find((stage) => circulationCount >= stage.threshold);

  const nextStage = GROWTH_STAGES.find(
    (stage) => stage.level === currentStage.level + 1,
  );

  return {
    data: {
      circulationCount,
      currentStage,
      nextStage: nextStage ?? null, // 이미 최고 레벨이면 null
      remainingToNext: nextStage ? nextStage.threshold - circulationCount : 0,
    },
    error: null,
  };
}

/**
 * GR-001, GR-002: 레벨업 감지 + Profile.level 반영
 *
 * 별도의 "포인트 적립" 컬럼 없이, 완료된 거래 횟수(getStoreLevel)를 다시 계산해서
 * 그 결과가 Profile에 저장된 현재 level보다 높으면 그때 Profile.level을 올려줍니다.
 * 즉 "적립"은 거래 완료 자체가 대신하고, 이 함수는 "그래서 레벨이 올랐는지"만 판단합니다.
 *
 * pickService.completeTrade()에서 거래 완료 직후 자동으로 호출됩니다.
 */
export async function checkAndUpdateLevel(userId) {
  const { data: growth, error: growthError } = await getStoreLevel(userId);

  if (growthError) {
    return { data: null, error: growthError };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("level")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("프로필 레벨 조회 실패:", profileError.message);
    return { data: null, error: profileError };
  }

  const computedLevel = growth.currentStage.level;
  const leveledUp = computedLevel > profile.level;

  if (leveledUp) {
    const { error: updateError } = await supabase
      .from("profile")
      .update({ level: computedLevel })
      .eq("id", userId);

    if (updateError) {
      console.error("레벨 갱신 실패:", updateError.message);
      return { data: null, error: updateError };
    }
  }

  return {
    data: {
      leveledUp,
      previousLevel: profile.level,
      newStage: growth.currentStage,
    },
    error: null,
  };
}

/**
 * GR-003: 레벨업 알림 (실시간 구독)
 * Profile.level 컬럼 값이 실제로 바뀌는 순간을 감지해서 onLevelUp 콜백을 호출합니다.
 * (Notifications 테이블이 스키마에 없어서, PICK 알림 때와 동일하게 Realtime 방식으로 대체)
 *
 * ⚠️ 사전 준비: Supabase 대시보드 > Database > Replication에서
 *    profile 테이블의 Realtime을 켜두셔야 동작합니다.
 *
 * 반환된 channel은 컴포넌트가 사라질 때 꼭 해제해주세요:
 *   const channel = subscribeToLevelUp(userId, cb);
 *   // ...
 *   supabase.removeChannel(channel);
 */
export function subscribeToLevelUp(userId, onLevelUp) {
  const channel = supabase
    .channel(`level-up-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "profile",
        filter: `id=eq.${userId}`,
      },
      (payload) => {
        const { new: newRow, old: oldRow } = payload;
        if (newRow.level > oldRow.level) {
          const newStage = GROWTH_STAGES.find(
            (stage) => stage.level === newRow.level,
          );
          onLevelUp(newStage);
        }
      },
    )
    .subscribe();

  return channel;
}
