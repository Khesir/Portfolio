import axios from 'axios';
import {useEnvironment} from '@/hooks/use-environment-store';
import {mockBlogs, getMockDetailById} from '@/lib/mockData';
import {ApiCache} from '@/lib/apiCache';

export const fetchBlogs = async () => {
	const {isDevelopment} = useEnvironment.getState();

	if (isDevelopment()) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return mockBlogs;
	}

	const key = 'blogs:list';
	const cached = ApiCache.get(key);
	if (cached) return cached;

	const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`);
	ApiCache.set(key, res.data);
	return res.data;
};

export const fetchBlogsByID = async (id: string) => {
	const {isDevelopment} = useEnvironment.getState();

	if (isDevelopment()) {
		await new Promise((resolve) => setTimeout(resolve, 800));
		return getMockDetailById(id, 'blogs');
	}

	const key = `blogs:id:${id}`;
	const cached = ApiCache.get(key);
	if (cached) return cached;

	const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs/${id}`);
	ApiCache.set(key, res.data.result);
	return res.data.result;
};
