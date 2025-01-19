import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";

function App() {
  const { user, isLoading } = useAuthContext();
  if (isLoading) {
    return <center>Loading...</center>;
  }

  return (
    <>
      <Toaster />
      <Routes>
      <Route path="/" element={<Home />} />
        {/* Login and register */}
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;
