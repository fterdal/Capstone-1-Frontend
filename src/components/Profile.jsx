import React from 'react';
import './CSS/ProfileStyles.css';

const ProfilePage = ({ user }) => {
  if (!user) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-picture">
          <img 
            src={"https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"} 
            alt={`${user.username}'s profile`}
            className="profile-img"
          />
        </div>
        
        <div className="profile-info">
          <h1 className="display-name">{user.username}</h1>
          <p className="username">@{user.username}</p>
          
          <div className="stats">
            <div className="stat-item">
              <span className="stat-count">{user.postsCount || 0}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-count">{user.followersCount || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-count">{user.followingCount || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
          
          {user.bio && (
            <p className="bio">{user.bio}</p>
          )}
          
          <div className="profile-actions">
            <button className="follow-btn">Edit Profile</button>
            <button className="message-btn">View Drafts</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;