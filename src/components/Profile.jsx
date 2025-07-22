import React from "react";
import "./CSS/ProfileStyles.css";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../shared";
import { useState, useEffect } from "react";
import axios from "axios";
import UserPollCard from "./UserPollCard";
import EditProfile from "./EditProfile"; // Add this import

const ProfilePage = ({ user, authLoading }) => {
  const [master, setMaster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [polls, setPolls] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false); // Add this state
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/users/${user.id}`);
      setMaster(response.data);
      const userPublished = response.data.polls.filter(
        (published) => (published.creator_id === user.id && published.status === "published")
      );
      setPolls(userPublished);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (id) => {
    navigate(`/polls/${id}`);
  };

  const handleDraftClick = (id) => {
    navigate(`/edit-draft`);
  };

const handleDeletePoll = async (id) => {
  try {
    await axios.delete(`${API_URL}/api/polls/${id}`);
    setPolls((prevPolls) => prevPolls.filter((p) => p.id !== id));
  } catch (err) {
    console.error("Failed to delete poll:", err);
    alert("Failed to delete poll");
  }
};
  // Add this function to handle profile updates
  const handleProfileUpdated = (updatedUser) => {
    setMaster(updatedUser);
    // Optionally update the user state in the parent component
    // if you have a way to update the global user state
  };

  // Add this function to handle edit profile button click
  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  // Add this function to handle closing edit profile
  const handleCloseEditProfile = () => {
    setShowEditProfile(false);
  };

  useEffect(() => {
    if (authLoading === false && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user?.id) {
      fetchUser();
    }
  }, [user?.id]);

  if (authLoading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

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
            src={
              master.imageUrl ||
              "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
            }
            alt={`${master.username}'s profile`}
            className="profile-img"
          />
        </div>

        <div className="profile-info">
          <h1 className="display-name">{master.username}</h1>
          <p className="username">@{master.username}</p>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-count">
                {polls ? polls.length : 0}
              </span>
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

          {master.bio && <p className="bio">{master.bio}</p>}

          <div className="profile-actions">
            <button onClick={() => handleDraftClick()} className="message-btn">View Drafts</button>
            <button className="follow-btn" onClick={handleEditProfile}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {polls && polls.length > 0 && (
        <div className="user-polls-section">
          <h2>My Polls ({polls.length})</h2>
          <div className="polls-container">
            {polls.map((poll) => (
              <UserPollCard
                key={poll.id}
                poll={poll}
                onClick={() => handleUserClick(poll.id)}
                onDelete={handleDeletePoll}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add the EditProfile modal */}
      {showEditProfile && (
        <EditProfile
          user={master}
          onProfileUpdated={handleProfileUpdated}
          onCancel={handleCloseEditProfile}
        />
      )}
    </div>
  );
};

export default ProfilePage;