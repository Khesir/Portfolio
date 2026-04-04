import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {cmsVerifyAuth} from '@/app/api/cms';

interface CmsAuthStore {
	authenticated: boolean;
	password: string;
	login: (password: string) => Promise<boolean>;
	logout: () => void;
}

export const useCmsAuth = create<CmsAuthStore>()(
	persist(
		(set) => ({
			authenticated: false,
			password: '',
			login: async (password: string) => {
				const ok = await cmsVerifyAuth(password);
				if (ok) set({authenticated: true, password});
				return ok;
			},
			logout: () => set({authenticated: false, password: ''}),
		}),
		{
			name: 'cms-auth-storage',
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
