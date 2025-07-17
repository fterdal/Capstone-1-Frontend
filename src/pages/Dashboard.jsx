import React, { useState } from "react";
import PollFormModal from "../components/PollFormModal";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h3>This is the dashboard/new homepage to view all polls</h3>

      {/* Only show Create New Poll button for authenticated users with username (not guests) */}
      {user && user.username && (
        <button onClick={() => setIsModalOpen(true)}>Create New Poll</button>
      )}

      <div className="poll-list">
        <ul>
          <li onClick={() => navigate("/vote")}>Front-end Frameworks Poll</li>
        </ul>
      </div>

      {/* Only render PollFormModal for authenticated users */}
      {user && user.username && (
        <PollFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};
export default Dashboard;