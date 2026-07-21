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
	company: string;
	positions: JourneyPosition[];
}

const journey = journeyJson as JourneyEntry[];

export function getJourney(): JourneyEntry[] {
	return journey;
}
