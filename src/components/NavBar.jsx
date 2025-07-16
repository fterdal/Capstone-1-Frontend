import React from "react";
import { Link } from "react-router-dom";
import "./NavBarStyles.css";

const NavBar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Instapoll</Link>
      </div>
      <div className="nav-links">
        {/* Always show Home and Create a Poll */}
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/create" className="nav-link">
          Create a Poll
        </Link>
        {/* Show Dashboard only if logged in */}
        {user && (
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
        )}
        {/* Show Login/Sign Up if not logged in */}
        {!user ? (
          <div className="auth-links">
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </div>
        ) : (
          <div className="user-section">
            <span className="username">Welcome, {user.username}!</span>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
