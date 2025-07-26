// /components/result/YourRankList.jsx
import React from "react";

const YourRankList = ({ ranking }) => {
  if (!ranking || ranking.length === 0){
  return <p style={{ fontStyle: "italic", color:"#888"}}>No Ballot</p>
}
const sorted = [...ranking].sort((a,b)=> a.rank - b.rank);
  
  return (
    <ol
      className="your-rank-list"
      style={{
        paddingLeft: "1rem",
        marginTop: "1rem",
      }}
    >
      {sorted.map(({pollOption}, index) => (
        <li key={index} style={{ marginBottom: "0.5rem" }}>
          {pollOption?.optionText || "No Option"}
        </li>
      ))}
    </ol>
  );
};

export default YourRankList;
