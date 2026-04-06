import { Route, BrowserRouter as Router, Routes, Link, Navigate, useNavigate } from "react-router-dom";
import './App.css';
import Dashboard from "./Dashboard.jsx";
import Header from "./Header.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import ResetPassword from "./ResetPassword.jsx";
import CompleteLogin from "./CompleteLogin.jsx";
import AdvisingForm from "./AdvisingForm.jsx";
import AdvisingHistory from "./AdvisingHistory.jsx";


function AppRoutes() {

  const API_URL = import.meta.env.VITE_API_KEY;

  const navigate = useNavigate();

  async function handleRegister(formData) {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          u_first_name: formData.firstName,
          u_last_name: formData.lastName,
          u_email: formData.email,
          u_password: formData.password,
          u_is_verified: 0,
          u_is_admin: 0,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "User creation failed");
      }

      console.log("User created with ID:", result.data.insertId);

      const loginResponse = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          u_email: formData.email,
          u_password: formData.password,
        }),
      });

    const loginResult = await loginResponse.json();
    if (!loginResponse.ok) throw new Error(loginResult.message || "Login failed");

    console.log("User logged in:", loginResult.data);


    navigate("/dashboard");

    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  }

  return (
    <Routes>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path = "/login" element = {<Login/>} />
      <Route path="/complete-login" element={<CompleteLogin />} />
      <Route path = "/signup" element = {<Signup onRegister={handleRegister}/>} />
      <Route path = "/dashboard" element = {<Dashboard/>} />
      <Route path="/advising" element={<AdvisingForm />} />
      <Route path="/advising/:id" element={<AdvisingForm />} />
      <Route path="/advising-history" element={<AdvisingHistory />} />
    </Routes>
  );
}

function App() {
  return (
    <>
      <Router>
        <main>
          <AppRoutes />
        </main>
      </Router>
    </>
  ); 
}

export default App
