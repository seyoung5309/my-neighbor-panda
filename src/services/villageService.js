// src/services/villageService.js
import { supabase } from "../lib/supabaseClient";
import { getStoreProducts } from "./storeService";

/**
 * VL-003: 마을 입장
 * 내 위치(region_key) 기준으로 소속된 마을 정보와,
 * 같은 마을에 있는 다른 사용자 목록(상점 미리보기용)을 함께 가져옵니다.
 */
export async function enterVillage(userId) {
  const { data: myLocation, error: locationError } = await supabase
    .from("location")
    .select("region_key")
    .eq("user_id", userId)
    .single();

  if (locationError) {
    console.error("내 위치 조회 실패:", locationError.message);
    return { data: null, error: locationError };
  }

  const { data: village, error: villageError } = await supabase
    .from("villages")
    .select("*")
    .eq("region_key", myLocation.region_key)
    .single();

  if (villageError) {
    console.error("마을 조회 실패:", villageError.message);
    return { data: null, error: villageError };
  }

  const { data: members, error: membersError } = await getVillageMembers(
    myLocation.region_key,
    userId,
  );

  if (membersError) {
    return { data: null, error: membersError };
  }

  return { data: { village, members }, error: null };
}

/**
 * 같은 region_key(마을)에 속한 다른 사용자 목록.
 * 마을 화면에서 상점 목록을 보여줄 때 사용합니다 (본인은 제외).
 */
export async function getVillageMembers(regionKey, excludeUserId) {
  const { data, error } = await supabase
    .from("location")
    .select(
      `
      user_id,
      profile:user_id ( id, nickname, level )
    `,
    )
    .eq("region_key", regionKey)
    .neq("user_id", excludeUserId);

  if (error) {
    console.error("마을 사용자 목록 조회 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * VL-004: 다른 사용자의 상점 방문 (진열된 상품 조회)
 * 실제 조회 로직은 storeService.getStoreProducts()를 그대로 재사용합니다.
 * (같은 상품 목록 규칙 — pick='대기중'만 노출 — 을 두 군데서 따로 관리하지 않기 위함)
 */
export async function visitStore(storeOwnerUserId) {
  return getStoreProducts(storeOwnerUserId);
}
