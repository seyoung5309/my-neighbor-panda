// src/services/locationService.js
import { supabase } from "../lib/supabaseClient";

function generateRegionKey({ c, n, g, u, m, d }) {
  return [c, n, g, u, m, d].filter(Boolean).join("-");
}

/**
 * region_key에 해당하는 마을이 있으면 그대로 사용하고,
 * 없으면 새로 생성 시도합니다.
 *
 * ⚠️ 해커톤 임시 처리: villages insert가 RLS에 막혀 403이 나더라도
 * 회원가입 자체는 끊기지 않도록, insert 실패 시 DB에 실제로 저장되지 않은
 * "가상의 village 객체"를 만들어서 넘겨줍니다. (id는 null)
 * → 데모 중엔 화면에 마을 이름은 정상 표시되지만, DB엔 villages row가 없을 수 있습니다.
 * → RLS 정책이 고쳐지면 이 fallback 없이도 정상적으로 실제 row가 생성/재사용됩니다.
 */
async function findOrCreateVillage(regionKey, displayName) {
  const { data: existing, error: findError } = await supabase
    .from("villages")
    .select("*")
    .eq("region_key", regionKey)
    .maybeSingle();

  if (!findError && existing) {
    return { data: existing, error: null };
  }

  const { data: created, error: createError } = await supabase
    .from("villages")
    .insert({ region_key: regionKey, name: displayName })
    .select()
    .single();

  if (createError) {
    // 경쟁 상황(동시 생성) 대비: 유니크 위반이면 다시 조회
    if (createError.code === "23505") {
      const { data: retryFetch } = await supabase
        .from("villages")
        .select("*")
        .eq("region_key", regionKey)
        .single();
      if (retryFetch) return { data: retryFetch, error: null };
    }

    // RLS 등으로 insert 자체가 막힌 경우: 회원가입을 막지 않기 위해
    // 가상 village 객체로 대체하고 넘어감 (DB엔 실제로 안 남을 수 있음)
    console.warn(
      "마을 생성 실패 (RLS 등) — 임시로 가상 village 사용:",
      createError.message,
    );
    return {
      data: { id: null, region_key: regionKey, name: displayName },
      error: null,
    };
  }

  return { data: created, error: null };
}

/**
 * MM-005: 회원가입 시 지역 입력 -> 자동 마을 매칭
 *
 * ⚠️ 해커톤 데모용 임시 하드코딩:
 * 사용자가 입력한 값과 상관없이 무조건 "서울특별시 시연군 시연동"으로 고정합니다.
 */
export async function setLocation(userId) {
  const fixedFields = {
    c: "서울특별시",
    g: "시연군",
    d: "시연동",
  };

  const regionKey = generateRegionKey(fixedFields);
  const displayName = `${fixedFields.d} 마을`;

  const { data: village } = await findOrCreateVillage(regionKey, displayName);

  const { data, error } = await supabase
    .from("location")
    .upsert(
      {
        user_id: userId,
        ...fixedFields,
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
