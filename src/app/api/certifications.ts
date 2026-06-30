import axios from 'axios';
import {useEnvironment} from '@/hooks/use-environment-store';
import {mockCertifications} from '@/lib/mockData';
import {ApiCache} from '@/lib/apiCache';

export const fetchCertifications = async (pageSize = 100) => {
	const {isDevelopment} = useEnvironment.getState();

	if (isDevelopment()) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return mockCertifications.filter((c) => !c.draft).slice(0, pageSize);
	}

	const key = `certifications:list:${pageSize}`;
	const cached = ApiCache.get(key);
	if (cached) return cached;

	const res = await axios.get(
		`${import.meta.env.VITE_API_URL}/certifications?pageSize=${pageSize}`,
	);
	ApiCache.set(key, res.data);
	return res.data;
};

export const fetchCertificationByID = async (id: string) => {
	const {isDevelopment} = useEnvironment.getState();

	if (isDevelopment()) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return mockCertifications.find((c) => c.id === id) ?? mockCertifications[0];
	}

	const key = `certifications:id:${id}`;
	const cached = ApiCache.get(key);
	if (cached) return cached;

	const res = await axios.get(
		`${import.meta.env.VITE_API_URL}/certifications/${id}`,
	);
	ApiCache.set(key, res.data.result);
	return res.data.result;
};
