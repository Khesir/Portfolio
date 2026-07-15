import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach} from 'vitest';

vi.mock('@/app/api/experience', () => ({
	fetchExperiences: vi.fn(),
}));

import {fetchExperiences} from '@/app/api/experience';
import DashboardJourney from '../DashboardJourney';

const mockFetchExperiences = fetchExperiences as ReturnType<typeof vi.fn>;

const makeExps = (n: number) =>
	Array.from({length: n}, (_, i) => ({
		id: `exp-${i}`,
		position: `Position ${i}`,
		companyName: `Company ${i}`,
		jobType: 'Remote',
		durationStart: '2022-01-01',
		durationEnd: null,
		highlightSkills: ['React', 'TypeScript'],
		pageMd: `## Detail ${i}\n\nContent for ${i}`,
	}));

describe('DashboardJourney', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders journey entries from fetchExperiences', async () => {
		mockFetchExperiences.mockResolvedValue(makeExps(3));
		render(<DashboardJourney />);
		await waitFor(() => expect(screen.getAllByText(/Position \d/).length).toBe(3));
		expect(screen.getByText('Position 0')).toBeInTheDocument();
		expect(screen.getByText(/Company 0/)).toBeInTheDocument();
	});

	it('renders highlight skills for each entry', async () => {
		mockFetchExperiences.mockResolvedValue(makeExps(1));
		render(<DashboardJourney />);
		await waitFor(() => screen.getByText('Position 0'));
		expect(screen.getByText(/React/)).toBeInTheDocument();
		expect(screen.getByText(/TypeScript/)).toBeInTheDocument();
	});

	it('does not expand or show additional detail when a row is clicked', async () => {
		mockFetchExperiences.mockResolvedValue(makeExps(3));
		render(<DashboardJourney />);
		await waitFor(() => screen.getByText('Position 1'));

		fireEvent.click(screen.getByText('Position 1'));

		expect(screen.queryByText(/Content for 1/)).not.toBeInTheDocument();
		expect(screen.queryByTestId('markdown')).not.toBeInTheDocument();
	});
});
