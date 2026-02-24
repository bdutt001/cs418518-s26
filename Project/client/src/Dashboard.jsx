import { Navigate, useNavigate } from "react-router-dom";

/*
Dashboard function sourced from course repository.

Nasreen Arif, https://github.com/nasreenarif/cs418518-s26/blob/60fa03240d225b28dc44ec02206acb077ce4354c/Project/client/src/Dashboard.jsx
*/

export default function Dashboard() {
    const navigate = useNavigate();

    const stored = localStorage.getItem("loggedInUser");
    const user = stored ? JSON.parse(stored) : null;

    function handleLogout() {
        localStorage.removeItem("loggedInUser");
        navigate("/login", { replace: true });
    }

    // If no user, redirect immediately
    if (!user) return <Navigate to="/login" replace />;

    return (
        <>
            <>
                <h2>Dashboard</h2>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </>
            <>
                <h3>User Info</h3>
                <>
                    <strong>First Name</strong> <span>{user.u_first_name}</span>
                    <strong>Last Name</strong> <span>{user.u_last_name}</span>
                    <strong>Email</strong> <span>{user.u_email}</span>
                </>
            </>
        </>
    
    );
}