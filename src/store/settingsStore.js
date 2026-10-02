import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Holds the user's settings and saves them on the phone.
// themeMode is one of: 'system' | 'light' | 'dark'
export const useSettingsStore = create(
  persist(
    (set) => ({
      themeMode: 'system',
      setThemeMode: (themeMode) => set({ themeMode }),
    }),
    {
      name: 'taskflow.settings.v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
