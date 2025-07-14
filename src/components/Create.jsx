import React, { useState } from "react";


// Initiating poll creation to take data from a form
const Create = () => {
  const [formData, setFormData] = useState({
    pollTitle: "",
    options: ["", "", "", ""],
  });

  // to helps us handle any changes once the user submits the data
  const handleChange = (event, index = null) => {
    const { name, value } = event.target;

    if (name === "pollTitle") {
      setFormData((prev) => ({ ...prev, pollTitle: value }));
    } else if (name === "pollOption" && index !== null) {
      const newOptions = [...formData.options];
      newOptions[index] = value;
      setFormData((prev) => ({ ...prev, options: newOptions }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted form:", formData);
    // we can add API calling here if we need it unless we want to keep in the the backend 
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {/* This will be the portion the main poll tittle */}
        <label htmlFor="pollTitle">Poll Title:</label>
        <input
          type="text"
          id="pollTitle"
          name="pollTitle"
          value={formData.pollTitle}
          onChange={handleChange}
        />
      </div>

        {/* This will be the portion where the users will be able to add the options for the poll */}
      {formData.options.map((option, index) => (
        <div key={index}>
          <label htmlFor={`option${index + 1}`}>Enter Option {index + 1}:</label>
          <input
            type="text"
            id={`option${index + 1}`}
            name="pollOption"
            value={option}
            onChange={(e) => handleChange(e, index)}
          />
        </div>
      ))}

    {/* This will be the button for creating the poll */}

      <button type="submit">Create Poll</button>
    </form>
  );
};

export default Create;
