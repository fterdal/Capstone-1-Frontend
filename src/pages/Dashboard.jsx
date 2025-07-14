import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    
    return (
        <div>
            <h3>This is the dashboard/new homepage to view all polls</h3>

            <button onClick={navigate("/polls/create")}>Create New Poll</button>
        </div>
    );
}