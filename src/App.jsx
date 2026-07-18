import TestPage from "./pages/TestPage";
import AuthCallback from "./pages/AuthCallback";

function App() {
  if (window.location.pathname === "/auth/callback") {
    return <AuthCallback />;
  }

  return <TestPage />;
}

export default App;