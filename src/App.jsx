import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import NotFound from "./components/NotFound";
import { API_URL } from "./shared";
import VotePollPage from "./pages/VotePollPage";
import ViewResultsPage from "./pages/ViewResultsPage";
import Dashboard from "./pages/Dashboard"
import HostPollView from "./pages/HostPollView";


const App = () => {
  const [user, setUser] = useState(null);

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
          <Route exact path="/" element={<Home />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/vote" element={<VotePollPage />} />
          <Route path="/polls/results" element={<ViewResultsPage />}/>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/host/poll/view" element={<HostPollView/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const Root = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Root />);