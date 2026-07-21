import {describe, it, expect} from 'vitest';
import {getJourney} from '../journey';

describe('getJourney', () => {
	it('returns an array of company entries with the expected shape', () => {
		const journey = getJourney();
		expect(Array.isArray(journey)).toBe(true);
		expect(journey.length).toBeGreaterThan(0);

		for (const entry of journey) {
			expect(typeof entry.company).toBe('string');
			expect(Array.isArray(entry.positions)).toBe(true);
			expect(entry.positions.length).toBeGreaterThan(0);

			for (const position of entry.positions) {
				expect(typeof position.yearRange).toBe('string');
				expect(typeof position.title).toBe('string');
				expect(typeof position.current).toBe('boolean');
				expect(typeof position.description).toBe('string');
				expect(Array.isArray(position.skills)).toBe(true);
			}
		}
	});

	it('has at most one position marked current across all companies', () => {
		const journey = getJourney();
		const currentPositions = journey.flatMap((entry) => entry.positions).filter((p) => p.current);
		expect(currentPositions.length).toBeLessThanOrEqual(1);
	});
});
