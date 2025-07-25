import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { API_URL } from "./shared";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { auth0Config } from "./auth0-config";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import PublicUserFinder from "./components/PublicUserFinder";
import Friends from "./components/Friends";
import Profile from "./components/Profile";
import NewPoll from "./components/NewPoll";
import PollList from "./components/PollList";
import UsersPage from "./components/UsersPage";
import UserCard from "./components/UserCard";
import DraftPoll from "./components/DraftPoll";
import PollDetails from "./components/PollDetails";
import AboutUs from "./components/AboutUs";

const App = () => {
  const [user, setUser] = useState(null);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const {
    isAuthenticated,
    isLoading: auth0Loading,
    user: auth0User,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    if (!auth0Loading) {
      if (isAuthenticated && auth0User) {
        handleAuth0Login();
      } else {
        checkAuth();
      }
    }
  }, [isAuthenticated, auth0User, auth0Loading]);

  const handleAuth0Login = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/auth/auth0`,
        {
          auth0Id: auth0User.sub,
          email: auth0User.email,
          username: auth0User.nickname || auth0User.email?.split("@")[0],
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      setUser(response.data.user);
    } catch (error) {
      console.error("Auth0 login error:", error);
    } finally {
      setLoading(false);
    }
  };

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
    if (!auth0Loading && !isAuthenticated) {
      checkAuth();
      fetchPolls();
    }
  }, [auth0Loading, isAuthenticated]);

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
      
      if (isAuthenticated) {
        auth0Logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        });
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div>
      <NavBar user={user} onLogout={handleLogout} />
      <div className="app">
        <Routes>
          {/* Authentication routes */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          
          {/* Home route */}
          <Route path="/" element={<Home />} />
          
          {/* Profile routes */}
          <Route path="/me" element={<Profile user={user} authLoading={loading} />} />
          <Route path="/users/:id" element={<Friends user={user} authLoading={loading} />} />
          
          {/* Poll routes */}
          <Route path="/new-poll" element={<NewPoll user={user} />} />
          <Route path="/poll-list" element={<PollList polls={polls} />} />
          <Route path="/polls/:id" element={<PollDetails user={user} />} />
          
          {/* Draft routes */}
          <Route path="/edit-draft" element={<DraftPoll user={user} />} />
          <Route path="/edit-draft/:id" element={<DraftPoll user={user} />} />
          
          {/* User/Friends routes */}
          <Route path="/users" element={<UsersPage />} />
          <Route path="/search-friends" element={<PublicUserFinder currentUser={user} />} />
          
          {/* Other pages */}
          <Route path="/about-us" element={<AboutUs />} />
          
          {/* 404 route - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const Root = () => {
  return (
    <Auth0Provider {...auth0Config}>
      <Router>
        <App />
      </Router>
    </Auth0Provider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Root />);