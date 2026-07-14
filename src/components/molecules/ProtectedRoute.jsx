import React from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Route Guard Organism: Evaluates live reactive token values.
 * Conditionally branches execution loops depending on user state context.
 */
export const ProtectedRoute = ({ children, fallbackRedirect = '/login' }) => {
  const { token, loading } = useAuth();

  // Prevent flash states during initialization lookups
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3>Loading authentication engine records...</h3>
      </div>
    );
  }

  // If token signature missing, block rendering tree context
  if (!token) {
    // In production React Router environments, swap this out for: <Navigate to={fallbackRedirect} replace />
    window.location.href = fallbackRedirect;
    return null;
  }

  // Happy path layout render execution
  return children;
};