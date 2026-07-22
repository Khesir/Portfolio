import servicesJson from './services.json';

export interface ServiceEntry {
	id: string;
	title: string;
	badge: string;
	description: string;
	available: boolean;
	draft: boolean;
}

const services = servicesJson as ServiceEntry[];

export function getServices(): ServiceEntry[] {
	return services.filter((s) => !s.draft);
}

/** CMS-only: raw list including drafts. Never use for public-facing pages. */
export function getAllServices(): ServiceEntry[] {
	return services;
}
