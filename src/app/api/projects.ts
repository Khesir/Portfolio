import axios from 'axios';
import { useEnvironment } from '@/hooks/use-environment-store';
import { mockProjects, getMockDetailById } from '@/lib/mockData';

export const fetchProjects = async () => {
	const { isDevelopment } = useEnvironment.getState();

	if (isDevelopment()) {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 600));
		return mockProjects;
	}

	const res = await axios.get(
		`${import.meta.env.VITE_API_URL}/projects?pageSize=6`,
	);
	return res.data;
};

export const fetchProjectsByID = async (id: string) => {
	const { isDevelopment } = useEnvironment.getState();

	if (isDevelopment()) {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 800));
		return getMockDetailById(id, 'projects');
	}

	const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${id}`);
	return res.data.result;
};
