import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/change-password`, // Where user will go to set new password
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Check your email for password reset instructions!",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        {message && (
          <p
            className={`p-2 mb-4 rounded ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </p>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Sending..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
