import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePanda } from "../../context/PandaContext";
import Panda from "../../components/Panda";
import "../../styles/panda-register.css";

const COLOR_OPTIONS = [
  { target: "g", label: "눈 색" },
  { target: "b", label: "피부 포인트색" },
  { target: "w", label: "피부 바탕색" },
];

export default function MyCustomPandaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = usePanda();

  // 어떤 옵션을 선택했는지만 저장 (아직 이동 X)
  const [selectedTarget, setSelectedTarget] = useState(null);

  const handleSelect = (target) => {
    // 같은 걸 다시 누르면 선택 해제되게
    setSelectedTarget((prev) => (prev === target ? null : target));
  };

  const handleNext = () => {
    if (selectedTarget) {
      // step3 / step4 어느 경로로 들어와도 현재 경로 기준 상대 이동
      navigate(`${location.pathname}/palette`, {
        state: { target: selectedTarget },
      });
      return;
    }

    // 색상 옵션을 선택하지 않고 다음으로 누르면 다음 등록 단계로
    navigate("/register/welcome");
  };

  return (
    <div className="page">
      <h1>
        나만의 캐릭터를
        <br />
        설정해보세요
      </h1>

      <div className="option-list">
        {COLOR_OPTIONS.map(({ target, label }) => (
          <button
            key={target}
            className={`option-button ${
              selectedTarget === target ? "selected" : ""
            }`}
            onClick={() => handleSelect(target)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="panda-preview">
        <Panda g={colors.g} b={colors.b} w={colors.w} />
      </div>

      <button className="next-button" onClick={handleNext}>
        다음으로
      </button>
    </div>
  );
}