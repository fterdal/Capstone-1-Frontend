import React from "react";
import NavBar from "../components/NavBar";
import CurrentRank from "../components/result/CurrentRank";
import YourRankList from "../components/result/YourRankList";

// Dummy poll and rankings
const dummyPoll = {
  title: "Where should we get catering from?",
  deadline: "2025-08-01T12:00:00Z",
};

const dummyRankedResults = [
  { optionText: "Taco Palace", count: 48 },
  { optionText: "Pizza Central", count: 37 },
  { optionText: "Noodle House", count: 21 },
  { optionText: "Sushi Wave", count: 14 },
];

const dummyUserRanking = [
  { optionText: "Pizza Central" },
  { optionText: "Noodle House" },
  { optionText: "Taco Palace" },
  { optionText: "Sushi Wave" },
];

const ViewResultsPage = ({ user }) => {
  return (
    <>
      <NavBar user={user} />
      <div className="view-results-page" style={{ padding: "2rem" }}>
        <h2>{dummyPoll.title}</h2>
        <p>Poll ends: {new Date(dummyPoll.deadline).toLocaleString()}</p>

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
            <CurrentRank data={dummyRankedResults} />
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
