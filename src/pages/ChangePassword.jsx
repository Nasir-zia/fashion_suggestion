import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const { updatePassword } = useAuth(); // We'll create updatePassword in AuthContext
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    setLoading(true);
    const error = await updatePassword(password);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Password updated successfully!" });
      setTimeout(() => navigate("/"), 2000); // Redirect to SplashScreen
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleChangePassword}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>

        {message && (
          <p
            className={`p-2 mb-4 rounded text-center ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </p>
        )}

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 border rounded mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
