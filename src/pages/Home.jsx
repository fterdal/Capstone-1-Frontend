import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1>Welcome to Rankzilla</h1>
      <img className="react-logo" src="/react-logo.svg" alt="React Logo" />
      <button onClick={() => navigate("/login")}>Get Started</button>
    </>
  );
};

export default Home;
