import {describe, it, expect} from 'vitest';
import {getProjects, getProjectById, getFeaturedProjects} from '../projects';

describe('getProjects', () => {
	it('returns an array of projects with the expected shape', () => {
		const projects = getProjects();
		expect(Array.isArray(projects)).toBe(true);
		expect(projects.length).toBeGreaterThan(0);

		for (const p of projects) {
			expect(typeof p.id).toBe('string');
			expect(typeof p.name).toBe('string');
			expect(['dev', 'illustration', 'tech-art']).toContain(p.category);
			expect(typeof p.role).toBe('string');
			expect(typeof p.description).toBe('string');
			expect(Array.isArray(p.tags)).toBe(true);
			expect(typeof p.year).toBe('number');
			expect(typeof p.pinned).toBe('boolean');
			expect(Array.isArray(p.images)).toBe(true);
			expect(typeof p.markdown).toBe('string');
		}
	});
});

describe('getProjectById', () => {
	it('returns the matching project for a known id', () => {
		const [first] = getProjects();
		const found = getProjectById(first.id);
		expect(found).toEqual(first);
	});

	it('returns undefined for an unknown id', () => {
		expect(getProjectById('does-not-exist')).toBeUndefined();
	});
});

describe('getFeaturedProjects', () => {
	it('only returns projects with pinned: true', () => {
		const featured = getFeaturedProjects();
		expect(featured.length).toBeGreaterThan(0);
		expect(featured.every((p) => p.pinned === true)).toBe(true);
	});

	it('excludes non-pinned projects', () => {
		const featured = getFeaturedProjects();
		const nonPinned = getProjects().filter((p) => !p.pinned);
		for (const p of nonPinned) {
			expect(featured).not.toContainEqual(p);
		}
	});
});
