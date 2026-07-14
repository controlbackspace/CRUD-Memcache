import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Initial Synchronous Boot Audit Loop
  useEffect(() => {
    const storedToken = localStorage.getItem('crud_app_token');
    const storedUser = localStorage.getItem('crud_app_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Clear corrupted entries immediately
        localStorage.removeItem('crud_app_token');
        localStorage.removeItem('crud_app_user');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Dispatches Register API execution request
   */
  const register = async (username, password) => {
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Dispatches Login validation payload and saves local state tokens
   */
  const login = async (username, password) => {
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      // Hydrate state properties
      setToken(data.token);
      
      // For basic identification, deduce user details out of payload parameters
      const userPayload = { username }; 
      setUser(userPayload);

      // Write parameters to persistence layers
      localStorage.setItem('crud_app_token', data.token);
      localStorage.setItem('crud_app_user', JSON.stringify(userPayload));

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Purges active token structures out of active execution memory
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('crud_app_token');
    localStorage.removeItem('crud_app_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};