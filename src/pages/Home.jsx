import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="home-container">
      <h1 className="home-title">Welcome to Rankzilla</h1>
      <p className="home-description">
        Rankzilla lets people vote with nuance. Instead of selecting just one option, voters rank choices—and we figure out the winner fairly.
      </p>
      <button className="get-started-btn" onClick={() => navigate("/login")}>
        Get Started
      </button>
    </main>
  );
};

export default Home;
