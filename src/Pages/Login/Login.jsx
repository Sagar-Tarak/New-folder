import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import useAuthStore from "../../store/useAuthStore";

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    if (!email.trim()) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/i.test(email))
      return "Please enter a valid email.";
    if (!password) return "Password is required.";
    if (password.length < 6)
      return "Password should be at least 6 characters long.";
    return "";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const problem = validateInputs();
    if (problem) {
      setErrorMessage(problem);
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const valid = email === "admin@gmail.com" && password === "password";

      if (valid) {
        login("demo-token");
        navigate("/dashboard");
      } else {
        setErrorMessage(
          "Invalid credentials. Try admin@gmail.com / password"
        );
      }
    } catch (e) {
      console.error("Login error:", e);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-[#F1F5F9] overflow-hidden">

      {/* LEFT SECTION */}
      <div className="flex flex-col justify-center px-8 md:px-16 w-full lg:w-1/2 h-screen overflow-auto">
        
        {/* Logo */}
        <div className="mb-8">
          <div className="h-12 w-12 rounded-lg bg-slate-900 flex items-center justify-center text-white">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {/* Welcome text */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-slate-600">
            Please enter your credentials to sign in!
          </p>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="mb-6 text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
            {errorMessage}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@gmail.com"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <EnvelopeIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-500" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="••••••"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setIsPasswordVisible((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {isPasswordVisible ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <button
            type="button"
            className="text-sm text-slate-900 underline"
          >
            Forgot password?
          </button>

          {/* Sign in button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg
            transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-8">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="px-2 text-sm bg-white text-slate-500">
              or continue with
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50">
              Google
            </button>

            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50">
              Github
            </button>
          </div>
        </div>

        {/* Signup */}
        <p className="mt-8 text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <button className="font-semibold text-slate-900 hover:underline">
            Sign up
          </button>
        </p>
      </div>

      {/* RIGHT SECTION (image) */}
      <div className="hidden lg:flex flex-1 bg-slate-100 h-screen">
        <img
          src="/auth-side-bg.png"
          alt="side"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default LoginPage;
