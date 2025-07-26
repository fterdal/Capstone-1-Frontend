import React, { useState } from "react";
import { Link } from "react-router-dom";
import PollFormModal from "./PollFormModal";
import "./NavBarStyles.css";

const NavBar = ({ user, onLogout }) => {
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <img src="https://i.imgur.com/yn48odO.png" alt="Rankzilla Logo" className="logo-img" />
        <Link to={user ? "/dashboard" : "/"} className="logo-link">
          <span className="brand-text">Rankzilla</span>
        </Link>
        <Link to="/demo" className="nav-link">Demo</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <div className="user-section">
            {/* ✅ Show modal trigger if user is logged in and not a guest */}
            {user.username && (
              <>
                <button
                  className="nav-link"
                  onClick={() => setIsPollModalOpen(true)}
                >
                  + Create a poll
                </button>
                <PollFormModal
                  isOpen={isPollModalOpen}
                  onClose={() => setIsPollModalOpen(false)}
                />
              </>
            )}

            <span className="username">Welcome, {user.username ? (
                <Link to={`/users/${user.id}`} className="username-link">
                  {user.username}
                </Link>
              ) : (
                "Guest"
              )}!</span>
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