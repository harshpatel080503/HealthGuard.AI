import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/new/authslice"; // Import login action

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_VERCEL}/api/v1/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const result = await response.json();
      const userData = result?.data;

      if (!userData?.role || !userData?.email) {
        throw new Error("Invalid response from server");
      }

      // Dispatch login action with email, role, and district (if present)
      dispatch(
        login({
          email: userData.email,
          role: userData.role,
          district: userData.district, // Will be undefined if not in API response
        })
      );

      // ✅ Navigate based on role
      if (userData.role === "district-head") {
        if (!userData.district) {
          setError("No district assigned. Access denied.");
          dispatch(logout()); // Logout if no district
        } else {
          navigate("/district-head/dashboard");
        }
      } else {
        throw new Error("Invalid role received");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };
  const handleBack = () => {
    navigate("/a-dmin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-40 backdrop-blur-lg border border-gray-300 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white shadow-md transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5 transition-transform transform group-hover:-translate-x-1" />
            Back to Home
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              District Login
            </h1>
            <p className="text-gray-600">AI Disease Surveillance System</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your admin email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-12 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
                ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Protected by Government of India
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
