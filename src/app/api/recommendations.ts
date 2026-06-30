import axios from 'axios';
import {useEnvironment} from '@/hooks/use-environment-store';
import {mockRecommendations} from '@/lib/mockData';
import {ApiCache} from '@/lib/apiCache';

export const fetchRecommendations = async () => {
	const {isDevelopment} = useEnvironment.getState();

	if (isDevelopment()) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return mockRecommendations.filter((r) => !r.hidden);
	}

	const key = 'recommendations:list';
	const cached = ApiCache.get(key);
	if (cached) return cached;

	const res = await axios.get(
		`${import.meta.env.VITE_API_URL}/recommendations`,
	);
	ApiCache.set(key, res.data);
	return res.data;
};

export const fetchFeaturedRecommendations = async () => {
	const {isDevelopment} = useEnvironment.getState();

	if (isDevelopment()) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return mockRecommendations.filter((r) => r.featured && !r.hidden);
	}

	const key = 'recommendations:featured';
	const cached = ApiCache.get(key);
	if (cached) return cached;

	const res = await axios.get(
		`${import.meta.env.VITE_API_URL}/recommendations?featured=true`,
	);
	ApiCache.set(key, res.data);
	return res.data;
};

export const fetchRecommendationByID = async (id: string) => {
	const {isDevelopment} = useEnvironment.getState();

	if (isDevelopment()) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return mockRecommendations.find((r) => r.id === id) ?? mockRecommendations[0];
	}

	const key = `recommendations:id:${id}`;
	const cached = ApiCache.get(key);
	if (cached) return cached;

	const res = await axios.get(
		`${import.meta.env.VITE_API_URL}/recommendations/${id}`,
	);
	ApiCache.set(key, res.data.result);
	return res.data.result;
};
