import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage.jsx";
import ChatRoomPageWrapper from "./pages/ChatRoomPageWrapper.jsx";
import Navigation from "./components/navigation.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chat/:chatroomId" element={<ChatRoomPageWrapper />} />
            </Routes>
            <Navigation />
        </BrowserRouter>
    );
}

export default App;