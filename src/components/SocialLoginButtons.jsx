import KakaoLogo from "../assets/KakaoLogo.png";
import NaverLogo from "../assets/NaverLogo.png";
import GoogleLogo from "../assets/GoogleLogo.png";

const SOCIAL_PROVIDERS = [
  { key: "kakao", label: "카카오로 로그인", logo: KakaoLogo, modifier: "kakao" },
  { key: "naver", label: "네이버로 로그인", logo: NaverLogo, modifier: "naver" },
  { key: "google", label: "구글로 로그인", logo: GoogleLogo, modifier: "google" },
];

function SocialLoginButtons() {
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
          >
            <img src={logo} alt={label} className="login-social-icon" />
          </button>
        ))}
      </div>
    </>
  );
}

export default SocialLoginButtons;