import KakaoLogo from "../assets/KakaoLogo.png";
import NaverLogo from "../assets/NaverLogo.png";
import GoogleLogo from "../assets/GoogleLogo.png";
// 💡 authService에서 소셜 로그인 함수들을 임포트합니다.
// (컴포넌트 위치에 따라 파일 경로를 맞게 조절해주세요. 예: ../services/authService)
import { signInWithOAuth, signInWithNaver } from "../services/authService";

const SOCIAL_PROVIDERS = [
  { key: "kakao", label: "카카오로 로그인", logo: KakaoLogo, modifier: "kakao" },
  { key: "naver", label: "네이버로 로그인", logo: NaverLogo, modifier: "naver" },
  { key: "google", label: "구글로 로그인", logo: GoogleLogo, modifier: "google" },
];

function SocialLoginButtons() {
  // 💡 클릭 인터랙션을 처리하는 핸들러 함수
  const handleSocialLogin = async (key) => {
    if (key === "naver") {
      // 네이버는 브라우저 직접 리다이렉트 함수 호출
      signInWithNaver();
    } else {
      // 구글, 카카오는 Supabase OAuth 공급자 함수 호출 ('google' | 'kakao')
      await signInWithOAuth(key);
    }
  };

  return (
    <>
      <div className="login-page__divider">SNS계정으로 로그인하기</div>
      <div className="login-page__social">
        {SOCIAL_PROVIDERS.map(({ key, label, logo, modifier }) => (
          <button
            key={key}
            type="button"
            className={`login-page__social-btn login-page__social-btn--${modifier}`}
            aria-label={label}
            onClick={() => handleSocialLogin(key)} // 💡 클릭 이벤트 연결
          >
            <img src={logo} alt={label} className="login-social-icon" />
          </button>
        ))}
      </div>
    </>
  );
}

export default SocialLoginButtons;