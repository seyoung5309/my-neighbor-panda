import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/RegisterStep1.css";
import FormField from "../../components/FormField";
import Toast from "../../components/Toast";
import { isNicknameAvailable } from "../../services/profileService";

function RegisterStep1() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleNext = async () => {
    if (!nickname.trim()) {
      setToastMessage("닉네임을 입력해주세요.");
      return;
    }

    setIsChecking(true);
    const { available, error } = await isNicknameAvailable(nickname.trim());
    setIsChecking(false);

    if (error) {
      setToastMessage("잠시 후 다시 시도해주세요.");
      return;
    }

    if (!available) {
      setToastMessage("이미 사용중인 닉네임입니다.");
      return;
    }

    navigate("/register/step2", { state: { nickname: nickname.trim() } });
  };

  return (
    <div className="register-step1">
      <div className="register-step1__content">
        <h1 className="register-step1__title">
          사용자님에 대한
          <br />
          정보를 입력해주세요
        </h1>

        <FormField
          id="nickname"
          label="이름"
          placeholder="이름을 입력해주세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <div className="register-step1__footer">
          <Toast message={toastMessage} visible={!!toastMessage} />
          <button
            type="button"
            className="register-step1__submit"
            onClick={handleNext}
            disabled={isChecking}
          >
            {isChecking ? "확인 중..." : "다음으로"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterStep1;