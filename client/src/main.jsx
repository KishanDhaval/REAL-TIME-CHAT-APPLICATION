import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./context/ChatProvider.jsx";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <AuthContextProvider>
  <ChatProvider>
        <StrictMode>
          <App />
        </StrictMode>
  </ChatProvider>
      </AuthContextProvider>
    </BrowserRouter>,
);
