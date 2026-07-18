// src/services/characterService.js
import { supabase } from "../lib/supabaseClient";

/**
 * CH-001, CH-002: 캐릭터 생성 (성별 + 색상)
 * upsert를 사용해서, 이미 있으면 덮어쓰고 없으면 새로 생성합니다.
 * (CH-003 캐릭터 수정도 이 함수를 그대로 재사용하면 됩니다 -
 *  "생성"과 "수정"이 결국 같은 upsert 동작이라서요.)
 */
export async function setCharacter(userId, { gender, color1, color2 }) {
  const { data, error } = await supabase
    .from("character")
    .upsert({
      user_id: userId,
      gender,
      color1: color1 ?? "#000000",
      color2: color2 ?? "#000000",
    })
    .select()
    .single();

  if (error) {
    console.error("캐릭터 저장 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * 캐릭터 조회 (마이페이지, 게임 화면 등에서 공통 사용)
 */
export async function getCharacter(userId) {
  const { data, error } = await supabase
    .from("character")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("캐릭터 조회 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}
