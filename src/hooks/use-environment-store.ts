import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type EnvironmentMode = 'production' | 'development';

interface EnvironmentStore {
  mode: EnvironmentMode;
  refreshKey: number;
  setMode: (mode: EnvironmentMode) => void;
  toggleMode: () => void;
  isDevelopment: () => boolean;
}

export const useEnvironment = create<EnvironmentStore>()(
  persist(
    (set, get) => ({
      mode: 'production',
      refreshKey: 0,
      setMode: (mode: EnvironmentMode) =>
        set((state) => ({ mode, refreshKey: state.refreshKey + 1 })),
      toggleMode: () =>
        set((state) => ({
          mode: state.mode === 'production' ? 'development' : 'production',
          refreshKey: state.refreshKey + 1,
        })),
      isDevelopment: () => get().mode === 'development',
    }),
    {
      name: 'environment-mode-storage',
    }
  )
);
