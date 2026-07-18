import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/RegisterStep3.css";
import Toast from "../../components/Toast";
import { getCurrentUser } from "../../services/authService";
import { setLocation } from "../../services/locationService";

function RegisterStep3() {
  const navigate = useNavigate();

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

    setIsSubmitting(true);

    const { user, error: userError } = await getCurrentUser();
    if (userError || !user) {
      setIsSubmitting(false);
      setToastMessage("로그인 정보를 확인할 수 없습니다.");
      return;
    }

    const { error: locationError } = await setLocation(user.id, {
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