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
	releasedDate?: string;
	pinned: boolean;
	images: string[];
	url?: string;
	deployment?: string;
	markdown: string;
	draft: boolean;
}

const projects = projectsJson as Project[];

/** Falls back to Jan 1 of `year` for projects saved before releasedDate existed. */
function sortKey(p: Project): string {
	return p.releasedDate ?? `${p.year}-01-01`;
}

function byReleasedDateDesc(a: Project, b: Project): number {
	return sortKey(b).localeCompare(sortKey(a));
}

export function getProjects(): Project[] {
	return projects.filter((p) => !p.draft).sort(byReleasedDateDesc);
}

export function getProjectById(id: string): Project | undefined {
	return projects.find((p) => p.id === id);
}

export function getFeaturedProjects(): Project[] {
	return projects.filter((p) => p.pinned && !p.draft).sort(byReleasedDateDesc);
}

/** CMS-only: raw list including drafts. Never use for public-facing pages. */
export function getAllProjects(): Project[] {
	return projects;
}
