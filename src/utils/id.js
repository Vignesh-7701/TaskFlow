import { randomUUID } from 'expo-crypto';

/**
 * Makes a new unique id for a task.
 * @returns {string} e.g. '3f2a9c1e-8b47-4d2a-9f10-6c5e2b7a1d44'
 */
export function newId() {
  return randomUUID();
}
