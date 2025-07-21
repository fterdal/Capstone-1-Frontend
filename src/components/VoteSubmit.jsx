import React, { useState, useEffect } from "react";
import VoteForm from "./VoteForm";

const VoteSubmit = () => {

    const handleSubmit = async () => {
        setSubmitting(true);
    
        try {
           await fetch(`http://localhost:8080/api/polls/${poll.id}/votes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              pollId: poll.id,
              rankings: rankings,
            }),
          });
    
          alert("Vote submitted!");
          setRankings({});
        } catch (err) {
          console.error("Failed to submit vote", err);
          alert("Failed to submit vote.");
        } finally {
          setSubmitting(false);
        }
      };

    
};


export default VoteSubmit;