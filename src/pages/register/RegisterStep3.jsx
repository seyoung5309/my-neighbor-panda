import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/RegisterStep3.css";
import Toast from "../../components/Toast";
import { signUpWithEmail } from "../../services/authService";
import { updateNickname } from "../../services/profileService";
import { setLocation } from "../../services/locationService";

function RegisterStep3() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { nickname, email, password } = routerLocation.state || {};

  const [si, setSi] = useState("");
  const [gun, setGun] = useState("");
  const [dong, setDong] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (!si.trim() || !gun.trim() || !dong.trim()) {
      setToastMessage("시/군/동을 모두 입력해주세요.");
      return;
    }

    if (!nickname || !email || !password) {
      setToastMessage("이전 단계 정보가 없습니다. 처음부터 다시 시도해주세요.");
      return;
    }

    setIsSubmitting(true);

    // 1. 실제 계정 생성 (이 시점에 처음으로 auth.users + profile row가 생성됨)
    const { data: signUpData, error: signUpError } = await signUpWithEmail(
      email,
      password
    );

    if (signUpError || !signUpData?.user) {
      setIsSubmitting(false);
      console.error("회원가입 에러 상세내용:", signUpError);
      setToastMessage("회원가입에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    const userId = signUpData.user.id;

    // 2. Step1에서 고른 닉네임을 실제로 반영
    // (트리거가 만들어준 임시 닉네임을 사용자가 고른 것으로 교체)
    const { error: nicknameError } = await updateNickname(userId, nickname);

    if (nicknameError) {
      setIsSubmitting(false);
      setToastMessage("닉네임 저장에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    // 3. 지역 저장 (자동으로 마을 매칭/생성됨)
    const { error: locationError } = await setLocation(userId, {
      c: si.trim(),
      g: gun.trim(),
      d: dong.trim(),
    });

    setIsSubmitting(false);

    if (locationError) {
      setToastMessage("지역 설정에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    navigate("/register/complete");
  };

  return (
    <div className="register-step3">
      <div className="register-step3__content">
        <h1 className="register-step3__title">
          사용자님에 대한
          <br />
          정보를 입력해주세요
        </h1>

        <div className="register-step3__fields">
          <div className="register-step3__field">
            <input
              className="register-step3__input"
              value={si}
              onChange={(e) => setSi(e.target.value)}
              placeholder="시"
            />
            <span className="register-step3__arrow">˅</span>
          </div>
          <div className="register-step3__field">
            <input
              className="register-step3__input"
              value={gun}
              onChange={(e) => setGun(e.target.value)}
              placeholder="군"
            />
            <span className="register-step3__arrow">˅</span>
          </div>
          <div className="register-step3__field">
            <input
              className="register-step3__input"
              value={dong}
              onChange={(e) => setDong(e.target.value)}
              placeholder="동"
            />
            <span className="register-step3__arrow">˅</span>
          </div>
        </div>

        <div className="register-step3__footer">
          <Toast message={toastMessage} visible={!!toastMessage} />
          <button
            type="button"
            className="register-step3__submit"
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? "저장 중..." : "다음으로"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterStep3;