// /components/result/YourRankList.jsx
import React from "react";

const YourRankList = ({ ranking }) => {
  return (
    <ol
      className="your-rank-list"
      style={{
        paddingLeft: "1rem",
        marginTop: "1rem",
      }}
    >
      {ranking.map((option, index) => (
        <li key={index} style={{ marginBottom: "0.5rem" }}>
          {option.optionText}
        </li>
      ))}
    </ol>
  );
};

export default YourRankList;
