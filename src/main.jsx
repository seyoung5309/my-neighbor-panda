import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { PandaProvider } from "./context/PandaContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PandaProvider>
      <App />
    </PandaProvider>
  </StrictMode>
);