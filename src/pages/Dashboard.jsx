import React, { useState } from "react";
import PollFormModal from "../components/PollFormModal";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h3>This is the dashboard/new homepage to view all polls</h3>

      <button onClick={() => setIsModalOpen(true)}>Create New Poll</button>

      <div className="poll-list">
        <ul>
          <li onClick={() => navigate("/vote")}>Front-end Frameworks Poll</li>
        </ul>
      </div>

      <PollFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
export default Dashboard;