import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

interface CmsAuthStore {
	authenticated: boolean;
	password: string;
	login: (password: string) => Promise<boolean>;
	logout: () => void;
}

// The /cms route only ever renders when import.meta.env.DEV is true (see app.tsx) —
// it's reachable only by whoever is running `npm run dev` on their own machine, so
// there's nothing a password screen would protect here. cmsVerifyAuth (the backend
// check this used to call) doesn't exist in @/app/api/cms — this route never worked.
export const useCmsAuth = create<CmsAuthStore>()(
	persist(
		(set) => ({
			authenticated: import.meta.env.DEV,
			password: '',
			login: async (password: string) => {
				set({authenticated: true, password});
				return true;
			},
			logout: () => set({authenticated: false, password: ''}),
		}),
		{
			name: 'cms-auth-storage',
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
