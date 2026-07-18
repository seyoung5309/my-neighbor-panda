import "../styles/LoginPage.css";
import LoginForm from "../components/LoginForm";
import RegisterLink from "../components/RegisterLink";
import SocialLoginButtons from "../components/SocialLoginButtons";

function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-page__content">
        <LoginForm />
        <RegisterLink />
        <SocialLoginButtons />
      </div>
    </div>
  );
}

export default LoginPage;