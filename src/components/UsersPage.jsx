import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate } from "react-router-dom";
import "./CSS/UsersPage.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios

      .get(`${API_URL}/api/admins/users`, {withCredentials: true})
      .then((response) => {
        setUsers(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        if (error.response && error.response.status === 403) {
          setError("Access denied. Only users with admin privileges can view this page.");
        } else {
          setError("Failed to fetch users. Please try again later.");
        }
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
      {error && <p className="error-message">{error}</p>}
      <input
        className="search-input"
        type="text"
        placeholder="Search users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredUsers.length === 0 && !error ? (
        <p>No users found.</p>
      ) : !error ? (
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
      ) : null}
    </div>
  );
};

export default UsersPage;
