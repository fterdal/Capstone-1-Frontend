import React from "react";
import "./CSS/ProfileStyles.css";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../shared";
import { useState, useEffect } from "react";
import axios from "axios";
import PollCard from "./PollCard";

const Friends = ({ user, authLoading }) => {
  const { id } = useParams(); 
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [polls, setPolls] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/users/${id}`, {
        headers: getAuthHeaders()
      });
      
      setProfileUser(response.data);
      setFollowers(response.data.followers || []);
      setFollowing(response.data.following || []);
      
      // Filter to show only published polls
      const userPublished = response.data.polls.filter(
        (poll) => poll.status === "published"
      );
      setPolls(userPublished);

      // Check if current user is following this profile user
      if (user && response.data.followers) {
        const isCurrentlyFollowing = response.data.followers.some(
          follower => follower.id === user.id
        );
        setIsFollowing(isCurrentlyFollowing);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response?.status === 404) {
        setError("User not found");
      } else if (error.response?.status === 403) {
        setError("You don't have permission to view this profile");
      } else {
        setError("Failed to load user profile");
      }
    } finally {
      setLoading(false);
    }
  };

const handleFollowToggle = async () => {
  if (!user) {
    alert("Please log in to follow users");
    return;
  }

  if (followLoading) return;

  try {
    setFollowLoading(true);
    
    if (isFollowing) {
      // Unfollow
      await axios.delete(`${API_URL}/api/follows`, {
        data: {
          follower_id: user.id,
          following_id: parseInt(id)
        },
        headers: getAuthHeaders()
      });
      setIsFollowing(false);
      setFollowers(prev => prev.filter(follower => follower.id !== user.id));
    } else {
      // Follow 
      await axios.post(`${API_URL}/api/follows`, {
        follower_id: user.id,
        following_id: parseInt(id)
      }, {
        headers: getAuthHeaders()
      });
      setIsFollowing(true);
      setFollowers(prev => [...prev, { id: user.id, username: user.username, imageUrl: user.imageUrl }]);
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    alert("Failed to update follow status. Please try again.");
  } finally {
    setFollowLoading(false);
  }
};

  const handlePollClick = (pollId) => {
    navigate(`/polls/${pollId}`);
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
    if (userId === user?.id) {
      navigate("/me");
    } else {
      navigate(`/users/${userId}`);
    }
    handleCloseModal();
  };

  useEffect(() => {
    if (id) {
      fetchUserProfile();
    }
  }, [id, user]);

  // Redirect to own profile if viewing own ID
  useEffect(() => {
    if (user && id && parseInt(id) === user.id) {
      navigate("/me");
    }
  }, [user, id, navigate]);

  if (authLoading || loading) {
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
          <button onClick={() => navigate("/poll-list")} className="back-btn">
            Back to Polls
          </button>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <p>User not found</p>
          <button onClick={() => navigate("/poll-list")} className="back-btn">
            Back to Polls
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="profile-wrapper">
        <div className="profile-page">
          <div className="profile-header">
            <div className="profile-picture">
              <img
                src={
                  profileUser.imageUrl ||
                  "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
                }
                alt={`${profileUser.username}'s profile`}
                className="profile-img"
              />
            </div>

            <div className="profile-info">
              <h1 className="display-name">{profileUser.username}</h1>
              <p className="username">@{profileUser.username}</p>

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

              {profileUser.bio && <p className="bio">{profileUser.bio}</p>}

              <div className="profile-actions">
                <button 
                  onClick={() => navigate("/poll-list")}
                  className="message-btn"
                >
                  Back to Polls
                </button>
                
                {user && (
                  <button 
                    className={`follow-btn ${isFollowing ? 'following' : ''}`}
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                  >
                    {followLoading 
                      ? "Loading..." 
                      : isFollowing 
                        ? "Unfollow" 
                        : "Follow"
                    }
                  </button>
                )}
              </div>
            </div>
          </div>

          {polls && polls.length > 0 && (
            <div className="user-polls-section">
              <h2>{profileUser.username}'s Polls ({polls.length})</h2>
              <div className="polls-container">
                {polls.map((poll) => (
                  <PollCard
                    key={poll.id}
                    poll={poll}
                    onClick={() => handlePollClick(poll.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {polls.length === 0 && (
            <div className="user-polls-section">
              <h2>{profileUser.username}'s Polls</h2>
              <p className="no-polls">This user hasn't published any polls yet.</p>
            </div>
          )}
        </div>
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

export default Friends;