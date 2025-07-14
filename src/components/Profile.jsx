import React from 'react';
import './CSS/ProfileStyles.css';

const ProfilePage = () => {
  const user = {
    id: 1,
    username: 'FrankPetta',
    displayName: 'Frank',
    profilePicture: 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
    bio: 'Vote on my polls!!!',
    followersCount: 1234,
    followingCount: 567,
    postsCount: 89
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-picture">
          <img 
            src={user.profilePicture} 
            alt={`${user.displayName}'s profile`}
            className="profile-img"
          />
        </div>
        
        <div className="profile-info">
          <h1 className="display-name">{user.displayName}</h1>
          <p className="username">@{user.username}</p>
          
          <div className="stats">
            <div className="stat-item">
              <span className="stat-count">{user.postsCount}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-count">{user.followersCount}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-count">{user.followingCount}</span>
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