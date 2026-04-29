import { useState } from "react";
import Field from "./Field";
import "./Signup.css";

/*
Signup function sourced from course repository.

Nasreen Arif, https://github.com/nasreenarif/cs418518-s26/blob/60fa03240d225b28dc44ec02206acb077ce4354c/Project/client/src/Signup.jsx
*/

export default function Signup({ onRegister }) {
  const API_URL = import.meta.env.VITE_API_KEY;
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (!passwordRegex.test(form.password)) {
      e.password =
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
    }
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);

    if (Object.keys(v).length === 0) {
    fetch(`${API_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        u_first_name: form.firstName,
        u_last_name: form.lastName,
        //uin: form.uin,
        u_email: form.email.toLowerCase(),
        u_password: form.password,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to register");
        alert("Registration successful! Please verify your email before logging in.");
      })
      .catch((err) => {
        console.error(err);
        alert(`Registration failed: ${err.message}`);
      });
    }
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h3 className="signup-title">Create Account</h3>

      <div
        style = {{
          padding: 10
          }}
        >
        <Field label="First Name:" error={errors.firstName}>
          <input
            className={`signup-input ${errors.firstName ? "error" : ""}`}
            value={form.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
          />
        </Field>

        <Field label="Last Name:" error={errors.lastName}>
          <input
            className={`signup-input ${errors.lastName ? "error" : ""}`}
            value={form.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
          />
        </Field>

        {/* <Field label="UIN:" error={errors.uin}>
          <input
            className={`signup-input ${errors.uin ? "error" : ""}`}
            value={form.uin}
            onChange={(e) => updateField("uin", e.target.value)}
          />
        </Field> */}

        <Field label="Email:" error={errors.email}>
          <input
            className={`signup-input ${errors.email ? "error" : ""}`}
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </Field>

        <Field label="Password:" error={errors.password}>
          <input
            type="password"
            className={`signup-input ${errors.password ? "error" : ""}`}
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
          />
        </Field>

        <Field label="Confirm Password:" error={errors.confirmPassword}>
          <input
            type="password"
            className={`signup-input ${errors.confirmPassword ? "error" : ""}`}
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
          />
        </Field>
      </div>

      <button className="signup-btn" type="submit">
        Sign Up
      </button>
    </form>
  );
}

