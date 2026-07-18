import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PandaProvider } from "./context/PandaContext";
import LoginPage from "./pages/LoginPage.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import AddIngredientsPage from "./pages/AddIngredientsPage.jsx";
import RegisterStep1 from "./pages/register/RegisterStep1.jsx";
import RegisterStep2 from "./pages/register/RegisterStep2.jsx";
import RegisterStep3 from "./pages/register/RegisterStep3.jsx";
import MyCustomPandaPage from "./pages/register/MyCustomPandaPage.jsx";
import PalettePage from "./pages/register/PalettePage.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";

function App() {
  return (
    <PandaProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/myingredients" element={<AddIngredientsPage />}></Route>
          <Route path="/register/step1" element={<RegisterStep1 />} />
          <Route path="/register/step2" element={<RegisterStep2 />} />

          {/* TEMP: step3(지역 설정) 백엔드 오류로 판다 커스터마이징으로 임시 연결 */}
          <Route path="/register/step3" element={<MyCustomPandaPage />} />
          <Route path="/register/step3/palette" element={<PalettePage />} />

          <Route path="/register/step4" element={<MyCustomPandaPage />} />
          <Route path="/register/step4/palette" element={<PalettePage />} />

          <Route path="/register/welcome" element={<WelcomePage />} />
        </Routes>
      </BrowserRouter>
    </PandaProvider>
  );
}

export default App;