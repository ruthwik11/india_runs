import { useState, useCallback } from 'react';

/**
 * Custom hook for syncing state with localStorage.
 * @param {string} key - The localStorage key
 * @param {*} initialValue - Default value if key doesn't exist
 * @returns {[any, Function, Function]} - [storedValue, setValue, removeValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('useLocalStorage setValue error:', error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('useLocalStorage removeValue error:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
