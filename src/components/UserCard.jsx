import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CSS/UserCard.css";

const UserCard = () => {
  console.log("UserCard rendered");

  const { id } = useParams();
  console.log("params id:", id);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userPolls, setUserPolls] = useState([]);

  useEffect(() => {
    const fetchUserAndPolls = async () => {
      try {
        const [userRes, allPollsRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/users/${id}`),
          axios.get("http://localhost:8080/api/polls"),
        ]);

        const userData = userRes.data;
        setUser(userData);

        console.log("userData.id:", userData.id);
        console.log(
          "poll.creator_id values:",
          allPollsRes.data.map((p) => p.creator_id)
        );

        const pollsByUser = allPollsRes.data.filter(
          (poll) => poll.creator_id === userData.id
        );
        setUserPolls(pollsByUser);
      } catch (error) {
        console.error("Error fetching user or polls:", error);
      }
    };

    fetchUserAndPolls();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="user-card-page">
      <h2>User Profile</h2>
      {user.imageUrl && (
        <img src={user.imageUrl} alt="profile" className="user-card-pfp" />
      )}
      <p className="user-card-name">{user.username}</p>
      {user.bio && <p className="user-card-bio">{user.bio}</p>}

      <h3 className="user-polls-heading">Polls by {user.username}</h3>
      {userPolls.length === 0 ? (
        <p>This user hasn't created any polls yet.</p>
      ) : (
        <ul className="user-poll-list">
          {userPolls.map((poll) => (
            <li
              key={poll._id || `${poll.title}-${poll.creator_id}`}
              className="user-poll-item"
              onClick={() => navigate(`/polls/${poll._id}`)}
              style={{ cursor: "pointer" }}
            >
              {poll.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserCard;
