import React from 'react';
import './CSS/ProfileStyles.css';
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../shared";
import { useState, useEffect } from 'react';
import axios from 'axios';
import UserPollCard from './UserPollCard'; 

const ProfilePage = ({ user }) => {
  const [master, setMaster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  if (!user) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <p>Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/users/${user.id}`);
      setMaster(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) { 
      fetchUser();
    }
  }, [user?.id]);

  const handleUserClick = (id) => {
    navigate(`/polls/${id}`);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!master) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <p>User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-picture">
          <img 
            src={master.imageUrl || "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"} 
            alt={`${master.username}'s profile`}
            className="profile-img"
          />
        </div>
        
        <div className="profile-info">
          <h1 className="display-name">{master.username}</h1>
          <p className="username">@{master.username}</p>
          
          <div className="stats">
            <div className="stat-item">
              <span className="stat-count">{master.polls ? master.polls.length : 0}</span>
              <span className="stat-label">Polls</span>
            </div>
            <div className="stat-item">
              <span className="stat-count">{master.followersCount || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-count">{master.followingCount || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
          
          {master.bio && (
            <p className="bio">{master.bio}</p>
          )}
          
          <div className="profile-actions">
            <button className="follow-btn">Edit Profile</button>
            <button className="message-btn">View Drafts</button>
          </div>
        </div>
      </div>

      {master.polls && master.polls.length > 0 && (
        <div className="user-polls-section">
          <h2>My Polls ({master.polls.length})</h2>
          <div className="polls-container">
            {master.polls.map(poll => (
              <UserPollCard key={poll.id} poll={poll} onClick={() => handleUserClick(poll.id)}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;