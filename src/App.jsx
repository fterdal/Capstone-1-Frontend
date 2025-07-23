import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { API_URL } from "./shared";
import { useNavigate } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import FriendsPage from "./components/FriendsPage";
import Friends from "./components/Friends";
import Profile from "./components/Profile";
import NewPoll from "./components/NewPoll";
import PollList from "./components/PollList";
import UsersPage from "./components/UsersPage";
import UserCard from "./components/UserCard";
import DraftPoll from "./components/DraftPoll";
import PollDetails from "./components/PollDetails";

const App = () => {
  const [user, setUser] = useState(null);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchPolls = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/polls`, {
        headers: getAuthHeaders()
      });
      setPolls(response.data);
    } catch (error) {
      console.log("Failed to get polls:", error);
      setPolls([]);
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchPolls();
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      navigate("/");
    }
  };

  return (
    <div>
      <NavBar user={user} onLogout={handleLogout} />
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/friends-page" element={<FriendsPage />} />
          <Route exact path="/" element={<Home />} />
          <Route exact path="/friends" element={<Friends />} />
          <Route exact path="new-poll" element={<NewPoll user={user} />} />
          <Route exact path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserCard currentUser={user}/>} />
          <Route path="/edit-draft" element={<DraftPoll user={user} />} />
          <Route path="/edit-draft/:id" element={<DraftPoll user={user} />} />

          <Route
            exact
            path="/me"
            element={<Profile user={user} authLoading={loading} />}
          />
          <Route exact path="poll-list" element={<PollList polls={polls} />} />
          <Route path="/polls/:id" element={<PollDetails user={user} />} />
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