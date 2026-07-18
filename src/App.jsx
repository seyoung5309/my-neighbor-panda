import { useState, useEffect } from "react"; // ⭕ useState, useEffect 추가
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import ChatPage from "./pages/ChatPage.jsx";
import ChatRoomPageWrapper from "./pages/ChatRoomPageWrapper.jsx";
import Navigation from "./components/Navigation.jsx";
import MyPage from "./pages/MyPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import VillageMarketPage from "./pages/VillageMarketPage.jsx";
import SelectIngredientsPage from "./pages/SelectIngredientsPage.jsx";
import SplashPage from "./pages/SplashPage.jsx"; 

function AppContent() {
  const location = useLocation();
  
  // 1️⃣ 앱 전체에서 최초 1회만 스플래시를 보여주기 위한 상태
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false); // 2.5초 뒤 스플래시 종료
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // 2️⃣ 스플래시가 켜져 있는 2.5초 동안은 다른 라우터 안 보고 스플래시만 보여줌!
  if (showSplash) {
    return <SplashPage />;
  }

  const hideNavPaths = [
    "/login",             
    "/auth/callback",
    "/register/step1",
    "/register/step2",
    "/register/step3",
    "/register/step4",
    "/register/welcome",
  ];

  const isHideNav = hideNavPaths.includes(location.pathname);

  return (
    <>
      <Routes>
        {/* 3️⃣ 이제 원래대로 첫 메인 주소("/")는 HomePage가 담당합니다! */}
        {/* 이렇게 해둬야 LoginPage에서 로그인 성공 후 "/"로 이동할 때 무한루프가 안 납니다. */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/myingredients" element={<AddIngredientsPage />} />
        <Route path="/myingredients/select" element={<SelectIngredientsPage />} />
        <Route path="/register/step1" element={<RegisterStep1 />} />
        <Route path="/register/step2" element={<RegisterStep2 />} />
        <Route path="/register/step3" element={<RegisterStep3 />} />
        <Route path="/register/step3/palette" element={<PalettePage />} />
        <Route path="/register/step4" element={<MyCustomPandaPage />} />
        <Route path="/register/step4/palette" element={<PalettePage />} />
        <Route path="/register/welcome" element={<WelcomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:chatroomId" element={<ChatRoomPageWrapper />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/village" element={<VillageMarketPage />} />
      </Routes>

      {!isHideNav && <Navigation />}
    </>
  );
}

function App() {
  return (
    <PandaProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </PandaProvider>
  );
}

export default App;