import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch (error) {
      console.warn(`Failed to load ${key} from localStorage:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const setStoredValue = (newValue: T | ((currentValue: T) => T)) => {
    try {
      const valueToStore = typeof newValue === 'function' 
        ? (newValue as (currentValue: T) => T)(value)
        : newValue;
      setValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Failed to save ${key} to localStorage:`, error);
    }
  };

  return [value, setStoredValue, isLoading] as const;
}
