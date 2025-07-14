import React from "react";
import { Link } from "react-router-dom";
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
            <span className="username">Welcome, {user.username}!</span>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>

          </div>
        ) : (
          <div className="auth-links">
            <Link to="/friends" className="nav-link">
              FriendsPage
            </Link>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
            <div className="Will move to the if true section when auth and login are complete">
              <Link to ="/me" className="nav-link">
                Profile
              </Link>
              <Link to="/friends" className="nav-link">
                Friends
              </Link>
              <Link to="/new-poll" className="nav-link">
                Create a Poll
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
