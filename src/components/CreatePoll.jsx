import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PollForm from "./PollForm";
import axios from "axios";

const CreatePoll = () => {
  const navigate = useNavigate();

  const [pollData, setPollData] = useState({
    title: "",
    description: "",
    allowGuests: false,
    endTime: "",
    options: [{ text: "" }, { text: "" }],
    status: "draft",
  });

  const [createdPollId, setCreatedPollId] = useState(null);
  const [message, setMessage] = useState("");

  const handleFieldChange = (field, value) => {
    setPollData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...pollData.options];
    newOptions[index].text = value;
    setPollData((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setPollData((prev) => ({
      ...prev,
      options: [...prev.options, { text: "" }],
    }));
  };

  const removeOption = (index) => {
    const newOptions = [...pollData.options];
    newOptions.splice(index, 1);
    setPollData((prev) => ({ ...prev, options: newOptions }));
  };

  const createPoll = async () => {
    const pollRes = await axios.post("/api/polls", {
      title: pollData.title,
      description: pollData.description,
      allowGuests: pollData.allowGuests,
      endTime: pollData.endTime || null,
    });

    const pollId = pollRes.data.id;
    setCreatedPollId(pollId);

    const validOptions = pollData.options.filter((opt) => opt.text.trim() !== "");
    await Promise.all(
      validOptions.map((opt) =>
        axios.post(`/api/polls/${pollId}/options`, { text: opt.text })
      )
    );

    return pollId;
  };

  const handleSaveAsDraft = async () => {
    const confirmed = window.confirm("Save this poll as a draft?");
    if (!confirmed) return;

    try {
      await createPoll();
      setMessage("✅ Poll saved as draft!");
    } catch {
      setMessage("❌ Failed to save poll.");
    }
  };

  const handlePublish = async () => {
    const confirmed = window.confirm("Are you sure you want to publish this poll?");
    if (!confirmed) return;

    try {
      const pollId = createdPollId || (await createPoll());
      await axios.put(`/api/polls/publish/${pollId}`);
      setMessage("🚀 Poll published!");
      navigate(`/polls/${pollId}`);
    } catch (err) {
      console.error("Publish error:", err);
      setMessage("❌ Failed to publish poll.");
    }
  };

  return (
    <div>
      <h2>Create a New Poll</h2>
      <PollForm
        initialData={pollData}
        status={pollData.status}
        onChange={(updatedFields) =>
          setPollData((prev) => ({ ...prev, ...updatedFields }))
        }
      />
      {pollData.status === "draft" && (
        <>
          <button onClick={handleSaveAsDraft}>Save as Draft</button>
          <button onClick={handlePublish}>Publish Poll</button>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreatePoll;
