import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserCard = () => {
  const [name, setName] = useState([]);
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

  const handleUserClick = (userId) => {
    navigate(`/users/${userId.value}`);
  };

  return (
    <div>
      <h2>One User</h2>
    </div>
  );
};

export default UserCard;
