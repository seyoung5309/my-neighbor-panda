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
import MyHistory from "./pages/MyHistory.jsx";
import HomePage from "./pages/HomePage.jsx";
import VillageMarketPage from "./pages/VillageMarketPage.jsx";

function AppContent() {
    const location = useLocation();

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
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/myingredients" element={<AddIngredientsPage />} />
                <Route path="/MyHistory" element={<MyHistory />} />

                <Route path="/register/step1" element={<RegisterStep1 />} />
                <Route path="/register/step2" element={<RegisterStep2 />} />

                <Route path="/register/step3" element={<RegisterStep3 />} />
                <Route
                    path="/register/step3/palette"
                    element={<PalettePage />}
                />

                <Route path="/register/step4" element={<MyCustomPandaPage />} />
                <Route
                    path="/register/step4/palette"
                    element={<PalettePage />}
                />

                <Route path="/register/welcome" element={<WelcomePage />} />

                <Route path="/chat" element={<ChatPage />} />
                <Route
                    path="/chat/:chatroomId"
                    element={<ChatRoomPageWrapper />}
                />
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
