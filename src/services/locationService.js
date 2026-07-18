// src/services/locationService.js
import { supabase } from "../lib/supabaseClient";

/**
 * 주소 필드를 조합해 region_key를 생성합니다.
 * 예: { c: '서울특별시', g: '강남구', d: '역삼동' }
 *     -> "서울특별시-강남구-역삼동"
 * 시/군/구/읍/면/동 중 값이 있는 필드만 순서대로 이어붙입니다.
 */
function generateRegionKey({ c, n, g, u, m, d }) {
  return [c, n, g, u, m, d].filter(Boolean).join("-");
}

/**
 * region_key에 해당하는 마을이 있으면 그대로 사용하고,
 * 없으면 새로 생성합니다. (지난 DB 설계에서 논의한 자동 생성 로직)
 */
async function findOrCreateVillage(regionKey, displayName) {
  const { data: existing, error: findError } = await supabase
    .from("villages")
    .select("*")
    .eq("region_key", regionKey)
    .maybeSingle();

  if (findError) {
    console.error("마을 조회 실패:", findError.message);
    return { data: null, error: findError };
  }

  if (existing) {
    return { data: existing, error: null };
  }

  const { data: created, error: createError } = await supabase
    .from("villages")
    .insert({ region_key: regionKey, name: displayName })
    .select()
    .single();

  if (createError) {
    // 동시에 두 유저가 같은 마을을 처음 생성하려는 경쟁 상황(race condition) 대비:
    // unique_violation이면 이미 다른 요청이 먼저 생성한 것이므로 다시 조회
    if (createError.code === "23505") {
      const { data: retryFetch } = await supabase
        .from("villages")
        .select("*")
        .eq("region_key", regionKey)
        .single();
      return { data: retryFetch, error: null };
    }
    console.error("마을 생성 실패:", createError.message);
    return { data: null, error: createError };
  }

  return { data: created, error: null };
}

/**
 * MM-005: 회원가입 시 지역 입력 -> 자동 마을 매칭
 * addressFields: { c, n, g, u, m, d }
 */
export async function setLocation(userId, addressFields) {
  const regionKey = generateRegionKey(addressFields);
  const displayName = `${addressFields.d || addressFields.g || addressFields.c} 마을`;

  const { data: village, error: villageError } = await findOrCreateVillage(
    regionKey,
    displayName,
  );

  if (villageError) {
    return { data: null, error: villageError };
  }

  const { data, error } = await supabase
    .from("location")
    .upsert(
      {
        user_id: userId,
        ...addressFields,
        region_key: regionKey,
      },
      { onConflict: "user_id" },
    )
    .select()
    .single();

  if (error) {
    console.error("위치 저장 실패:", error.message);
    return { data: null, error };
  }

  return { data: { location: data, village }, error: null };
}

/**
 * MM-006: 사용자가 자동 매칭된 마을이 아닌 다른 마을을 직접 선택
 * 기존 주소 필드(c, g, d 등)는 그대로 두고, region_key만 선택한 마을 것으로 덮어씁니다.
 */
export async function overrideVillage(userId, villageId) {
  const { data: village, error: villageError } = await supabase
    .from("villages")
    .select("*")
    .eq("id", villageId)
    .single();

  if (villageError) {
    console.error("마을 조회 실패:", villageError.message);
    return { data: null, error: villageError };
  }

  const { data, error } = await supabase
    .from("location")
    .update({ region_key: village.region_key })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("마을 변경 실패:", error.message);
    return { data: null, error };
  }

  return { data: { location: data, village }, error: null };
}

/**
 * 마을 검색 (MM-006에서 사용자가 고를 목록 조회용)
 */
export async function searchVillages(keyword) {
  const { data, error } = await supabase
    .from("villages")
    .select("*")
    .ilike("name", `%${keyword}%`)
    .limit(20);

  if (error) {
    console.error("마을 검색 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * 현재 내 위치/마을 정보 조회
 */
export async function getMyLocation(userId) {
  const { data, error } = await supabase
    .from("location")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("위치 조회 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}
