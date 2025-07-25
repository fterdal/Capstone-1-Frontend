import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import './CSS/PublicUserFinderStyles.css';

const PublicUserFinder = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        setHasSearched(false);
        setError(null);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);
      
      try {
        const response = await axios.get(
          `${API_URL}/api/polls/search/users?q=${encodeURIComponent(searchTerm)}`,
          { headers: getAuthHeaders() }
        );
        
        // Filter out the current user from results
        const filteredResults = response.data.filter(
          searchUser => user ? searchUser.id !== user.id : true
        );
        
        setSearchResults(filteredResults);
        setError(null);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
        setError("Failed to search users. Please try again.");
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, user]);

  const handleUserClick = (userId) => {
    if (user && userId === user.id) {
      navigate("/profile");
    } else {
      navigate(`/users/${userId}`);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to render status message
  const renderStatusMessage = () => {
    if (isSearching) {
      return <p className="status-message">Searching...</p>;
    }
    
    if (searchTerm.length > 0 && searchTerm.length < 2) {
      return <p className="status-message">Type at least 2 characters to search</p>;
    }
    
    if (!hasSearched && searchTerm.length === 0) {
      return <p className="status-message">Start typing to find users</p>;
    }
    
    if (hasSearched && searchResults.length === 0 && searchTerm.length >= 2 && !error) {
      return <p className="status-message">No users found.</p>;
    }
    
    if (error) {
      return <p className="status-message error-message">{error}</p>;
    }
    
    // Return empty paragraph to maintain space
    return <p className="status-message">&nbsp;</p>;
  };

  return (
    <div className="users-page">
      <div className="users-page-header">
        <h2>Find Users</h2>
        
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search users by username..."
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
        </div>
        
        <div className="status-container">
          {renderStatusMessage()}
        </div>
      </div>

      <div className="results-container">
        {searchResults.length > 0 && !error && (
          <ul className="user-list">
            {searchResults.map((searchUser) => (
              <li
                key={searchUser.id}
                className="user-card"
                onClick={() => handleUserClick(searchUser.id)}
              >
                {searchUser.imageUrl && (
                  <img src={searchUser.imageUrl} alt="profile" className="user-pfp" />
                )}
                {!searchUser.imageUrl && (
                  <img 
                    src="https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg" 
                    alt="profile" 
                    className="user-pfp" 
                  />
                )}
                <p className="user-name">{searchUser.username}</p>
                {searchUser.bio && <p className="user-bio">{searchUser.bio}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PublicUserFinder;