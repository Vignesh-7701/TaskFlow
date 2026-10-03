import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants';
import { STATUS } from '@/models/task';
import { completedFeedback } from '@/utils/haptics';
import { newId } from '@/utils/id';

// The current moment as an ISO timestamp, e.g. '2026-10-02T09:30:00.000Z'
const timestamp = () => new Date().toISOString();

// Holds the list of tasks and saves it on the phone.
export const useTaskStore = create(
  persist(
    (set, get) => ({
      /** @type {import('@/models/task').Task[]} */
      tasks: [],
      // Becomes true once the saved tasks have been loaded from the phone.
      hasHydrated: false,

      // Adds one task made in the form. The store gives it an id and timestamps.
      addTask: (input) => {
        const now = timestamp();
        const task = { ...input, id: newId(), createdAt: now, updatedAt: now };
        set((state) => ({ tasks: [...state.tasks, task] }));
        return task;
      },

      // Changes some fields of one task. `patch` holds only the fields to change.
      updateTask: (id, patch) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...patch, id, updatedAt: timestamp() } : task,
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      // Switches one task between pending and completed.
      // Every way of completing a task (checkbox, swipe, Details button) comes through here,
      // so the vibration is added once, for all of them.
      toggleComplete: (id) => {
        const current = get().tasks.find((task) => task.id === id);
        if (!current) {
          return;
        }
        const status = current.status === STATUS.COMPLETED ? STATUS.PENDING : STATUS.COMPLETED;

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status, updatedAt: timestamp() } : task,
          ),
        }));

        if (status === STATUS.COMPLETED) {
          completedFeedback();
        }
      },

      // Adds many tasks from a CSV file. They already have their own ids.
      importTasks: (newTasks) => {
        const now = timestamp();
        const stamped = newTasks.map((task) => ({ ...task, createdAt: now, updatedAt: now }));
        set((state) => ({ tasks: [...state.tasks, ...stamped] }));
      },

      clearAll: () => set({ tasks: [] }),
    }),
    {
      name: STORAGE_KEYS.TASKS,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      // Save only the tasks. hasHydrated must start as false every time the app opens.
      partialize: (state) => ({ tasks: state.tasks }),
      // Runs when loading from the phone has finished, whether it worked or not.
      onRehydrateStorage: () => () => {
        useTaskStore.setState({ hasHydrated: true });
      },
    },
  ),
);
