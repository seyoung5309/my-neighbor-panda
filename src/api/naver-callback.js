// api/naver-callback.js
//
// Vercel 서버리스 함수 (Node.js 런타임, Deno 아님).
// 프로젝트를 Vercel에 배포하면 /api 폴더 안의 파일이 자동으로
// 서버리스 API 엔드포인트가 됩니다. 별도 설정 불필요.
//
// 접근 주소: https://<your-domain>/api/naver-callback
// (authService.js의 signInWithNaver()에서 지정한 redirect_uri와 정확히 일치해야 함)
//
// 처리 순서:
// 1. 쿼리스트링에서 authorization code 받기
// 2. 네이버 토큰 엔드포인트에 code를 보내 access_token 교환
// 3. access_token으로 네이버 프로필(이메일 등) 조회
// 4. 그 이메일로 Supabase 유저 조회, 없으면 생성 (service_role 사용)
// 5. 로그인 링크(magic link)를 생성해 그 링크로 리다이렉트
//    -> Supabase가 세션을 만들고 최종적으로 프론트엔드로 다시 리다이렉트해줌

import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  // 로그인 완료/실패 후 사용자를 돌려보낼 프론트엔드 주소
  const siteUrl = process.env.SITE_URL || "http://localhost:5173";

  try {
    const { code, state, error: errorParam } = req.query;

    if (errorParam) {
      return res.redirect(
        302,
        `${siteUrl}/login?error=${encodeURIComponent(errorParam)}`,
      );
    }

    if (!code) {
      return res.status(400).json({ error: "code가 없습니다." });
    }

    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: "NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 환경변수가 없습니다.",
      });
    }

    // 1. authorization code -> access_token 교환
    const tokenUrl = new URL("https://nid.naver.com/oauth2.0/token");
    tokenUrl.searchParams.set("grant_type", "authorization_code");
    tokenUrl.searchParams.set("client_id", clientId);
    tokenUrl.searchParams.set("client_secret", clientSecret);
    tokenUrl.searchParams.set("code", code);
    if (state) tokenUrl.searchParams.set("state", state);

    const tokenRes = await fetch(tokenUrl.toString());
    const tokenJson = await tokenRes.json();

    if (!tokenJson.access_token) {
      console.error("네이버 토큰 발급 실패:", tokenJson);
      return res.redirect(302, `${siteUrl}/login?error=naver_token_failed`);
    }

    // 2. access_token으로 프로필 조회
    const profileRes = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    });
    const profileJson = await profileRes.json();

    if (profileJson.resultcode !== "00") {
      console.error("네이버 프로필 조회 실패:", profileJson);
      return res.redirect(302, `${siteUrl}/login?error=naver_profile_failed`);
    }

    const naverUser = profileJson.response; // { id, email, nickname, ... }
    const email = naverUser.email;

    if (!email) {
      // 네이버 앱 설정에서 "이메일 제공"이 필수 동의항목이 아니면 없을 수 있음
      return res.redirect(302, `${siteUrl}/login?error=no_email_from_naver`);
    }

    // 3. Supabase Admin 클라이언트 (service_role key는 이 서버 함수 내부에서만 사용)
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    // 4. 이 이메일로 가입된 유저가 있는지 확인, 없으면 새로 생성
    const { data: existingUsers, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error("유저 목록 조회 실패:", listError);
      return res.redirect(302, `${siteUrl}/login?error=server_error`);
    }

    let userId = existingUsers.users.find((u) => u.email === email)?.id;

    if (!userId) {
      const { data: created, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: {
            provider: "naver",
            naver_id: naverUser.id,
            nickname: naverUser.nickname,
          },
        });

      if (createError) {
        console.error("유저 생성 실패:", createError);
        return res.redirect(302, `${siteUrl}/login?error=server_error`);
      }

      userId = created.user.id;
    }

    // 5. 로그인 링크 생성 -> 그 링크로 리다이렉트하면
    //    Supabase가 세션(access_token/refresh_token)을 만들어서
    //    최종적으로 프론트엔드(redirectTo)로 다시 리다이렉트해줌
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
        },
      });

    if (linkError) {
      console.error("로그인 링크 생성 실패:", linkError);
      return res.redirect(302, `${siteUrl}/login?error=server_error`);
    }

    return res.redirect(302, linkData.properties.action_link);
  } catch (err) {
    console.error("naver-callback 처리 중 예외:", err);
    return res.status(500).json({ error: String(err) });
  }
}
