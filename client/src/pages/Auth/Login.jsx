import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the route the user came from, or default to "/"
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // After login, redirect to the previous page (or homepage if none)
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <div >
      <div className="register-container flex items-center justify-center flex-col h-screen bg-customBG text-textColor">
        <div className="form border bg-white  rounded-xl p-5 w-80 sm:w-96 ">
          <h1 className="text-center  mb-9 mt-2 text-3xl">
            Sign In
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:gap-5"
          >
            <input
              className="border-2 border-textColor rounded-lg outline-none px-4 py-2 w-full"
              type="email"
              name="email"
              id="email"
              required
              placeholder="email here..."
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border-2 border-textColor rounded-lg outline-none px-4 py-2 w-full"
              type="password"
              name="password"
              id="password"
              required
              placeholder="password here..."
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="bg-zinc-900 text-white px-4 py-2 w-full rounded-lg mb-5 ease duration-200 "
              type="submit"
            >
              Submit
            </button>
          </form>
          <p>
            Still not registered?{" "}
            <Link
              className=" font-bold hover:border-b-2 border-zinc-700"
              to="/"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
