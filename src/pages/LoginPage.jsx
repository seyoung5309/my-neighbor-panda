import "../styles/LoginPage.css";
import KakaoLogo from "../assets/KakaoLogo.png";
import NaverLogo from "../assets/NaverLogo.png";
import GoogleLogo from "../assets/GoogleLogo.png";

function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-page_content">
        <form className="login-page__form" onSubmit={(e) => e.preventDefault()}>
          <lable className="login-page__lable" htmlFor="email">
            이메일
          </lable> {/* 이메일 레이블 */}
          <input
            id="email"
            type="email"
            className="login-page__input"
            placeholder="이메일을 입력해주세요"
          ></input> {/* 이메일 인풋 */}

          <lable className="login-page__lable" htmlFor="password">
            비밀번호
          </lable> {/* 비밀번호 레이블 */}
          <input
            id="password"
            type="password"
            className="login-page__input"
            placeholder="비밀번호를 입력해주세요"
          ></input> {/* 비밀번호 인풋 */}

          <button type="submit" className="login-page__submit">
            로그인하기
          </button> {/* 로그인 버튼 */}
        </form>

        <button type="button" className="register-link">
          계정이 없으신가요? 회원가입하러가기
        </button> {/* 회원가입 버튼 */}
        <div className="login-page__divider">
          <span>SNS계정으로 로그인하기</span>
        </div> {/* 소셜 로그인 */}

        <div className="login-page__social">
          <span>SNS 계정으로 로그인하기</span>
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
          </button> {/* 카카오 로그인 버튼 */}
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
          </button> {/* 네이버 로그인 버튼 */}
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
          </button> {/* 구글 로그인 버튼 */}
        </div> {/* 소셜 로그인 div */}

      </div> {/* 로그인 페이지 콘텐츠 div */}
    </div> 
  );
}

export default LoginPage;
