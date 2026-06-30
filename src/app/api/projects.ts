import axios from 'axios';
import {useEnvironment} from '@/hooks/use-environment-store';
import {mockProjects, getMockDetailById} from '@/lib/mockData';
import {ApiCache} from '@/lib/apiCache';

export const fetchProjects = async (page: number = 1, pageSize: number = 5) => {
	const {isDevelopment} = useEnvironment.getState();

	if (isDevelopment()) {
		return mockProjects.slice((page - 1) * pageSize, page * pageSize);
	}

	const key = `projects:list:${page}:${pageSize}`;
	const cached = ApiCache.get(key);
	if (cached) return cached;

	const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects?page=${page}&pageSize=${pageSize}`);
	ApiCache.set(key, res.data);
	return res.data;
};

export const fetchFeaturedProjects = async () => {
	const {isDevelopment} = useEnvironment.getState();

	if (isDevelopment()) {
		await new Promise((resolve) => setTimeout(resolve, 600));
		return mockProjects.filter((p: any) => p.pinned).slice(0, 6);
	}

	const key = 'projects:featured';
	const cached = ApiCache.get(key);
	if (cached) return cached;

	const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects?featured=true`);
	ApiCache.set(key, res.data);
	return res.data;
};

export const fetchProjectsByID = async (id: string) => {
	const {isDevelopment} = useEnvironment.getState();

	if (isDevelopment()) {
		await new Promise((resolve) => setTimeout(resolve, 800));
		return getMockDetailById(id, 'projects');
	}

	const key = `projects:id:${id}`;
	const cached = ApiCache.get(key);
	if (cached) return cached;

	const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${id}`);
	ApiCache.set(key, res.data.result);
	return res.data.result;
};
