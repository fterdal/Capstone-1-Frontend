import React from "react";
import "./CSS/ProfileStyles.css";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../shared";
import { useState, useEffect } from "react";
import axios from "axios";
import UserPollCard from "./UserPollCard";
import EditProfile from "./EditProfile"; 

const ProfilePage = ({ user, authLoading }) => {
  const [master, setMaster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [polls, setPolls] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/users/${user.id}`);
      setMaster(response.data);
      
      setFollowers(response.data.followers || []);
      setFollowing(response.data.following || []);
      
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

  const handleProfileUpdated = (updatedUser) => {
    setMaster(updatedUser);
    setFollowers(updatedUser.followers || []);
    setFollowing(updatedUser.following || []);
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleCloseEditProfile = () => {
    setShowEditProfile(false);
  };

  const handleShowFollowers = () => {
    setShowFollowers(true);
    setShowFollowing(false);
  };

  const handleShowFollowing = () => {
    setShowFollowing(true);
    setShowFollowers(false);
  };

  const handleCloseModal = () => {
    setShowFollowers(false);
    setShowFollowing(false);
  };

  const handleUserProfileClick = (userId) => {
    console.log("Navigate to user profile:", userId);
    handleCloseModal();
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
    <>
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
              
              <button 
                className="stat-item clickable-stat stat-button" 
                onClick={handleShowFollowers}
                type="button"
              >
                <span className="stat-count">{followers.length || 0}</span>
                <span className="stat-label">Followers</span>
              </button>
              
              <button 
                className="stat-item clickable-stat stat-button" 
                onClick={handleShowFollowing}
                type="button"
              >
                <span className="stat-count">{following.length || 0}</span>
                <span className="stat-label">Following</span>
              </button>
            </div>

            {master.bio && <p className="bio">{master.bio}</p>}

            <div className="profile-actions">
              <button onClick={() => handleDraftClick()} className="message-btn">
                View Drafts
              </button>
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

        {showEditProfile && (
          <EditProfile
            user={master}
            onProfileUpdated={handleProfileUpdated}
            onCancel={handleCloseEditProfile}
          />
        )}
      </div>

      {showFollowers && (
        <div className="followers-modal-overlay" onClick={handleCloseModal}>
          <div className="followers-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Followers ({followers.length})</h3>
              <button className="close-btn" onClick={handleCloseModal}>✕</button>
            </div>
            <div className="followers-list">
              {followers.length === 0 ? (
                <p className="no-followers">No followers yet</p>
              ) : (
                followers.map((follower) => (
                  <div 
                    key={follower.id} 
                    className="follower-item"
                    onClick={() => handleUserProfileClick(follower.id)}
                  >
                    <img
                      src={
                        follower.imageUrl || 
                        "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
                      }
                      alt={follower.username}
                      className="follower-avatar"
                    />
                    <div className="follower-info">
                      <span className="follower-username">{follower.username}</span>
                      <span className="follower-handle">@{follower.username}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showFollowing && (
        <div className="followers-modal-overlay" onClick={handleCloseModal}>
          <div className="followers-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Following ({following.length})</h3>
              <button className="close-btn" onClick={handleCloseModal}>✕</button>
            </div>
            <div className="followers-list">
              {following.length === 0 ? (
                <p className="no-followers">Not following anyone yet</p>
              ) : (
                following.map((followedUser) => (
                  <div 
                    key={followedUser.id} 
                    className="follower-item"
                    onClick={() => handleUserProfileClick(followedUser.id)}
                  >
                    <img
                      src={
                        followedUser.imageUrl || 
                        "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
                      }
                      alt={followedUser.username}
                      className="follower-avatar"
                    />
                    <div className="follower-info">
                      <span className="follower-username">{followedUser.username}</span>
                      <span className="follower-handle">@{followedUser.username}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;