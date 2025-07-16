import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Create from "./components/create";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import { API_URL } from "./shared";
import { AuthProvider } from "./components/AuthContext";
import Profile from "./components/Profile"; 
import Dashboard from "./components/dashboard";


const App = ({ user, setUser }) => {
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch {
      console.log("Not authenticated");
      setUser(null);
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      // Logout from our backend
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      navigate("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <NavBar user={user} onLogout={handleLogout} />
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/create" element={<Create setUser={setUser} />} />
          <Route exact path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const Root = () => {
  const [user, setUser] = React.useState(null);

  return (
    <AuthProvider user={user} setUser={setUser}>
      <Router>
        <App user={user} setUser={setUser} />
      </Router>
    </AuthProvider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
