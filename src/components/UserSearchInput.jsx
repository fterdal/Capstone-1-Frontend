import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import "./CSS/UserSearchInputStyles.css";

const UserSearchInput = ({ selectedUsers, onUsersChange, placeholder = "Search users...", currentUser = null }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.get(`${API_URL}/api/polls/search/users?q=${encodeURIComponent(searchTerm)}`);
        
        const filteredResults = response.data.filter(user => {
          const isSelected = selectedUsers.some(selected => selected.id === user.id);
          const isCurrentUser = currentUser && user.id === currentUser.id;
          return !isSelected && !isCurrentUser;
        });
        
        setSearchResults(filteredResults);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedUsers, currentUser]);

  const handleSelectUser = (user) => {
    onUsersChange([...selectedUsers, user]);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemoveUser = (userId) => {
    onUsersChange(selectedUsers.filter(user => user.id !== userId));
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <div className="user-search-input">
      <div className="search-input-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="user-search-field"
        />
        
        {isSearching && (
          <div className="search-loading">Searching...</div>
        )}

        {showDropdown && searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map(user => (
              <div
                key={user.id}
                className="search-result-item"
                onClick={() => handleSelectUser(user)}
              >
                <img
                  src={user.imageUrl || "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"}
                  alt={user.username}
                  className="search-result-avatar"
                />
                <span className="search-result-username">{user.username}</span>
              </div>
            ))}
          </div>
        )}

        {showDropdown && searchResults.length === 0 && searchTerm.length >= 2 && !isSearching && (
          <div className="search-dropdown">
            <div className="no-results">No users found</div>
          </div>
        )}
      </div>

      {selectedUsers.length > 0 && (
        <div className="selected-users">
          <div className="selected-users-label">Selected users:</div>
          <div className="selected-users-list">
            {selectedUsers.map(user => (
              <div key={user.id} className="selected-user-tag">
                <img
                  src={user.imageUrl || "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"}
                  alt={user.username}
                  className="selected-user-avatar"
                />
                <span className="selected-user-name">{user.username}</span>
                <button
                  type="button"
                  className="remove-user-btn"
                  onClick={() => handleRemoveUser(user.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearchInput;