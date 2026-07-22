import profileJson from './profile.json';

export interface SocialLink {
	label: string;
	href: string;
}

export interface Profile {
	role: string;
	bio: string;
	location: string;
	contactEmail: string;
	socialLinks: SocialLink[];
	status: string;
	avatarSrc: string;
}

const profile = profileJson as Profile;

export function getProfile(): Profile {
	return profile;
}
