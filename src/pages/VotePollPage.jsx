import React from "react";
import { useNavigate } from "react-router-dom";


const VotePollPage = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/polls/results");
  };

  return (
    <div className="vote-page">
      <h2>This is the voting page</h2>


        <button type="button" onClick={handleSubmit}>
          Submit Vote
        </button>
    </div>
  );
};

export default VotePollPage;
