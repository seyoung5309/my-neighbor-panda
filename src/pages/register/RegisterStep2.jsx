import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/RegisterStep2.css";
import FormField from "../../components/FormField";
import Toast from "../../components/Toast";
import { signUpWithEmail } from "../../services/authService";

function RegisterStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const nickname = location.state?.nickname;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!nickname) {
      setToastMessage("닉네임 정보가 없습니다. 처음부터 다시 시도해주세요.");
      return;
    }

    if (!email.trim() || !password || !passwordConfirm) {
      setToastMessage("모든 항목을 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setToastMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);

    const { error: signUpError } = await signUpWithEmail(
      email.trim(),
      password,
      nickname
    );

    if (signUpError) {
      setIsSubmitting(false);
      setToastMessage(signUpError.message || "회원가입에 실패했습니다.");
      return;
    }

    // 💡 기존의 복잡했던 setNickname(별도 닉네임 저장) 에러 핸들링 블록을 완전히 제거했습니다.
    // 계정 생성과 동시에 닉네임이 기록되므로 바로 다음 스텝으로 안전하게 이동합니다.
    setIsSubmitting(false);
    navigate("/register/step3", { 
      state: { 
        nickname, 
        email: email.trim(), 
        password 
      } 
    });
  };

  return (
    <div className="register-step2">
      <div className="register-step2__content">
        <h1 className="register-step2__title">
          로그인에 사용할
          <br />
          정보를 입력해주세요
        </h1>

        <div className="register-step2__fields">
          <div className="register-step2__email-field">
            <FormField
              id="email"
              label="이메일"
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <FormField
            id="password"
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormField
            id="passwordConfirm"
            label="비밀번호 재입력"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>

        <div className="register-step2__footer">
          <Toast message={toastMessage} visible={!!toastMessage} />
          <button
            type="button"
            className="register-step2__submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "가입 중..." : "다음으로"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterStep2;