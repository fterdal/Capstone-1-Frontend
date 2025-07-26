// /components/result/CurrentRank.jsx
import React from "react";

const CurrentRank = ({ data, poll }) => {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...sorted.map((opt) => opt.count));
  const isPollEnded = new Date() > new Date(poll?.deadline);

 return (
  <div className="current-rank" style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "1rem" }}>
    {sorted.map((option, index) => {
      const barWidth = (option.count / maxCount) * 100;

      return (
        <div
          key={index}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
            backgroundColor: index === 0 ? "#d4edda" : "#f8f9fa", // highlight winner
          }}
        >
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>{option.optionText}</strong> – {option.count} votes
            {index === 0 && isPollEnded && (
                <span
                style={{
                    background: "#28a745",
                    color: "white",
                    padding: "2px 6px",
                    marginLeft: "8px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                }}
                >
                🏆 Winner
                </span>
            )}
            </div>

          <div
            style={{
              height: "12px",
              background: "#007bff",
              width: `${barWidth}%`,
              transition: "width 0.3s ease-in-out",
              borderRadius: "4px",
            }}
          ></div>
        </div>
      );
    })}
  </div>
);
};

export default CurrentRank;
