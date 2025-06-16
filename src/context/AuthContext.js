
// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const mockUser = {
  email: 'admin@toyparty.com',
  name: 'Admin User',
  role: 'admin', // can be 'rep', 'viewer'
  token: 'mock-token-1234'
}
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate login check
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 500);
  }, []);

  const login = async (email, password) => {
    // Mock login - replace with real auth
    setLoading(true);
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }
  const logout = () => {
    setUser(null);
  }
  const secureApi = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(user?.token && { 'Authorization': `Bearer ${user.token}` }),
      ...options.headers
    }
    return fetch(url, {
      ...options,
      headers
    });
  }
  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      login, 
      logout, 
      secureApi,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}