import {render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect, vi} from 'vitest';
import {TerminalProjectsSection} from '../terminalProjectsSection';

vi.mock('@/app/api/projects', () => ({
	fetchFeaturedProjects: vi.fn(),
}));

import {fetchFeaturedProjects} from '@/app/api/projects';

const mockFetch = fetchFeaturedProjects as ReturnType<typeof vi.fn>;

function makeProject(overrides: object = {}) {
	return {
		_id: Math.random().toString(),
		name: 'Test Project',
		languages: ['TypeScript'],
		releasedDate: '2024-01-01',
		pinned: true,
		...overrides,
	};
}

function renderSection() {
	return render(
		<MemoryRouter>
			<TerminalProjectsSection />
		</MemoryRouter>,
	);
}

describe('TerminalProjectsSection', () => {
	it('renders project names when fetchFeaturedProjects resolves with pinned projects', async () => {
		mockFetch.mockResolvedValue([
			makeProject({name: 'Alpha'}),
			makeProject({name: 'Beta'}),
		]);
		renderSection();
		expect(await screen.findByText('Alpha')).toBeInTheDocument();
		expect(screen.getByText('Beta')).toBeInTheDocument();
	});

	it('only shows pinned projects', async () => {
		mockFetch.mockResolvedValue([
			makeProject({name: 'Pinned One', pinned: true}),
			makeProject({name: 'Not Pinned', pinned: false}),
		]);
		renderSection();
		expect(await screen.findByText('Pinned One')).toBeInTheDocument();
		expect(screen.queryByText('Not Pinned')).not.toBeInTheDocument();
	});

	it('shows at most 3 projects', async () => {
		mockFetch.mockResolvedValue([
			makeProject({name: 'P1'}),
			makeProject({name: 'P2'}),
			makeProject({name: 'P3'}),
			makeProject({name: 'P4'}),
			makeProject({name: 'P5'}),
		]);
		renderSection();
		await screen.findByText('P1');
		expect(screen.getByText('P2')).toBeInTheDocument();
		expect(screen.getByText('P3')).toBeInTheDocument();
		expect(screen.queryByText('P4')).not.toBeInTheDocument();
		expect(screen.queryByText('P5')).not.toBeInTheDocument();
	});

	it('shows empty state when no pinned projects', async () => {
		mockFetch.mockResolvedValue([makeProject({pinned: false})]);
		renderSection();
		await waitFor(() => {
			expect(screen.getByText('No featured projects yet.')).toBeInTheDocument();
		});
	});

	it('"all projects →" link is present', async () => {
		mockFetch.mockResolvedValue([]);
		renderSection();
		await waitFor(() => {
			expect(screen.getByRole('link', {name: 'all projects →'})).toBeInTheDocument();
		});
	});
});
