import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { API_URL } from "../shared";

const Signup = ({ setUser }) => {
  const [formData, setFormData] = useState({
    identifier: "", // Single field for email or username
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-detect if input is email or username
  const isEmailInput = (value) => {
    return /\S+@\S+\.\S+/.test(value);
  };

  const validateForm = () => {
    const newErrors = {};
    const isEmail = isEmailInput(formData.identifier);

    // Validate email or username based on what user typed
    if (!formData.identifier) {
      newErrors.identifier = "Email or username is required";
    } else if (isEmail) {
      // If it looks like an email, validate as email
      if (!/\S+@\S+\.\S+/.test(formData.identifier)) {
        newErrors.identifier = "Please enter a valid email";
      }
    } else {
      // If it doesn't look like email, validate as username
      if (formData.identifier.length < 3 || formData.identifier.length > 20) {
        newErrors.identifier = "Username must be between 3 and 20 characters";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const isEmail = isEmailInput(formData.identifier);
      let endpoint, data;

      // Use different endpoints based on auto-detected type
      if (isEmail) {
        endpoint = "/auth/signup/email";
        data = {
          email: formData.identifier,
          password: formData.password,
        };
      } else {
        endpoint = "/auth/signup/username";
        data = {
          username: formData.identifier,
          password: formData.password,
        };
      }

      const response = await axios.post(`${API_URL}${endpoint}`, data, {
        withCredentials: true,
      });

      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: "An error occurred during signup" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign Up</h2>

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identifier">
              Email or Username:
              {formData.identifier && (
                <span style={{ fontSize: "0.8em", color: "#666", marginLeft: "5px" }}>
                  ({isEmailInput(formData.identifier) ? "Email detected" : "Username detected"})
                </span>
              )}
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your email or username"
              className={errors.identifier ? "error" : ""}
            />
            {errors.identifier && (
              <span className="error-text">{errors.identifier}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
