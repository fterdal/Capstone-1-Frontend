import React, { useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { Link } from "react-router-dom";

// Initial state constants for easy reset
const initialQuestions = [{ questionTitle: "", options: ["", ""] }];
const initialDuration = "";

const Create = () => {
  const { isLoggedIn } = useContext(AuthContext);

  // State for questions and duration
  const [questions, setQuestions] = useState(initialQuestions);
  const [duration, setDuration] = useState(initialDuration);

  // Handle changes for question titles
  const handleQuestionChange = (qIdx, value) => {
    setQuestions(prev =>
      prev.map((q, idx) =>
        idx === qIdx ? { ...q, questionTitle: value } : q
      )
    );
  };

  // Handle changes for options
  const handleOptionChange = (qIdx, oIdx, value) => {
    setQuestions(prev =>
      prev.map((q, idx) =>
        idx === qIdx
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === oIdx ? value : opt
              )
            }
          : q
      )
    );
  };

  // Add an option to a question
  const handleAddOption = qIdx => {
    setQuestions(prev =>
      prev.map((q, idx) =>
        idx === qIdx
          ? { ...q, options: [...q.options, ""] }
          : q
      )
    );
  };

  // Remove last option from a question (keep at least 2)
  const handleDeleteOption = qIdx => {
    setQuestions(prev =>
      prev.map((q, idx) =>
        idx === qIdx && q.options.length > 2
          ? { ...q, options: q.options.slice(0, -1) }
          : q
      )
    );
  };

  // Add a new question (with 2 empty options)
  const handleAddQuestion = () => {
    setQuestions(prev => [...prev, { questionTitle: "", options: ["", ""] }]);
  };

  // Handle duration change
  const handleDurationChange = e => setDuration(e.target.value);

  // Reset the form to its initial state
  const handleDeleteDraft = () => {
    setQuestions(initialQuestions);
    setDuration(initialDuration);
  };

  // Duplicate the current poll (questions and duration)
  const handleDuplicatePoll = () => {
    // Deep copy to avoid reference issues
    const duplicatedQuestions = questions.map(q => ({
      questionTitle: q.questionTitle,
      options: [...q.options],
    }));
    setQuestions(duplicatedQuestions);
    setDuration(duration);
  };

  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();
    console.log("Submitted poll:", { questions, duration });
    // Add API call here
  };

  // If not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <div>
        <h2>You must be logged in to create a poll.</h2>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Timer Section */}
      <div>
        <label htmlFor="duration">Poll Duration (minutes):</label>
        <input
          type="number"
          id="duration"
          name="duration"
          min="1"
          value={duration}
          onChange={handleDurationChange}
          placeholder="Enter duration in minutes"
        />
      </div>

      {/* Questions Section */}
      {questions.map((q, qIdx) => (
        <div key={qIdx} style={{ border: "1px solid #ccc", margin: "1em 0", padding: "1em" }}>
          <label>
            Question {qIdx + 1}:
            <input
              type="text"
              value={q.questionTitle}
              onChange={e => handleQuestionChange(qIdx, e.target.value)}
              placeholder="Enter question"
              required
            />
          </label>
          {q.options.map((option, oIdx) => (
            <div key={oIdx}>
              <label>
                Option {oIdx + 1}:
                <input
                  type="text"
                  value={option}
                  onChange={e => handleOptionChange(qIdx, oIdx, e.target.value)}
                  placeholder={`Enter option ${oIdx + 1}`}
                  required
                />
              </label>
            </div>
          ))}
          <button type="button" onClick={() => handleAddOption(qIdx)}>
            Add Option
          </button>
          <button
            type="button"
            onClick={() => handleDeleteOption(qIdx)}
            disabled={q.options.length <= 2}
          >
            Delete Option
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAddQuestion}>
        Add Question
      </button>
      <button type="submit">Publish Poll</button>
      <button type="button" onClick={handleDeleteDraft}>
        Delete Draft
      </button>
      <button type="button" onClick={handleDuplicatePoll}>
        Duplicate Poll
      </button>
    </form>
  );
};

export default Create;
