import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import "./CSS/EditProfileStyles.css";

const EditProfile = ({ user, onProfileUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        imageUrl: user.imageUrl || ""
      });
      setImagePreview(user.imageUrl || "");
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "imageUrl") {
      setImagePreview(value);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
    setImagePreview(url);
  };

  const validateForm = () => {
  if (!formData.username.trim()) {
    setError("Username is required");
    return false;
  }

  if (formData.username.length < 3) {
    setError("Username must be at least 3 characters long");
    return false;
  }

  if (formData.email && formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
    setError("Please enter a valid email address");
    return false;
  }

  if (formData.bio && formData.bio.length > 160) {
    setError("Bio must be 160 characters or less");
    return false;
  }

  return true;
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    console.log("Submitting profile update:", formData); 
    
    const response = await axios.patch(
      `${API_URL}/api/users/${user.id}`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    setSuccess("Profile updated successfully!");
    
    if (onProfileUpdated) {
      onProfileUpdated(response.data);
    }

    setTimeout(() => {
      onCancel();
    }, 0);

  } catch (error) {
    console.error("Profile update error:", error);
    console.error("Error response:", error.response?.data); 
    
    setError(
      error.response?.data?.error || 
      error.response?.data?.message ||
      "Failed to update profile. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    setError("");
    setSuccess("");
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        imageUrl: user.imageUrl || ""
      });
      setImagePreview(user.imageUrl || "");
    }
    onCancel();
  };

  return (
    <div className="edit-profile-overlay">
      <div className="edit-profile-modal">
        <div className="edit-profile-header">
          <h2>Edit Profile</h2>
          <button 
            className="close-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="success-message">
              <p>{success}</p>
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="form-group profile-picture-section">
            <label>Profile Picture</label>
            <div className="image-preview-container">
              <img
                src={
                  imagePreview || 
                  "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
                }
                alt="Profile preview"
                className="profile-preview-img"
                onError={(e) => {
                  e.target.src = "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg";
                }}
              />
            </div>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleImageUrlChange}
              placeholder="Enter image URL"
              className="form-input"
              disabled={loading}
            />
            <small>Enter a URL for your profile picture</small>
          </div>

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="form-input"
              required
              disabled={loading}
              maxLength="30"
            />
            <small>{formData.username.length}/30 characters</small>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="form-input"
              disabled={loading}
            />
            <small>Optional - used for account recovery</small>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              className="form-textarea"
              rows="4"
              disabled={loading}
              maxLength="160"
            />
            <small>{formData.bio.length}/160 characters</small>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;