import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import NotFound from "./components/NotFound";
import { API_URL } from "./shared";
import VotePollPage from "./pages/VotePollPage";
import ViewResultsPage from "./pages/ViewResultsPage";
import Dashboard from "./pages/Dashboard"
import HostPollView from "./pages/HostPollView";
import PollFormModal from "./components/PollFormModal";
import UserProfile from "./pages/UserProfile";

const RouterComponent = process.env.NODE_ENV === 'development' ? HashRouter : BrowserRouter;

const App = () => {
  const [user, setUser] = useState(null);
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false);

  const cleanupExpiredGuestSession = () => {
    const savedGuestSession = localStorage.getItem('guestSession');
    if (savedGuestSession) {
      try {
        const guestUser = JSON.parse(savedGuestSession);
        const now = Date.now();
        const sessionAge = now - (guestUser.loginTime || 0);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours 

        // Kick out expired guest sessions 
        if (sessionAge > maxAge) {
          localStorage.removeItem('guestSession');
          return true;
        }
      } catch (e) {
        // If the data is corrupted or weird, just delete it
        localStorage.removeItem('guestSession');
        return true; // Cleaned up the mess
      }
    }
    return false; //nothing to clean up
  };

  const checkAuth = async () => {
    // Clean up any old guest sessions first 
    cleanupExpiredGuestSession();

    // Check if someone's logged in as a guest (stored in browser)
    const savedGuestSession = localStorage.getItem('guestSession');
    if (savedGuestSession) {
      try {
        const guestUser = JSON.parse(savedGuestSession);
        if (guestUser.isGuest) {
          setUser(guestUser);
          return; // Found guest user, no need to check server
        }
      } catch (e) {
        // Something went wrong with the saved data, just delete it
        localStorage.removeItem('guestSession');
      }
    }

    // Now check if someone's actually logged in with the server
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(response.data.user);
      // If they're properly logged in, we don't need the guest session anymore
      localStorage.removeItem('guestSession');
    } catch {
      console.log("Not authenticated");
      setUser(null);
    }
  };

  // Check who's logged in when the app first loads
  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      // If they're just a guest, just clear their browser data 
      if (user?.isGuest) {
        localStorage.removeItem('guestSession');
        setUser(null);
        return;
      }
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

  const handleOpenCreatePoll = () => {
    setIsCreatePollOpen(true);
  };
  const handleCloseCreatePoll = () => {
    setIsCreatePollOpen(false);
  };

  return (
    <div>
      <NavBar user={user} onLogout={handleLogout} onOpenCreatePoll={handleOpenCreatePoll} />
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route exact path="/" element={<Home />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/vote" element={<VotePollPage />} />
          <Route path="/polls/results" element={<ViewResultsPage />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/polls/host/:id" element={<HostPollView />} />
          <Route path="/polls/view/:identifier" element={<VotePollPage />} />
          {/* <Route path="/polls/view/:slug" element={<VotePollPage />} /> */}

          <Route path="/polls/view/:id" element={<VotePollPage />} />
          <Route path="/polls/view/:slug" element={<VotePollPage />} />
          <Route path="/users/:userId" element={<UserProfile />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {isCreatePollOpen && (
        <PollFormModal isOpen={isCreatePollOpen} onClose={handleCloseCreatePoll} />
      )}
    </div>
  );
};

const Root = () => {
  return (
    <RouterComponent>
      <App />
    </RouterComponent>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Root />);