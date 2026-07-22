import servicesJson from './services.json';

export interface ServiceEntry {
	title: string;
	badge: string;
	description: string;
	available: boolean;
}

const services = servicesJson as ServiceEntry[];

export function getServices(): ServiceEntry[] {
	return services;
}
