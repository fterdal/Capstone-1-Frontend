import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";

const PollCard = ({ poll, isOpen, onToggleMenu, currentUser, onEditDraft }) => {
  const navigate = useNavigate();

  const timeLeft = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = Math.max(0, end - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? "no end date" : `ends in ${days} day${days > 1 ? "s" : ""}`;
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to delete this poll?");
    if (!confirmed) return;
    try {
      await axios.delete(`${API_URL}/api/polls/${poll.id}`, {
        withCredentials: true,
      });
      console.log("✅ Poll deleted:", poll.id);
      window.location.reload();
    } catch (err) {
      console.error("❌ Failed to delete poll:", err);
      alert("Could not delete poll.");
    }
  };

  // Duplicate poll handler
  const handleDuplicate = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`http://localhost:8080/api/polls/${poll.id}/duplicate`, {}, { withCredentials: true });
      const newPollId = res.data?.id;
      if (newPollId) {
        navigate(`/polls/edit/${newPollId}`);
      } else {
        window.location.reload(); // fallback, but no alert
      }
    } catch (err) {
      console.error(" Failed to duplicate poll:", err);
      alert("Could not duplicate poll.");
    }
  };

  // invite handler: copy poll link to clipboard and show message
  const handleInvite = (e) => {
    e.stopPropagation();
    const pollUrl = poll.slug
      ? `${window.location.origin}/polls/view/${poll.slug}`
      : `${window.location.origin}/polls/results/${poll.id}`;
    navigator.clipboard.writeText(pollUrl)
      .then(() => {
        alert("Link copied to clipboard! Share this to invite others to vote.");
      })
      .catch(() => {
        alert("Failed to copy link.");
      });
  };

  const handleClick = () => {
        if (!poll?.id) {
            console.error("Poll is missing ID:", poll);
            return;
        }

        // Check if user owns the poll
        const isOwner = (poll.ownerId === currentUser?.id) || (poll.userId === currentUser?.id);
        
        // If it's a draft and user owns it, open edit modal
        if (poll.status === "draft" && isOwner) {
            onEditDraft(poll);
            return;
        }
        
        // If published and user owns it, go to host view
        if (poll.status === "published" && isOwner) {
            navigate(`/polls/host/${poll.id}`);
        } else {
            // For voting, always use slug route - backend expects /api/polls/slug/:slug
            if (poll.slug) {
                navigate(`/polls/view/${poll.slug}`);
            } else {
                console.error("Poll missing slug for public voting:", poll);
                alert("This poll cannot be accessed - missing slug");
                return;
            }
        }
        };


  return (
    <li className="poll-item" onClick={handleClick}>
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
            className={poll.status !== "draft" ? "disabled" : ""}
            onClick={(e) => {
              e.stopPropagation();
              if (poll.status === "draft") {
                navigate(`/polls/edit/${poll.id}`);
              }
            }}
          > Edit </li>
          <li
            onClick={async (e) => {
              e.stopPropagation();
              try {
                const res = await axios.post(`${API_URL}/api/polls/${poll.id}/duplicate`, {}, {
                  withCredentials: true,
                });
                const duplicated = await res.data;
                navigate(`/polls/edit/${duplicated.id}`);
              } catch (err) {
                console.error("Failed to duplicate:", err);
                alert("Could not duplicate poll.");
              }
            }}
          >
            Duplicate
          </li>
          <li
            onClick={(e) => {
              e.stopPropagation();
              const url = `${window.location.origin}/polls/view/${poll.slug}`;
              navigator.clipboard.writeText(url);
              alert("Poll link copied to clipboard!");
            }}
          >
            Invite
          </li>
          <li onClick={() => navigate(`/polls/results/${poll.id}`)}>Results</li>
        </ul>
      )}
    </li>
  );
};

export default PollCard;
