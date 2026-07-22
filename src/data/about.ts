import aboutJson from './about.json';

export interface EducationEntry {
	school: string;
	degree: string;
	yearRange: string;
	current: boolean;
	description: string;
}

export interface SkillCategory {
	category: string;
	items: string[];
}

export interface AboutContent {
	greeting: string;
	kicker: string;
	polaroidCaption: string;
	bio: string[];
	education: EducationEntry[];
	technicalSkills: SkillCategory[];
}

const about = aboutJson as AboutContent;

export function getAbout(): AboutContent {
	return about;
}
