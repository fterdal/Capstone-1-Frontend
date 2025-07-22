import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import CurrentRank from "../components/result/CurrentRank";
import YourRankList from "../components/result/YourRankList";

const dummyPoll = {
  title: "Where should we get catering from?",
   deadline: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
};

const dummyRankedResults = [
  { optionText: "Sushi Wave", count: 20 },
  { optionText: "Noodle House", count: 14 },
  { optionText: "Taco Palace", count: 12 },
  { optionText: "Pizza Central", count: 7 },
];

const dummyUserRanking = [
  { optionText: "Pizza Central" },
  { optionText: "Noodle House" },
  { optionText: "Taco Palace" },
  { optionText: "Sushi Wave" },
];

const ViewResultsPage = ({ user }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isPollEnded, setIsPollEnded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(dummyPoll.deadline);
      const diff = end - now;

      if (diff <= 0) {
        setIsPollEnded(true);
        setTimeLeft("Poll has ended.");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="view-results-page" style={{ padding: "2rem" }}>
        <h2>{dummyPoll.title}</h2>
        <p>
          Poll ends: {new Date(dummyPoll.deadline).toLocaleString()}
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
            <h3>Live Results</h3>
            <CurrentRank data={dummyRankedResults} poll={dummyPoll} isEnded={isPollEnded} />
          </div>

          <div style={{ flex: 1, minWidth: "300px" }}>
            <h3>Your Ranking</h3>
            <YourRankList ranking={dummyUserRanking} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewResultsPage;
