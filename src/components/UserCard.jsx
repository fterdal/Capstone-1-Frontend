import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./CSS/UserCard.css";

const UserCard = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/users/${id}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="user-card-page">
      <h2>User Profile</h2>
      {user.imageUrl && (
        <img src={user.imageUrl} alt="profile" className="user-card-pfp" />
      )}
      <p className="user-card-name">{user.username}</p>
      {user.bio && <p className="user-card-bio">{user.bio}</p>}
    </div>
  );
};

export default UserCard;
