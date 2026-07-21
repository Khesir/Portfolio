import aboutJson from './about.json';

export interface EducationEntry {
	school: string;
	degree: string;
	yearRange: string;
	current: boolean;
	description: string;
}

export interface ServiceEntry {
	title: string;
	badge: string;
	description: string;
}

export interface AboutContent {
	greeting: string;
	kicker: string;
	polaroidCaption: string;
	bio: string[];
	education: EducationEntry[];
	services: ServiceEntry[];
	skills: string[];
	tools: {
		languages: string[];
		software: string[];
	};
}

const about = aboutJson as AboutContent;

export function getAbout(): AboutContent {
	return about;
}
