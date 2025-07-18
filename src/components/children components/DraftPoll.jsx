import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NewPoll from "../NewPoll";

const DraftPoll = ({ user, prop }) => {
    console.log("test op " + prop);
    const [error, setError] = useState(""); // delete after
    const navigate = useNavigate();
    const [draftData, setDraftData] = useState({
        creator_id: "",
        title: "",
        descprition: "",
        allowAnonymous: false,
        status: "",
        pollOptions: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/polls");
                const allPolls = response.data;
                const createdDrafts = allPolls.filter( (poll) => poll.creator_id === user.id && poll.status === "draft");
                const validOptions = createdDrafts.options.filter(opt => opt.trim() !== "");
                setDraftData({
                    creator_id: createdDrafts.creator_id,
                    title: createdDrafts.title,
                    descprition: createdDrafts.descprition,
                    allowAnonymous: createdDrafts.allowAnonymous,
                    status: createdDrafts.status,
                    pollOptions: validOptions,
                });
            } catch (err) {
                console.error("Could not fetch draft:", err);
            } finally {
                setLoading(false);
            }
        };

        if(user?.id) {
            fetchPolls();
        }
    }, [user]);

    //     useEffect(() => {
    //     const fetchPolls = async () => {
    //         try {
    //             const response = await axios.get("http://localhost:8080/api/polls");
    //             const allPolls = response.data;
    //             const createdDrafts = allPolls.filter( (poll) => poll.creator_id === user.id && poll.status === "draft");
    //             setDrafts(createdDrafts);
    //         } catch (err) {
    //             console.error("Failed to fetch polls", err);
    //             setError("Could not load drafts.");
    //         }
    //     };

    //     if(user?.id) {
    //         fetchPolls();
    //     }
    // }, [user]);

    console.log(draftData);
};

export default DraftPoll;