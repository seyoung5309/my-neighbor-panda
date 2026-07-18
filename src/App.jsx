import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import AddIngredientsPage from "./pages/AddIngredientsPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route
                    path="/myingredients"
                    element={<AddIngredientsPage />}
                ></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
