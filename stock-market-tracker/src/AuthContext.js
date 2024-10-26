import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase'; // Import auth from your firebase.js
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

// Create AuthContext
export const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false); // Update loading state
    });

    return unsubscribe; // Cleanup function
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      return { success: true, message: 'Logged in successfully.' };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, message: 'Failed to log in. Please check your credentials.' };
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    currentUser,
    loading,
    handleLogin,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
