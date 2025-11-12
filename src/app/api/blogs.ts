import axios from 'axios';
import { useEnvironment } from '@/hooks/use-environment-store';
import { mockBlogs, getMockDetailById } from '@/lib/mockData';

export const fetchBlogs = async () => {
	const { isDevelopment } = useEnvironment.getState();

	if (isDevelopment()) {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 500));
		return mockBlogs;
	}

	const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`);
	console.log(res);
	return res.data;
};

export const fetchBlogsByID = async (id: string) => {
	const { isDevelopment } = useEnvironment.getState();

	if (isDevelopment()) {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 800));
		return getMockDetailById(id, 'blogs');
	}

	const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs/${id}`);
	return res.data.result;
};
