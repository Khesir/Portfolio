import projectsJson from './projects.json';

export type ProjectCategory = 'dev' | 'illustration' | 'tech-art';

export interface Project {
	id: string;
	name: string;
	category: ProjectCategory;
	role: string;
	description: string;
	tags: string[];
	year: number;
	pinned: boolean;
	images: string[];
	url?: string;
	deployment?: string;
	markdown: string;
}

const projects = projectsJson as Project[];

export function getProjects(): Project[] {
	return projects;
}

export function getProjectById(id: string): Project | undefined {
	return projects.find((p) => p.id === id);
}

export function getFeaturedProjects(): Project[] {
	return projects.filter((p) => p.pinned);
}
