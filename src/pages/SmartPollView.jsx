import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";

const SmartPollView = ({ user }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAndRedirect = async () => {
      try {
        // Fetch poll details
        const res = await axios.get(`${API_URL}/api/polls/slug/${slug}`, {
          withCredentials: true,
        });

        const poll = res.data;

        // Log poll access
        await axios.post(`${API_URL}/api/polls/${slug}/track`, {}, {
          withCredentials: true,
        });

        // Redirect based on ownership
        const isOwner = user && (user.id === poll.ownerId || user.id === poll.creatorId);
        if (isOwner) {
          navigate(`/polls/host/${poll.id}`);
        } else {
          navigate(`/polls/view/${slug}`);
        }

      } catch (err) {
        console.error("Smart routing failed:", err);
        if (err.response?.status === 404) {
          setError("Poll not found.");
        } else {
          setError("Failed to load poll.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadAndRedirect();
  }, [slug, user, navigate]);

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading poll...</div>;
  if (error) {
    return (
      <div style={{ padding: "2rem", color: "red", textAlign: "center" }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>
    );
  }

  return null; // Never rendered, because we redirect once loaded
};

export default SmartPollView;
