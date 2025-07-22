import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CSS/UserCard.css";
import { API_URL } from "../shared";

const UserCard = ({ currentUser }) => {
  console.log("UserCard rendered");

  const { id } = useParams();
  console.log("params id:", id);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userPolls, setUserPolls] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const fetchUserAndPolls = async () => {
      try {
        const [userRes, allPollsRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/${id}`),
          axios.get(`${API_URL}/api/polls`),
        ]);

        const userData = userRes.data;
        setUser(userData);
        setFollowersCount(userData.followers?.length || 0);
        setFollowingCount(userData.following?.length || 0);

        console.log("userData.id:", userData.id);
        console.log(
          "poll.creator_id values:",
          allPollsRes.data.map((p) => p.creator_id)
        );

        const pollsByUser = allPollsRes.data.filter(
          (poll) => poll.creator_id === userData.id && poll.status === "published"
        );
        setUserPolls(pollsByUser);

        if (currentUser?.id && userData.id !== currentUser.id) {
          checkFollowStatus(userData.id);
        }
      } catch (error) {
        console.error("Error fetching user or polls:", error);
      }
    };

    fetchUserAndPolls();
  }, [id, currentUser?.id]);

  const checkFollowStatus = async (userId) => {
    if (!currentUser?.id) return;

    try {
      const response = await axios.get(`${API_URL}/api/follows/${currentUser.id}/status/${userId}`);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    if (!currentUser?.id || !user?.id) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await axios.delete(`${API_URL}/api/follows`, {
          data: {
            follower_id: currentUser.id,
            following_id: user.id
          }
        });
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
      } else {
        await axios.post(`${API_URL}/api/follows`, {
          follower_id: currentUser.id,
          following_id: user.id
        });
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (!user) return <p>Loading...</p>;

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="user-card-page">
      <div className="user-profile-header">
        <div className="user-profile-info">
          {user.imageUrl && (
            <img src={user.imageUrl} alt="profile" className="user-card-pfp" />
          )}
          <div className="user-details">
            <h2 className="user-card-name">{user.username}</h2>
            <p className="user-handle">@{user.username}</p>
            {user.bio && <p className="user-card-bio">{user.bio}</p>}
            
            <div className="user-stats">
              <div className="stat-item">
                <span className="stat-count">{followersCount}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-count">{followingCount}</span>
                <span className="stat-label">Following</span>
              </div>
              <div className="stat-item">
                <span className="stat-count">{userPolls.length}</span>
                <span className="stat-label">Polls</span>
              </div>
            </div>
          </div>
        </div>

        {!isOwnProfile && currentUser && (
          <div className="user-actions">
            <button
              className={`follow-btn ${isFollowing ? 'following' : ''}`}
              onClick={handleFollow}
              disabled={followLoading}
            >
              {followLoading ? (
                'Loading...'
              ) : isFollowing ? (
                <span className="follow-text">Following</span>
              ) : (
                'Follow'
              )}
            </button>
          </div>
        )}
      </div>

      <div className="user-polls-section">
        <h3 className="user-polls-heading">Polls by {user.username}</h3>
        {userPolls.length === 0 ? (
          <p className="no-polls">This user hasn't created any polls yet.</p>
        ) : (
          <div className="user-poll-grid">
            {userPolls.map((poll) => (
              <div
                key={poll.id}
                className="user-poll-card"
                onClick={() => navigate(`/polls/${poll.id}`)}
              >
                <h4 className="poll-title">{poll.title}</h4>
                {poll.description && (
                  <p className="poll-description">{poll.description}</p>
                )}
                <div className="poll-meta">
                  <span className="poll-date">
                    {new Date(poll.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;