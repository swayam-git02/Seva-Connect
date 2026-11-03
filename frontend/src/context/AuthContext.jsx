// Ye context poore frontend mein logged-in user aur uske role ki state share karta hai.
// Isse har component ko localStorage ya login API ko directly handle nahi karna padta.

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { USER_ROLES } from '../constants/userRoles';

const AuthContext = createContext(null);

// Ye provider app start hote hi saved user restore karta hai aur login/logout ke baad state update karta hai.
// `children` ke andar ke pages is context se authentication aur role flags padh sakte hain.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial user load from local storage
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // Ye login form ki credentials service ko bhejkar authenticated user ko app state mein save karta hai.
  const login = async (credentials) => {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const signupCustomer = async (formData) => {
    const newUser = await authService.registerCustomer(formData);
    setUser(newUser);
    return newUser;
  };

  const signupProvider = async (formData) => {
    const newProvider = await authService.registerProvider(formData);
    setUser(newProvider);
    return newProvider;
  };

  // Ye browser se session data hata kar protected UI ko logged-out state mein laata hai.
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updates) => {
    const updated = authService.updateCurrentUser(updates);
    if (updated) setUser(updated);
    return updated;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isCustomer: user?.role === USER_ROLES.CUSTOMER,
    isProvider: user?.role === USER_ROLES.PROVIDER,
    isAdmin: user?.role === USER_ROLES.ADMIN,
    login,
    signupCustomer,
    signupProvider,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Ye custom hook components ko AuthContext safely use karne ka simple tareeqa deta hai.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
