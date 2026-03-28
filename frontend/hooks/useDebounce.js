import { useState, useEffect } from 'react';

/**
 * useDebounce hook
 * Delays updating the value until after a delay has passed since the last change.
 * Used for debounced search inputs.
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
