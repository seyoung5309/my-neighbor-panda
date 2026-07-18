import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/RegisterStep3.css";
import Toast from "../../components/Toast";

function RegisterStep3() {
  const navigate = useNavigate();

  const [si, setSi] = useState("");
  const [gun, setGun] = useState("");
  const [dong, setDong] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (!si.trim() || !gun.trim() || !dong.trim()) {
      setToastMessage("시/군/동을 모두 입력해주세요.");
      return;
    }

    // ⚠️ 해커톤 임시 처리: villages/location insert가 RLS로 막혀서
    // 실제 API 호출 없이 입력값만 받는 척하고 다음 화면으로 넘어감.
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/register/welcome");
    }, 400);
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