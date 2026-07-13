import { useState } from 'react';
import { authService } from '../services/auth.service';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.login(username, password);
      setUser(result.user);
      // You would store the result.token securely here later
      console.log('Login Success! User metadata allocated:', result.user);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error, user };
}