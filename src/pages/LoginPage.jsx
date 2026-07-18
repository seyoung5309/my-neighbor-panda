import "../styles/LoginPage.css";
import KakaoLogo from "../assets/KakaoLogo.png";
import NaverLogo from "../assets/NaverLogo.png";
import GoogleLogo from "../assets/GoogleLogo.png";
import Vector from "../assets/Vector.png";

function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-page__content">
        <form className="login-page__form" onSubmit={(e) => e.preventDefault()}>
          <div className="login-page__field">
            <label className="login-page__lable" htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              type="email"
              className="login-page__input"
              placeholder="이메일을 입력해주세요"
            />
          </div>
          {/* 이메일 인풋 */}
          <div className="login-page__field">
            <label className="login-page__lable" htmlFor="password">
              비밀번호
            </label>
            {/* 비밀번호 레이블 */}
            <input
              id="password"
              type="password"
              className="login-page__input"
              placeholder="비밀번호를 입력해주세요"
            />
            {/* 비밀번호 인풋 */}
          </div>
          <button type="submit" className="login-page__submit">
            로그인하기
          </button>
          {/* 로그인 버튼 */}
        </form>
        <div className="register">
          <button type="button" className="register-link">
            계정이 없으신가요? 회원가입하러가기
          </button>
          <img src={Vector} alt="벡터 이미지" className="login-page__vector" />
          {/* 회원가입 버튼 */}
        </div>
        <div className="login-page__divider">
          SNS계정으로 로그인하기
        </div>
        {/* 소셜 로그인 */}
        <div className="login-page__social">
          <button
            type="button"
            className="social-btn-kakao"
            aria-label="카카오로 로그인"
          >
            <img
              src={KakaoLogo}
              alt="카카오 로그인"
              className="login-social-icon"
            />
          </button>
          {/* 카카오 로그인 버튼 */}
          <button
            type="button"
            className="social-btn-naver"
            aria-label="네이버로 로그인"
          >
            <img
              src={NaverLogo}
              alt="네이버 로그인"
              className="login-social-icon"
            />
          </button>
          {/* 네이버 로그인 버튼 */}
          <button
            type="button"
            className="social-btn-google"
            aria-label="구글로 로그인"
          >
            <img
              src={GoogleLogo}
              alt="구글 로그인"
              className="login-social-icon"
            />
          </button>
          {/* 구글 로그인 버튼 */}
        </div>
        {/* 소셜 로그인 div */}
      </div>
      {/* 로그인 페이지 콘텐츠 div */}
    </div>
  );
}

export default LoginPage;
