import React, { useState, useEffect, use } from "react";
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
import AboutUs from "./components/AboutUs";

//Alex branch
const App = () => {
  const [user, setUser] = useState(null);
  const [polls, setPolls] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPolls = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/polls`);
      setPolls(response.data);
    } catch {
      console.log("failed to get polls");
      setPolls([]);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(response.data);
    } catch (error) {
      console.error("Auth check failed:", error);
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

  console.log(user);

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
          <Route path="/users/:id" element={<UserCard />} />
          <Route path="/edit-draft" element={<DraftPoll user={user} />} />
          <Route path="/edit-draft/:id" element={<DraftPoll user={user} />} />
          <Route path="/AboutUs" element={<AboutUs />} />

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
