import React from "react";
import "./CSS/Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Poll Website(name)</h1>
        <p>Slogen</p>
        <div className="landing-buttons">
          <Link to="/poll-list" className="btn">
            Explore Polls
          </Link>
          <Link to="/signup" className="btn btn-alt">
            Get Started
          </Link>
        </div>
      </header>

      <section className="features">
        <div className="feature-box">
          <h3>📊 Create Polls</h3>
          <p>Quickly make opinion-based or multiple-choice polls in seconds.</p>
        </div>
        <div className="feature-box">
          <h3>🗳️ Vote Instantly</h3>
          <p>No delays. Real-time feedback with clear results.</p>
        </div>
        <div className="feature-box">
          <h3>🔗 Share Anywhere</h3>
          <p>
            Spread your poll link across platforms. No sign-up needed to vote.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
