import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { usePanda } from "../../context/PandaContext";
import Panda from "../../components/Panda";
import "../../styles/palette-page.css";

const TARGET_LABEL = {
  g: "눈 색",
  b: "피부 포인트색",
  w: "피부 바탕색",
};

export default function PalettePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { colors, setColors } = usePanda();

  const target = location.state?.target;

  const [hex, setHex] = useState(colors[target] ?? "#4F46E5");

  if (!target || !(target in colors)) {
    return (
      <div className="page">
        <p>잘못된 접근입니다. 이전 페이지에서 다시 시도해주세요.</p>
        <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>
    );
  }

  const handleConfirm = () => {
    setColors((prev) => ({
      ...prev,
      [target]: hex,
    }));
    navigate(-1);
  };

  const previewColors = { ...colors, [target]: hex };

  return (
    <div className="page palette-page">
      <div className="palette-header">
        <span className="palette-header-label">{TARGET_LABEL[target]}</span>
        <button
          type="button"
          className="palette-close-btn"
          onClick={() => navigate(-1)}
          aria-label="닫기"
        >
          ✕
        </button>
      </div>

      <div className="picker-wrapper">
        <HexColorPicker color={hex} onChange={setHex} />
      </div>

      <div className="hex-input-box">
        <span className="hex-prefix">#</span>
        <HexColorInput
          className="hex-input"
          color={hex}
          onChange={setHex}
          prefixed={false}
        />
      </div>

      <div className="panda-preview">
        <Panda g={previewColors.g} b={previewColors.b} w={previewColors.w} />
      </div>

      <button className="next-button" onClick={handleConfirm}>
        다음으로
      </button>
    </div>
  );
}