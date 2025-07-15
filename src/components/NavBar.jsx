import React from "react";
import { Link } from "react-router-dom";
import "./NavBarStyles.css";

const NavBar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Rankzilla</Link>
        <Link to="/demo" className="nav-link">Demo</Link>
      </div>

      <div className="nav-links">

        

        {user ? (
          <div className="user-section">

        <Link to="/create-poll" className="nav-link">Create a poll</Link>


            <span className="username">Welcome, {user.username}!</span>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
