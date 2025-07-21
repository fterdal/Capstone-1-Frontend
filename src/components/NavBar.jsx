import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import "./CSS/NavBarStyles.css";

const NavBar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Home</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <div className="user-section">
            <span>Welcome, {user.username}!</span>
            <div>
              <Link to="/me" className="nav-link">
                Profile
              </Link>
              <Link to="/users" className="nav-link">
                Users
              </Link>
              <Link to="/friends" className="nav-link">
                Friends
              </Link>
            </div>
              <Dropdown />
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/poll-list" className="nav-link">
              Public Polls
            </Link>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
