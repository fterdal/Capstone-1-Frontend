import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
//import "./ProfileStyles.css";

const Profile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(`${API_URL}/auth/me`, formData, {
        withCredentials: true,
      });

      setUser(res.data.user);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Update failed. Try again.");
    }
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            disabled
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
