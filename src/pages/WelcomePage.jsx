import { useNavigate } from "react-router-dom";
import { usePanda } from "../context/PandaContext";
import Panda from "../components/Panda";
import "../styles/welcome-page.css";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { colors } = usePanda();

  const handleStart = () => {
    // TODO: 실제 메인 페이지 경로로 바꿔주세요
    navigate("/myingredients");
  };

  return (
    <div className="page welcome-page">
      <h1>
        이웃집 판다에
        <br />
        오신 것을 환영해요!
      </h1>

      <div className="welcome-panda-wrapper">
        <div className="panda-preview welcome-panda">
          <Panda g={colors.g} b={colors.b} w={colors.w} />
        </div>
      </div>

      <button className="start-button" onClick={handleStart}>
        시작하기
      </button>
    </div>
  );
}