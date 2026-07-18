import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import AddIngredientsPage from "./pages/AddIngredientsPage.jsx";
import RegisterStep1 from "./pages/register/RegisterStep1.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/myingredients" element={<AddIngredientsPage />}></Route>
        <Route path="/register/step1" element={<RegisterStep1 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
