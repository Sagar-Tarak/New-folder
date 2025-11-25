import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  // Form values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Basic form validation
  function validateForm() {
    if (!email) return "Email is required.";
    const emailCheck = /^\S+@\S+\.\S+$/;
    if (!emailCheck.test(email)) return "Enter a valid email address.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  }

  // Submit handler
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Fake delay to simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Demo credentials
      const isValid =
        email === "admin@gmail.com" && password === "password";

      if (isValid) {
        localStorage.setItem("token", "demo-token");
        if (onLogin) onLogin(true);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Try admin@gmail.com / password");
      }
    } catch (err) {
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  }


  
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:py-0 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="h-12 w-12 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back!
            </h1>
            <p className="text-slate-600">
              Please enter your credentials to sign in!
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>

              <div className="relative">
                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  autoComplete="email"
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <EnvelopeIcon className="h-5 w-5 text-teal-500" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  autoComplete="current-password"
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-left">
              <button
                type="button"
                className="text-sm text-slate-900 underline hover:text-slate-700"
              >
                Forgot password
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg 
              transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  or continue with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {/* Google */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 
                rounded-lg hover:bg-slate-50 transition"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c..."
                  />
                </svg>
                <span className="text-sm font-medium text-slate-700">Google</span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 
                rounded-lg hover:bg-slate-50 transition"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12..." />
                </svg>
                <span className="text-sm font-medium text-slate-700">Github</span>
              </button>
            </div>
          </div>

          {/* Sign up */}
          <p className="mt-8 text-center text-sm text-slate-600">
            Don’t have an account yet?{" "}
            <button type="button" className="font-semibold text-slate-900 hover:underline">
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="flex items-center justify-center pt-5 lg:block lg:w-1/2 lg:h-screen">
        <img
          src="/auth-side-bg.png"
          alt="side"
          className="h-[95vh] pl-80 w-auto object-cover"
        />
      </div>
    </div>
  );
}

export default LoginPage;
