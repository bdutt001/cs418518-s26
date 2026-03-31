import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Dashboard.css";

/*
Dashboard function sourced from course repository.

Nasreen Arif, https://github.com/nasreenarif/cs418518-s26/blob/60fa03240d225b28dc44ec02206acb077ce4354c/Project/client/src/Dashboard.jsx
*/

export default function Dashboard() {
  const navigate = useNavigate();

  const stored = localStorage.getItem("loggedInUser");
  const storedUser = stored ? JSON.parse(stored) : null;

  const [user, setUser] = useState(storedUser);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.u_first_name || "",
    lastName: user?.u_last_name || "",
  });

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.firstName.trim() || !form.lastName.trim()) {
        alert("Both first and last name are required");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/user/${user.u_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            u_first_name: form.firstName,
            u_last_name: form.lastName,
        }),
        });

        if (!response.ok) {
        const errData = await response.json();
        alert(`Failed to update user: ${errData.message}`);
        return;
        }

        const updatedUser = { ...user, u_first_name: form.firstName, u_last_name: form.lastName };

        setUser(updatedUser);
        setForm({
        firstName: updatedUser.u_first_name,
        lastName: updatedUser.u_last_name,
        });

        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

            setIsEditing(false);
    } catch (err) {
            console.error("Error updating user:", err);
            alert("Error while updating user");
        }
    }

  // ========================
  // Change password handler
  // ========================
  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordMessage("");

    if (newPassword.length < 8) {
      setPasswordMessage("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/user/change-password/${user.u_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setPasswordMessage(data.message || "Failed to update password");
        return;
      }

      // Success
      setPasswordMessage("Password updated successfully. Please log in again.");

      // Force logout
      localStorage.removeItem("loggedInUser");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setPasswordMessage("Something went wrong");
    }
  }


  function handleLogout() {
    localStorage.removeItem("loggedInUser");
    navigate("/login", { replace: true });
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      {user.u_is_admin ? (
        <div>
          <h3>Admin Dashboard</h3>
        </div>
      ) : (
          <div>
            <h3>Student Dashboard</h3>
            <div className="student-view">
            <section className="info-section">  
              <div className="user-info">
            
              <h3>User Info</h3>

              <div className="info-row">
                <strong>Name:</strong>
                {!isEditing ? (
                  <>
                    <span>{user.u_first_name} {user.u_last_name}</span>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                  </>
                ) : (
                  <>
                    <input
                      value={form.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      placeholder="First name"
                    />
                    <input
                      value={form.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      placeholder="Last name"
                    />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                  </>
                )}
              </div>
            
              <div className="info-row">
                <strong>Email:</strong>
                <span>{user.u_email}</span>
              </div>
            </div>

            <div className="info-row">

            {!showChangePassword ? (
              <button onClick={() => setShowChangePassword(true)}>
                Change Password
              </button>
            ) : (
              <div className="password-form">
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button onClick={handleChangePassword}>Save</button>
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>
    
        <section className="advising section">
          <h3>
            Course Advising
          </h3>
          <div className="course-advising">
            <button onClick={() => navigate("/advising-history")}>
              View History
            </button>
            <button onClick={() => navigate("/advising")}>
              Manage Advising
            </button>
          </div>
        </section>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )}
  </div>
)};
