import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import CurrentRank from "../components/result/CurrentRank";
import YourRankList from "../components/result/YourRankList";
import { API_URL } from "../shared";

const ViewResultsPage = ({ user }) => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState([]);
  const [userRanking, setUserRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [isPollEnded, setIsPollEnded] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pollRes, resultsRes, voteRes] = await Promise.all([
          fetch(`${API_URL}/api/polls/${id}`, { credentials: "include" }),
          fetch(`${API_URL}/api/polls/${id}/results`, { credentials: "include" }),
          fetch(`${API_URL}/api/polls/${id}/vote`, { credentials: "include" }),
        ]);

        if (!pollRes.ok) throw new Error("Failed to load poll info");
        if (!resultsRes.ok) throw new Error("Failed to load poll results");

        const pollData = await pollRes.json();
        const resultsData = await resultsRes.json();

        setPoll(pollData);
        setResults(resultsData.rounds || []);

        if (voteRes.ok) {
          const voteData = await voteRes.json();
          setUserRanking(voteData.ranks || []);
        }

        const deadline = new Date(pollData.deadline);
        const now = new Date();
        setIsPollEnded(now > deadline);

        if (pollData.deadline) {
          const ms = deadline - now;
          const days = Math.floor(ms / (1000 * 60 * 60 * 24));
          const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((ms / (1000 * 60)) % 60);
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) return <div style={{ padding: "2rem" }}>Loading poll results...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>Error: {error}</div>;


  return (
    <>
      <NavBar user={user} />
      <div className="view-results-page" style={{ padding: "2rem" }}>
        <h2>{poll.title}</h2>
        <p>
          Poll ends: {new Date(poll.deadline).toLocaleString()}
          <br />
          {isPollEnded ? (
            <strong style={{ color: "green" }}>Poll has ended</strong>
          ) : (
            <span style={{ color: "#888" }}>Time left: {timeLeft}</span>
          )}
        </p>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            marginTop: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "300px" }}>
            <h3>{isPollEnded ? "Final Results" : "Live Results"}</h3>
            <CurrentRank data={results} poll={poll} isEnded={isPollEnded} />
          </div>

          <div style={{ flex: 1, minWidth: "300px" }}>
            <h3>Your Ranking</h3>
            <YourRankList ranking={userRanking} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewResultsPage;