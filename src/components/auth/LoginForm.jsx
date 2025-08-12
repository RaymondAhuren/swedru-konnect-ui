import { useState } from "react";
import { NavLink } from "react-router";
import { loginService } from "../../services/userServices";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginHandler = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await loginService(email, password)
      // Replace with your actual login logic
      console("Logging in with:", { email, password });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Handle successful login (redirect would typically happen here)
      alert("Login successful!");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      {/* Animated Logo */}
      <div className="mb-12 animate-fade-in">
        <NavLink
          to="/"
          className="flex items-center gap-3 group transform transition-transform duration-300 hover:scale-105"
          aria-label="Home"
        >
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-extrabold text-2xl w-14 h-14 flex items-center justify-center rounded-xl group-hover:shadow-xl transition-all duration-300">
            SK
          </div>
          <div className="leading-tight text-left">
            <p className="text-sm font-medium tracking-wider text-gray-500 uppercase">
              Swedru
            </p>
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Konnect
            </p>
          </div>
        </NavLink>
      </div>

      {/* Glassmorphism Form Container */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden p-0 border border-white/20">
        <div className="p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500/90">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={loginHandler}>
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700/90"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                autoComplete="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all placeholder-gray-400/70"
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700/90"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all placeholder-gray-400/70"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl shadow-md hover transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                loading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Divider with subtle gradient */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200/50"></div>
          </div>
        </div>

        <div className="p-6 text-center bg-gray-50/30">
          <p className="text-gray-600/90">
            New to Swedru Konnect?{" "}
            <NavLink
              to="/register"
              className="font-medium text-purple-600 hover:text-purple-700 transition-colors duration-200"
            >
              Create account
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
