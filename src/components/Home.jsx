import React from "react";
import { Link } from "react-router-dom";
import "./CSS/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero */}
      <section>
        <h1 className="main-title">Create a poll in seconds</h1>
        <p className="subtitle styled-paragraph">
          Want to ask your friends where to go Friday night or arrange a meeting
          with co-workers? Create a poll – and get answers in no time.
        </p>
        <div>
          <Link to="/new-poll">
            <button>Create a poll</button>
          </Link>
        </div>
        <p className="note styled-paragraph">No signup required</p>
      </section>

      {/* Ballot system explanation */}
      <section>
        <h2>How our voting system works</h2>
        <p className="styled-paragraph">
          We use a method called <strong>Instant Runoff Voting (IRV)</strong>,
          also known as <strong>ranked-choice voting</strong>. Voters rank all
          available options in order of preference—1st, 2nd, 3rd, and so on.
        </p>
        <p className="styled-paragraph">
          If no option receives a majority of first-choice votes, the option
          with the fewest is eliminated, and those votes are transferred to each
          voter's next preferred option. This elimination process continues in
          rounds until one option has a majority.
        </p>
        <p className="styled-paragraph">
          This ensures the winner is the most broadly accepted choice rather
          than just the most popular first pick.
        </p>
        <Link to="/new-poll">
          <button>Create a poll</button>
        </Link>
      </section>

      {/* Config Options */}
      <section>
        <h2>Simple polls with powerful options</h2>
        <ul>
          <li>🕒 Set voting deadlines</li>
          <li>🔒 Prevent duplicate votes</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>
          Ready to get started? <span>It's free!</span>
        </h2>
        <div>
          <Link to="/new-poll">
            <button>Create a poll</button>
          </Link>
          <Link to="/signup">
            <button>Sign up</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
