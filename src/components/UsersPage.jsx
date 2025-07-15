import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users")
      .then((response) => {
        console.log("Users data:", response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleUserClick = (id) => {
    navigate(`/users/${id}`);
  };

  return (
    <div>
      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id} onClick={() => handleUserClick(user.id)}>
              {user.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersPage;
