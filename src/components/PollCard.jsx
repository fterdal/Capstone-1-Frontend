import React from "react";
import { useNavigate } from "react-router-dom";

const PollCard = ({ poll, isOpen, onToggleMenu, currentUser }) => {
  const navigate = useNavigate();

  const timeLeft = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = Math.max(0, end - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? "ends today" : `ends in ${days} day${days > 1 ? "s" : ""}`;
  };

  return (
    <li className="poll-item" onClick={() => navigate(`/polls/view/${poll.id}`)}>
      <div className="poll-body">
        <div className="poll-left">
          <div className="checkbox-placeholder" />
        </div>

        <div className="poll-main">
          <div className="poll-header">
            <strong>{poll.title}</strong>
            <button
              className="menu-button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMenu(poll.id);
              }}
            >
              ⋯
            </button>
          </div>

          <p className="poll-date">{new Date(poll.createdAt).toLocaleDateString()}</p>

          <div className="poll-meta">
            <span className="participants">
              👤 {poll.participants || 0}
            </span>
            <span className="deadline">🕓 {timeLeft(poll.deadline)}</span>
            <span className={`badge ${poll.status}`}>{poll.status}</span>
          </div>
        </div>
      </div>

      {isOpen && (
        <ul className="poll-menu" onClick={(e) => e.stopPropagation()}>
          <li
            className={poll.participated ? "disabled" : ""}
            onClick={() => {
              if (!poll.participated) navigate(`/polls/edit/${poll.id}`);
            }}
          >Edit</li>
          <li onClick={() => console.log("Duplicate", poll.id)}>Duplicate</li>
          <li onClick={() => console.log("Invite", poll.id)}>Invite</li>
          <li onClick={() => navigate(`/polls/results/${poll.id}`)}>Results</li>
          <li
            className={poll.status !== "draft" ? "disabled" : ""}
            onClick={() => {
              if (poll.status === "draft") console.log("Delete", poll.id);
            }}
          >Delete</li>
        </ul>
      )}
    </li>
  );
};

export default PollCard;
