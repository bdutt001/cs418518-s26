import { useState } from "react";
import "./Login.css";

export default function ForgotPassword() {
  const API_URL = import.meta.env.VITE_API_KEY;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setMessage("");

    if (!email.includes("@")) {
      setMessage("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const data = await res.json().catch(() => ({}));
      setMessage(data.message || "A reset link was sent if the email exists.");
    } catch (err) {
      console.error("Forgot password error:", err);
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="forgot-password">
      <h3>Forgot Password</h3>
      <form onSubmit={handleSubmit}>
        <p>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
          />
        </p>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {submitted && message && (
        <div
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 6,
            background: "#eef",
            border: "1px solid #99c",
            color: "#004",
          }}
        >
          {message}
        </div>
      )}

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        <a href="/login" style={{ color: "#007bff", textDecoration: "underline" }}>
          Back to Login
        </a>
      </p>
    </div>
  );
}