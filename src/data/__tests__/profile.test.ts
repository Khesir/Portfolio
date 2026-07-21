import {describe, it, expect} from 'vitest';
import {getProfile} from '../profile';

describe('getProfile', () => {
	it('returns a profile object with the expected shape', () => {
		const profile = getProfile();
		expect(typeof profile.role).toBe('string');
		expect(typeof profile.bio).toBe('string');
		expect(typeof profile.location).toBe('string');
		expect(typeof profile.contactEmail).toBe('string');
		expect(Array.isArray(profile.socialLinks)).toBe(true);
		expect(typeof profile.status).toBe('string');
		expect(typeof profile.avatarSrc).toBe('string');
	});

	it('returns socialLinks with label/href shape', () => {
		const profile = getProfile();
		for (const link of profile.socialLinks) {
			expect(typeof link.label).toBe('string');
			expect(typeof link.href).toBe('string');
		}
	});
});
