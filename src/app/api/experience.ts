import axios from 'axios';
import {useEnvironment} from '@/hooks/use-environment-store';
import {mockExperiences} from '@/lib/mockData';
import {ApiCache} from '@/lib/apiCache';

export const fetchExperiences = async (pageSize: number) => {
	const {isDevelopment} = useEnvironment.getState();

	if (isDevelopment()) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return mockExperiences.slice(0, pageSize);
	}

	const key = `experiences:list:${pageSize}`;
	const cached = ApiCache.get(key);
	if (cached) return cached;

	const res = await axios.get(
		`${import.meta.env.VITE_API_URL}/experiences?pageSize=${pageSize}`,
	);
	ApiCache.set(key, res.data);
	return res.data;
};

export const fetchProjectsByID = async (id: string) => {
	const {isDevelopment} = useEnvironment.getState();

	if (isDevelopment()) {
		await new Promise((resolve) => setTimeout(resolve, 800));
		const experience = mockExperiences.find((exp) => exp.id === id);
		return experience || mockExperiences[0];
	}

	const key = `experiences:id:${id}`;
	const cached = ApiCache.get(key);
	if (cached) return cached;

	const res = await axios.get(
		`${import.meta.env.VITE_API_URL}/experiences/${id}`,
	);
	ApiCache.set(key, res.data.result);
	return res.data.result;
};
