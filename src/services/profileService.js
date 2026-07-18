// src/services/profileService.js
import { supabase } from "../lib/supabaseClient";

/**
 * MM-003: 닉네임 중복 확인
 * true 반환 = 이미 사용 중인 닉네임 (사용 불가)
 * false 반환 = 사용 가능한 닉네임
 */
export async function checkNicknameDuplicate(nickname) {
  const { data, error } = await supabase
    .from("profile")
    .select("id")
    .eq("nickname", nickname)
    .maybeSingle();

  if (error) {
    console.error("닉네임 중복 확인 실패:", error.message);
    return { isDuplicate: null, error };
  }

  return { isDuplicate: data !== null, error: null };
}

/**
 * MM-003: 닉네임 설정/변경
 * DB의 UNIQUE 제약이 최종 방어선 역할을 하므로,
 * 프론트에서 중복 확인을 거쳤어도 동시 요청 등으로 실패할 수 있습니다.
 * 에러 코드 23505(unique_violation)를 별도로 구분해서 처리합니다.
 */
// 기존에 따로 닉네임을 넣는 로직이 있었거나, step3 등에서 업데이트 할 때
export const updateNickname = async (userId, nickname) => {
  const { data, error } = await supabase
    .from("profile") // 본인의 프로필 테이블명
    .upsert(
      {
        id: userId,
        nickname: nickname,
      },
      { onConflict: "id" },
    );

  return { data, error };
};

/**
 * 프로필 조회 (마이페이지, 상점 정보 표시 등에서 공통 사용)
 */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("프로필 조회 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}
