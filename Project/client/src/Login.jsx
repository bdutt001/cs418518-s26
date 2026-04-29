import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

import ReCAPTCHA from "react-google-recaptcha";


/*
Login function sourced from course repository.

Nasreen Arif, https://github.com/nasreenarif/cs418518-s26/blob/60fa03240d225b28dc44ec02206acb077ce4354c/Project/client/src/Login.jsx
*/

export default function Login() {
  const API_URL = import.meta.env.VITE_API_KEY;

  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  const [token, setToken] = useState(null);

  

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [infoMessage, setInfoMessage] = useState("");

  const navigate = useNavigate();

  function handleInputChange(identifier, value) {
    if (identifier === "email") setEnteredEmail(value);
    else setEnteredPassword(value);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (!enteredEmail.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (enteredPassword.trim().length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!token) {
      setError("Please complete the reCAPTCHA.");
      return;
    }

    setLoading(true);

    try {
       // Verify reCAPTCHA
      const captchaRes = await fetch(import.meta.env.VITE_API_KEY + "/user/verify-recaptcha", 
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({token}),
        }
      );

      const captchaJson = await captchaRes.json().catch(() => ({}));

      if(!captchaRes.ok) {
        setError(captchaJson?.message || "reCAPTCHA verification failed.");
        return;
      }
     
      const res = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      if (res.ok) {
        setInfoMessage("A login link has been sent to your email. Check your inbox to complete login.");
        return;
      }

      setError("");
      setSubmitted(true);

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
      <h3 className="login-title">Login</h3>
      <form onSubmit={handleLogin}>
        <div className="controls">
          <p>
            <label className={emailNotValid ? "invalid" : ""}>Email: </label>
            <input
              type="email"
              value={enteredEmail}
              className={emailNotValid ? "invalid" : ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </p>

          <p>
            <label className={passwordNotValid ? "invalid" : ""}>Password: </label>
            <input
              type="password"
              value={enteredPassword}
              className={passwordNotValid ? "invalid" : ""}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
          </p>
        </div>

        <p style={{ marginTop: 10 }}>
          <a href="/forgot-password">Forgot Password?</a>
        </p>
        
        <div className="actions">
          <Link to="/signup" className="button" 
          style={{ 
            textAlign: "center",
            padding: 10,
            }}>
            Create a new account
          </Link>
          
          <ReCAPTCHA sitekey={import.meta.env.VITE_SITE_KEY}
          onChange={(value) => setToken(value)}/>
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Log In"}
          </button>

          {infoMessage && (
              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 6,
                  background: "#eef",
                  border: "1px solid #99c",
                  color: "#004",
                  textAlign: "center",
                }}
              >
                {infoMessage}
              </div>
          )}
        </div>
      </form>
    </div>
  );
}