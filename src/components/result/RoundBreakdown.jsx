import React, { useState } from "react";
import "./RoundBreakdown.css";

const RoundBreakdown = ({ rounds }) => {
  const [expand, setExpand] = useState(false);

  if (!rounds || rounds.length === 0) return null;

  return (
    <div className="round-breakdown">
      <button
        onClick={() => setExpand(!expand)}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {expand ? "Hide Breakdown" : "Show All Rounds"}
      </button>

      {expand && (
        <>
          <h3>Round-by-Round Breakdown</h3>
          {rounds.map((round) => (
            <div key={round.round} className="round-box">
              <h4>Round {round.round}</h4>
              <table>
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Votes</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {round.results &&
                    Object.entries(round.results).map(([id, result]) => (
                      <tr
                        key={id}
                        className={result.eliminated ? "eliminated" : ""}
                      >
                        <td>{result.name}</td>
                        <td>{result.count}</td>
                        <td>
                          {result.eliminated
                            ? "❌ Eliminated"
                            : "✔️ Remaining"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default RoundBreakdown;
