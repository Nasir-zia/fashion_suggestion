import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Login = () => {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const error = await signIn(email, password);

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md transform transition duration-500 hover:scale-[1.02]"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Welcome Back
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg text-center font-medium">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold p-4 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
          <Link
            to="/forgot-password"
            className="text-blue-600 font-medium hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
