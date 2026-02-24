import { Route, BrowserRouter as Router, Routes, Link, useNavigate } from "react-router-dom";
import './App.css';
import Dashboard from "./Dashboard.jsx";
import Header from "./Header.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

function AppRoutes() {

  const navigate = useNavigate();

  async function handleRegister(formData) {
    try {
      const response = await fetch("http://localhost:3000/user", {
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

      const loginResponse = await fetch("http://localhost:3000/user/login", {
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
            <Route path = "/login" element = {<Login/>} />
            <Route path = "/signup" element = {<Signup onRegister={handleRegister}/>} />
            <Route path = "/dashboard" element = {<Dashboard/>} />
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
