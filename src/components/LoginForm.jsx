import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "./FormField";
import { signInWithEmail } from "../services/authService";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setErrorMessage("");
    setIsSubmitting(true);

    const { data, error } = await signInWithEmail(email, password);

    setIsSubmitting(false);

    if (error) {
      setErrorMessage("이메일 또는 비밀번호가 올바르지 않아요.");
      return;
    }

    if (data) {
      // TODO: 실제 홈 라우트 생기면 "/mypage" → 홈 경로로 변경
      navigate("/mypage");
    }
  };

  return (
    <form className="login-page__form" onSubmit={handleSubmit}>
      <FormField
        id="email"
        label="이메일"
        type="email"
        placeholder="이메일을 입력해주세요"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormField
        id="password"
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {errorMessage && <p className="login-page__error">{errorMessage}</p>}

      <button
        type="submit"
        className="login-page__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "로그인 중..." : "로그인하기"}
      </button>
    </form>
  );
}

export default LoginForm;
