// src/services/authService.js
import { supabase } from "../lib/supabaseClient";

/**
 * MM-001: 이메일/비밀번호 회원가입
 * 회원가입 성공 시 auth.users에 유저가 생성되고,
 * DB 트리거(handle_new_user)가 자동으로 public.profile row를 만들어줍니다.
 */
export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("회원가입 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * MM-004: 이메일/비밀번호 로그인
 */
export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("로그인 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * MM-002: 소셜 로그인
 * provider: 'google' 등 Supabase가 기본 지원하는 provider
 * 카카오/네이버는 Supabase 대시보드에서 Custom OAuth Provider로
 * 별도 설정이 필요합니다 (기본 목록에 없음).
 */
export async function signInWithOAuth(provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider, // 'google' | 'kakao' | 'custom:naver' (커스텀 설정 후 사용)
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("소셜 로그인 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * MM-002: 네이버 로그인 시작
 * client_id, redirect_uri는 공개되어도 되는 정보라서
 * 별도 서버 없이 브라우저에서 바로 네이버 인증 페이지로 이동시키면 됩니다.
 * (실제 비밀값인 client_secret은 콜백을 처리하는 서버 함수에서만 사용됩니다.)
 */
export function signInWithNaver() {
  const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
  const redirectUri = `${window.location.origin}/api/naver-callback`;
  // CSRF 방지용 state 값 (원하면 세션/스토리지에 저장 후 콜백에서 검증 가능)
  const state = crypto.randomUUID();

  const authUrl =
    "https://nid.naver.com/oauth2.0/authorize" +
    `?response_type=code` +
    `&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}`;

  window.location.href = authUrl;
}

/**
 * MM-004: 로그아웃
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("로그아웃 실패:", error.message);
    return { error };
  }

  return { error: null };
}

/**
 * 현재 로그인된 유저 정보 조회 (다른 서비스 함수들에서 공통으로 사용)
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("유저 조회 실패:", error.message);
    return { user: null, error };
  }

  return { user, error: null };
}

/**
 * 로그인 상태 변화 구독 (로그인/로그아웃/토큰 갱신 등)
 * App.jsx 최상단에서 한 번 호출해서 전역 상태(예: Context, Zustand)에 반영하는 용도
 */
export function onAuthStateChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return subscription; // 컴포넌트 unmount 시 subscription.unsubscribe() 호출 필요
}

/**
 * MM-003: 닉네임 중복 여부 확인
 * 입력창에서 "중복 확인" 버튼을 누를 때 호출하는 용도입니다.
 * true면 사용 가능, false면 이미 사용 중인 닉네임입니다.
 */
export async function isNicknameAvailable(nickname) {
  const { data, error } = await supabase
    .from("profile")
    .select("id")
    .eq("nickname", nickname)
    .maybeSingle();

  if (error) {
    console.error("닉네임 중복 확인 실패:", error.message);
    return { available: null, error };
  }

  return { available: !data, error: null };
}

/**
 * MM-003: 닉네임 설정
 * 회원가입 직후(또는 이후 마이페이지에서) 실제로 닉네임을 저장할 때 사용합니다.
 * profile.nickname엔 UNIQUE 제약이 걸려있어서, isNicknameAvailable()로 미리
 * 확인했더라도 그 사이 다른 사용자가 선점했을 경우를 대비해 23505 에러를
 * 별도 메시지로 잡아줍니다.
 */
export async function setNickname(userId, nickname) {
  const { data, error } = await supabase
    .from("profile")
    .upsert({ nickname })
    .eq("id", userId)
    .select();

  if (error) {
    if (error.code === "23505") {
      return {
        data: null,
        error: new Error("이미 사용 중인 닉네임입니다."),
      };
    }
    console.error("닉네임 설정 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * MM-007: 회원 탈퇴 (소프트 삭제 방식)
 *
 * auth.users를 실제로 삭제하려면 service_role key가 필요하고,
 * 그건 Supabase Edge Function(Deno) 같은 서버 환경에서만 실행할 수 있습니다.
 * 해커톤 MVP 범위에서는 그 세팅 없이, Profile에 deleted_at을 기록하고
 * 닉네임/데이터를 정리한 뒤 로그아웃시키는 "소프트 삭제"로 대체합니다.
 *
 * (실제 auth.users 완전 삭제가 꼭 필요해지면, 그때 Edge Function으로
 *  전환하면 됩니다 — 이 함수의 인터페이스는 그대로 둬도 됩니다.)
 */
export async function deleteAccount(userId) {
  const { data, error } = await supabase
    .from("profile")
    .update({
      deleted_at: new Date().toISOString(),
      nickname: `탈퇴한사용자_${userId.slice(0, 8)}`,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("회원 탈퇴 처리 실패:", error.message);
    return { data: null, error };
  }

  await supabase.auth.signOut();

  return { data, error: null };
}
