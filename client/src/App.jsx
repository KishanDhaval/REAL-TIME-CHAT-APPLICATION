import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/Auth/PrivateRoute";
import ChatPage from "./pages/ChatPage";

function App() {
  const { user, isLoading } = useAuthContext();
  if (isLoading) {
    return <center>Loading...</center>;
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/chats"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
        {/* Login and register */}
        <Route
          path="/"
          element={!user ? <Register /> : <Navigate to="/chats" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/chats" />}
        />
      </Routes>
    </>
  );
}

export default App;
