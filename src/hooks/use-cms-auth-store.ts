import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {cmsVerifyAuth} from '@/app/api/cms';

interface CmsAuthStore {
	authenticated: boolean;
	login: (password: string) => Promise<boolean>;
	logout: () => void;
}

export const useCmsAuth = create<CmsAuthStore>()(
	persist(
		(set) => ({
			authenticated: false,
			login: async (password: string) => {
				const ok = await cmsVerifyAuth(password);
				if (ok) set({authenticated: true});
				return ok;
			},
			logout: () => set({authenticated: false}),
		}),
		{
			name: 'cms-auth-storage',
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
