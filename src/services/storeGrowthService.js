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
