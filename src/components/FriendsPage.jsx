import React from "react";
import "./css/Friends.css";

const FriendsPage = () => {
  return (
    <div className="friends-container">
        <div className="friends-outline">
            <div className="top-section">
                <div className="profile">
                    <h1 className="friend-name">Friend Name</h1>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjZ-dan-ETK4XOBPsXrIvmnDzheVXo_97mXQ&s"></img>
                </div>
        <div className="stats">
            <div className="profile">
                <h3>Followers:</h3>
                <h3>35</h3>
            </div>
            <div className="profile">
                <h3>Following:</h3>
                <h3>256</h3>
            </div>
        </div>
      </div>
      <div className="middle-section">
        <div className="profile">
            <h3>Pinned Polls:</h3>
            <div className="image">
                <img src="https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/6749b96c71627968f9d5b6cb_survey-vs-questionnaire.webp"></img>
                <img src="https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/6749b96c71627968f9d5b6cb_survey-vs-questionnaire.webp"></img>
                <img src="https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/6749b96c71627968f9d5b6cb_survey-vs-questionnaire.webp"></img>
            </div>
        </div>
      </div>
      <div className="bottom-section">
        <div className="profile">
            <h3>Polls:</h3>
            <div className="image">
                <img src="https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/6749b96c71627968f9d5b6cb_survey-vs-questionnaire.webp"></img>
                <img src="https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/6749b96c71627968f9d5b6cb_survey-vs-questionnaire.webp"></img>
                <img src="https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/6749b96c71627968f9d5b6cb_survey-vs-questionnaire.webp"></img>
            </div>
            <div className="image">
                <img src="https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/6749b96c71627968f9d5b6cb_survey-vs-questionnaire.webp"></img>
                <img src="https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/6749b96c71627968f9d5b6cb_survey-vs-questionnaire.webp"></img>
                <img src="https://cdn.prod.website-files.com/6718da5ecf694c9af0e8d5d7/6749b96c71627968f9d5b6cb_survey-vs-questionnaire.webp"></img>
            </div>
        </div>
      </div>
        </div>
    </div>
  );
};

export default FriendsPage;
