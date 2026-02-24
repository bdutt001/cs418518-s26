import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

/*
Login function sourced from course repository.

Nasreen Arif, https://github.com/nasreenarif/cs418518-s26/blob/60fa03240d225b28dc44ec02206acb077ce4354c/Project/client/src/Login.jsx
*/

export default function Login() {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  function handleInputChange(identifier, value) {
    if (identifier === "email") setEnteredEmail(value);
    else setEnteredPassword(value);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    // Basic client-side validation
    if (!enteredEmail.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (enteredPassword.trim().length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(import.meta.env.VITE_API_KEY + "/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // send the keys your backend expects
        body: JSON.stringify({
          u_email: enteredEmail,
          u_password: enteredPassword,
        })        
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json?.message || "Login failed");
        return;
      }

      // your backend response is: { status, message, result: user }
      const user = json.data ?? null;

      if (!user) {
        setError("Login succeeded but user data was missing.");
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(user));

// Used after API success
// Used inside event handlers
// Used conditionally
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const emailNotValid = submitted && !enteredEmail.includes("@");
  const passwordNotValid = submitted && enteredPassword.trim().length < 8;

  return (
    <div id="login">
      {error && (
        <div
          style={{
            background: "#fee",
            padding: 10,
            borderRadius: 6,
            marginBottom: 12,
            border: "1px solid #fca5a5",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="controls">
          <p>
            <label className={emailNotValid ? "invalid" : ""}>Email</label>
            <input
              type="email"
              value={enteredEmail}
              className={emailNotValid ? "invalid" : ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </p>

          <p>
            <label className={passwordNotValid ? "invalid" : ""}>Password</label>
            <input
              type="password"
              value={enteredPassword}
              className={passwordNotValid ? "invalid" : ""}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
          </p>
        </div>

        <div className="actions">
          {/* Better UX: link to signup route */}
          {/* Used for navigation triggered by user clicking UI
              Cleaner than using <a href>
              Does NOT reload the page */}
          <Link to="/signup" className="button" style={{ textAlign: "center" }}>
            Create a new account
          </Link>

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}