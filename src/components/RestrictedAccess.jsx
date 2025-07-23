import React from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/RestrictedAccessStyles.css";

const RestrictedAccess = ({ requiresLogin = false, message = "You don't have permission to view this poll" }) => {
  const navigate = useNavigate();

  return (
    <div className="restricted-access-container">
      <div className="restricted-access-content">
        <div className="restricted-icon">🔒</div>
        <h2>Access Restricted</h2>
        <p className="restricted-message">{message}</p>
        
        {requiresLogin ? (
          <div className="login-prompt">
            <p>Please log in to view this poll.</p>
            <div className="action-buttons">
              <button 
                onClick={() => navigate("/login")}
                className="login-btn"
              >
                Log In
              </button>
              <button 
                onClick={() => navigate("/register")}
                className="register-btn"
              >
                Sign Up
              </button>
            </div>
          </div>
        ) : (
          <div className="restricted-info">
            <p>This poll has restricted access. You may need to:</p>
            <ul>
              <li>Be a follower of the poll creator</li>
              <li>Be friends with the poll creator</li>
              <li>Be specifically granted access by the creator</li>
            </ul>
            <button 
              onClick={() => navigate("/poll-list")}
              className="back-btn"
            >
              Back to Polls
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestrictedAccess;