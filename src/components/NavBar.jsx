import React from "react";
import { Link } from "react-router-dom";
import "./NavBarStyles.css";

const NavBar = ({ user, onLogout, onOpenCreatePoll }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to={user ? "/dashboard" : "/"}>Rankzilla</Link>
        <Link to="/demo" className="nav-link">
          Demo
        </Link>
      </div>

      <div className="nav-links">
        {user ? (
          <div className="user-section">
            {/* Only show "Create a poll" for authenticated users with username (not guests) */}
            {user.username && (
              <button className="nav-link" onClick={onOpenCreatePoll}>
                Create a poll
              </button>
            )}

            <span className="username">
              Welcome,{" "}
              {user.username ? (
                <Link to={`/users/${user.id}`} className="username-link">
                  {user.username}
                </Link>
              ) : (
                "Guest"
              )}
              !
            </span>
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
