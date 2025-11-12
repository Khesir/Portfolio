import axios from 'axios';
import { useEnvironment } from '@/hooks/use-environment-store';
import { mockExperiences } from '@/lib/mockData';

export const fetchExperiences = async (pageSize: number) => {
	const { isDevelopment } = useEnvironment.getState();

	if (isDevelopment()) {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 500));
		return mockExperiences.slice(0, pageSize);
	}

	const res = await axios.get(
		`${import.meta.env.VITE_API_URL}/experiences?pageSize=${pageSize}`,
	);
	return res.data;
};

export const fetchProjectsByID = async (id: string) => {
	const { isDevelopment } = useEnvironment.getState();

	if (isDevelopment()) {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 800));
		const experience = mockExperiences.find((exp) => exp.id === id);
		return experience || mockExperiences[0];
	}

	try {
		const res = await axios.get(
			`${import.meta.env.VITE_API_URL}/experiences/${id}`,
		);
		return res.data.result;
	} catch (e) {
		throw e;
	}
};
