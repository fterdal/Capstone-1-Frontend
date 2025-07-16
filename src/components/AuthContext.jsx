import React, { createContext } from "react";

// Create the context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ user, setUser, children }) => {
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};



