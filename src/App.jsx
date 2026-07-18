import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage.jsx"
import Navigation from "./components/navigation.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ChatPage />} />
            </Routes>
            <Navigation />
        </BrowserRouter>
    );
}

export default App;
