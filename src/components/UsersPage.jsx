import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CSS/UsersPage.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleUserClick = (id) => {
    navigate(`/users/${id}`);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-page">
      <h2>All Users</h2>
      <input
        className="search-input"
        type="text"
        placeholder="Search users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="user-list">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              className="user-card"
              onClick={() => handleUserClick(user.id)}
            >
              {user.imageUrl && (
                <img src={user.imageUrl} alt="profile" className="user-pfp" />
              )}
              <p className="user-name">{user.username}</p>
              {user.bio && <p className="user-bio">{user.bio}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersPage;
