import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CmsAuthStore {
  authenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

export const useCmsAuth = create<CmsAuthStore>()(
  persist(
    (set) => ({
      authenticated: false,
      login: (password: string) => {
        const key = import.meta.env.VITE_CMS_PASSWORD;
        if (!key) {
          console.warn('VITE_CMS_PASSWORD is not set');
          return false;
        }
        const ok = password === key;
        if (ok) set({ authenticated: true });
        return ok;
      },
      logout: () => set({ authenticated: false }),
    }),
    {
      name: 'cms-auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
