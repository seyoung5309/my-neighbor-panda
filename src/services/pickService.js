// src/services/pickService.js
import { supabase } from "../lib/supabaseClient";
import { checkAndUpdateLevel } from "./storeGrowthService";

/**
 * PK-001, PK-004: 상품 PICK
 * '대기중'인 상품만 PICK 가능하며, 성공 시 상태가 '거래 신청중'으로 바뀝니다.
 * .eq('pick', '대기중') 조건 덕분에, 두 명이 동시에 PICK을 눌러도
 * DB 레벨에서 한 명만 성공하도록 보장됩니다 (경쟁 상태 방지).
 */
export async function pickProduct(productId, buyerId) {
  const { data, error } = await supabase
    .from("products")
    .update({ buyer_id: buyerId, pick: "거래 신청중" })
    .eq("id", productId)
    .eq("pick", "대기중")
    .select()
    .single();

  if (error) {
    console.error("PICK 실패:", error.message);
    return { data: null, error };
  }

  if (!data) {
    return {
      data: null,
      error: new Error("이미 다른 사용자가 PICK했거나 진열 중이 아닙니다."),
    };
  }

  return { data, error: null };
}

/**
 * PK-003, PK-004, CT-001: PICK 수락
 * DB 함수(accept_pick)를 호출해서 "판매자 본인 확인 + 채팅방 생성"을
 * 한 번에 원자적으로 처리합니다. 반환값은 새로 생성된 chatroom_id입니다.
 */
export async function acceptPick(productId) {
  const { data, error } = await supabase.rpc("accept_pick", {
    product_id_input: productId,
  });

  if (error) {
    console.error("PICK 수락 실패:", error.message);
    return { data: null, error };
  }

  return { data: { chatroomId: data }, error: null };
}

/**
 * PK-003, PK-004: PICK 거절
 * 상품을 다시 '대기중' 상태로 되돌리고 buyer_id를 비웁니다.
 */
export async function rejectPick(productId) {
  const { data, error } = await supabase
    .from("products")
    .update({ buyer_id: null, pick: "대기중" })
    .eq("id", productId)
    .eq("pick", "거래 신청중")
    .select()
    .single();

  if (error) {
    console.error("PICK 거절 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * PK-004, PK-005: 거래 완료 처리
 * 완료되면 상태가 '거래 완료'로 바뀌고, storeService.getStoreProducts()가
 * pick='대기중'만 조회하도록 되어있어서 자동으로 목록에서 사라집니다.
 *
 * GR-001, GR-002: 거래가 완료되는 이 시점이 곧 "식자재를 순환시킨" 시점이므로,
 * 완료 직후 판매자(item.user_id)의 상점 성장 레벨을 확인/갱신합니다.
 * 반환값의 `growth.leveledUp`이 true면 GR-003 알림을 화면에서 띄워주시면 됩니다.
 */
export async function completeTrade(productId) {
  const { data, error } = await supabase
    .from("products")
    .update({ pick: "거래 완료" })
    .eq("id", productId)
    .select("*, item:item_id ( user_id )")
    .single();

  if (error) {
    console.error("거래 완료 처리 실패:", error.message);
    return { data: null, error };
  }

  const sellerId = data.item.user_id;
  const { data: growthResult, error: growthError } =
    await checkAndUpdateLevel(sellerId);

  if (growthError) {
    // 거래 자체는 이미 완료됐으므로, 레벨 갱신 실패는 로그만 남기고 거래 결과는 정상 반환합니다.
    console.error("상점 성장 레벨 갱신 실패:", growthError.message);
  }

  return { data, growth: growthResult, error: null };
}

/**
 * 내 상품에 PICK이 들어왔을 때 실시간으로 받는 목적의 조회용 함수
 * (판매자 화면에서 PICK 요청 목록을 보여줄 때 사용)
 */
export async function getPendingPicksOnMyItems(userId) {
  const { data, error } = await supabase
    .from("products")
    .select(`*, item:item_id!inner(*, user_id)`)
    .eq("item.user_id", userId)
    .eq("pick", "거래 신청중");

  if (error) {
    console.error("PICK 요청 목록 조회 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * PK-002: PICK 알림 (실시간 구독)
 * 내 아이템 중 하나가 '대기중' -> '거래 신청중'으로 바뀌는 순간을 감지해서
 * onPicked 콜백을 호출합니다.
 *
 * ⚠️ 사전 준비: Supabase 대시보드 > Database > Replication에서
 *    products 테이블의 Realtime을 켜두셔야 동작합니다.
 *
 * 반환된 channel은 컴포넌트가 사라질 때 꼭 해제해주세요:
 *   const channel = await subscribeToMyPicks(userId, cb);
 *   // ...
 *   supabase.removeChannel(channel);
 */
export async function subscribeToMyPicks(userId, onPicked) {
  const { data: myItems, error } = await supabase
    .from("items")
    .select("id")
    .eq("user_id", userId);

  if (error) {
    console.error("내 아이템 목록 조회 실패:", error.message);
  }

  const myItemIds = new Set((myItems ?? []).map((item) => item.id));

  const channel = supabase
    .channel(`my-picks-${userId}`)
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "products" },
      (payload) => {
        const { new: newRow, old: oldRow } = payload;
        if (
          myItemIds.has(newRow.item_id) &&
          oldRow.pick === "대기중" &&
          newRow.pick === "거래 신청중"
        ) {
          onPicked(newRow);
        }
      },
    )
    .subscribe();

  return channel;
}
