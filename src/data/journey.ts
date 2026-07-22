import journeyJson from './journey.json';

export interface JourneyPosition {
	title: string;
	yearRange: string;
	current: boolean;
	description: string;
	skills: string[];
	detail?: string;
}

export interface JourneyEntry {
	id: string;
	company: string;
	positions: JourneyPosition[];
	draft: boolean;
}

const journey = journeyJson as JourneyEntry[];

export function getJourney(): JourneyEntry[] {
	return journey.filter((j) => !j.draft);
}

export function getJourneyById(id: string): JourneyEntry | undefined {
	return journey.find((j) => j.id === id);
}

/** CMS-only: raw list including drafts. Never use for public-facing pages. */
export function getAllJourney(): JourneyEntry[] {
	return journey;
}
