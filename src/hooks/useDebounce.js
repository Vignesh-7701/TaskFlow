import { useEffect, useState } from 'react';

/**
 * Gives back `value`, but only after it has stopped changing for `delay` milliseconds.
 * Used for search, so the list is not filtered again on every key press.
 * @template T
 * @param {T} value
 * @param {number} [delay]
 * @returns {T}
 */
export function useDebounce(value, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
