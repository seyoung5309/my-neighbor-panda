import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import AddIngredientsPage from "./pages/AddIngredientsPage.jsx";
import RegisterStep1 from "./pages/register/RegisterStep1.jsx";
import RegisterStep2 from "./pages/register/RegisterStep2.jsx";
import RegisterStep3 from "./pages/register/RegisterStep3.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ChatRoomPageWrapper from "./pages/ChatRoomPageWrapper.jsx";
import Navigation from "./components/Navigation.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/myingredients" element={<AddIngredientsPage />}></Route>
        <Route path="/register/step1" element={<RegisterStep1 />} />
        <Route path="/register/step2" element={<RegisterStep2 />} />
        <Route path="/register/step3" element={<RegisterStep3 />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:chatroomId" element={<ChatRoomPageWrapper />} />
      </Routes>
      <Navigation />
    </BrowserRouter>
  );
}

export default App;