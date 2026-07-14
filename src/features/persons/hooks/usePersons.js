import { useState, useCallback } from 'react'; // EXISTING - Core state tools
import { personsService } from '../services/persons.service'; 
// ^^^ FIX: Unified explicitly to point to the single target data service engine
import { useAuth } from '../../auth/hooks/useAuth'; // EXISTING - Read global token context

export function usePersons() {
  const [persons, setPersons] = useState([]); // EXISTING - Local cached array records
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // FIX: Destructure token directly to confirm context layer extraction matches AuthContext fields
  const { token } = useAuth(); 
// ^^^ FIX: Ensures that token property variable matches context provider assignments exactly

  const fetchPersons = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // FIX: Defensive guard check to intercept broken context configurations early
      if (!token) {
        throw new Error("Access token required. Please login to get a token.");
      }
      const data = await personsService.getAll(token);
      setPersons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const addPerson = useCallback(async (personPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPerson = await personsService.create(token, personPayload);
      setPersons((prev) => [...prev, newPerson]);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const editPerson = useCallback(async (id, personPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      await personsService.update(token, id, personPayload);
      setPersons((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...personPayload } : item))
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const removePerson = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await personsService.delete(token, id);
      setPersons((prev) => prev.filter((item) => item.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  return {
    persons,
    isLoading,
    error,
    fetchPersons,
    addPerson,
    editPerson,
    removePerson
  };
}