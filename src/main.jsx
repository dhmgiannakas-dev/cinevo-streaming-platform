import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { MyListProvider } from "./context/MyListContext/MyListContext";
import SettingsProvider from "./context/SettingsContext/SettingsContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MyListProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </MyListProvider>
    </BrowserRouter>
  </StrictMode>
);