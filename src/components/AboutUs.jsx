import React from "react";
import "./CSS/AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <section>
        <h1>About Us</h1>
        <p className="styled-paragraph">
          This platform was built with a simple goal: to make decision-making
          fair, fast, and accessible to everyone.
        </p>
        <p className="styled-paragraph">
          Whether you're planning a night out, organizing an event, or just
          settling a debate, our ranked-choice poll system ensures the results
          reflect the group's true consensus.
        </p>
      </section>

      <section>
        <h2>Why Ranked-Choice?</h2>
        <p className="styled-paragraph">
          Traditional polls can be skewed by vote splitting or tactical voting.
          With ranked-choice, every vote counts more fairly. Voters rank the
          options in order of preference, and a winner is chosen through a
          series of instant-runoff rounds.
        </p>
        <p className="styled-paragraph">
          This method leads to more satisfying outcomes because it rewards broad
          support, not just a passionate minority.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
