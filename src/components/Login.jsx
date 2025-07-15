import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import "./Login.css";

const Login = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Validate email or username based on mode
    if (isEmailMode) {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
    } else {
      if (!formData.username) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3 || formData.username.length > 20) {
        newErrors.username = "Username must be between 3 and 20 characters";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Only validate confirm password for signup
    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
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
      let endpoint, data;
      
      if (isLogin) {
        // For login, always use /auth/login with username (backend requirement)
        endpoint = "/auth/login";
        data = {
          username: isEmailMode ? formData.email : formData.username,
          password: formData.password,
        };
      } else {
        // For signup, use different endpoints based on email/username mode
        if (isEmailMode) {
          endpoint = "/auth/signup/email";
          data = {
            email: formData.email,
            password: formData.password,
          };
        } else {
          endpoint = "/auth/signup/username";
          data = {
            username: formData.username,
            password: formData.password,
          };
        }
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
        const action = isLogin ? "login" : "signup";
        setErrors({ general: `An error occurred during ${action}` });
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

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleGuestLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email/Username Toggle */}
          <div className="form-group">
            <div style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="radio"
                  name="loginMode"
                  checked={!isEmailMode}
                  onChange={() => setIsEmailMode(false)}
                  style={{ marginRight: "5px" }}
                />
                Username
              </label>
              <label style={{ marginLeft: "20px" }}>
                <input
                  type="radio"
                  name="loginMode"
                  checked={isEmailMode}
                  onChange={() => setIsEmailMode(true)}
                  style={{ marginRight: "5px" }}
                />
                Email
              </label>
            </div>
          </div>

          {/* Username or Email Input */}
          {isEmailMode ? (
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? "error" : ""}
              />
              {errors.username && (
                <span className="error-text">{errors.username}</span>
              )}
            </div>
          )}

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

          {!isLogin && (
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
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading 
              ? (isLogin ? "Logging in..." : "Creating account...") 
              : (isLogin ? "Login" : "Sign Up")
            }
          </button>

          <button 
            type="button" 
            onClick={handleGuestLogin}
            className="guest-button"
          >
            Sign in as Guest
          </button>
        </form>

        <p className="auth-link">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={toggleMode} 
            className="toggle-button"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
