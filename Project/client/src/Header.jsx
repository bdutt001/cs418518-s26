import { NavLink } from "react-router-dom";
import './Header.css';


/*
Header function sourced from course repository.

Nasreen Arif, https://github.com/nasreenarif/cs418518-s26/blob/60fa03240d225b28dc44ec02206acb077ce4354c/Project/client/src/Header.jsx
*/

export default function Header() {
    return (
        <nav className="header-nav">
            <ul>
                <li>
                    <NavLink
                        to="/login"
                        className={({ isActive }) => isActive ? "active-link" : ""}
                    >
                        Login
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/signup"
                        className={({ isActive }) => isActive ? "active-link" : ""}
                    >
                        Sign Up
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}