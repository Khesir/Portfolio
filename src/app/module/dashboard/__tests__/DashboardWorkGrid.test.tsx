import {render, screen, fireEvent, waitFor, within} from '@testing-library/react';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import {describe, it, expect, vi, beforeEach} from 'vitest';

vi.mock('@/app/api/projects', () => ({
	fetchFeaturedProjects: vi.fn(),
	fetchProjects: vi.fn(),
}));

import {fetchFeaturedProjects, fetchProjects} from '@/app/api/projects';
import DashboardWorkGrid from '../DashboardWorkGrid';

const mockFetchFeaturedProjects = fetchFeaturedProjects as ReturnType<typeof vi.fn>;
const mockFetchProjects = fetchProjects as ReturnType<typeof vi.fn>;

function makeProject(id: string, name: string, pinned = false, category?: string) {
	return {
		id,
		_id: id,
		name,
		pinned,
		releasedDate: '2024-01-01',
		languages: ['TypeScript'],
		imageUrl: '',
		description: `Description for ${name}`,
		category,
	};
}

function renderGrid() {
	return render(
		<MemoryRouter initialEntries={['/']}>
			<Routes>
				<Route path="/" element={<DashboardWorkGrid />} />
				<Route path="/work/view/:title" element={<div>Project detail page</div>} />
			</Routes>
		</MemoryRouter>,
	);
}

describe('DashboardWorkGrid', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders all pinned and non-pinned projects from a single fetch, without a show-more control', async () => {
		mockFetchFeaturedProjects.mockResolvedValue([makeProject('p1', 'Pinned Project', true)]);
		mockFetchProjects.mockResolvedValue([
			makeProject('np1', 'Non-Pinned One', false),
			makeProject('np2', 'Non-Pinned Two', false),
		]);

		renderGrid();

		await waitFor(() => screen.getByText('Pinned Project'));
		expect(screen.getByText('Non-Pinned One')).toBeInTheDocument();
		expect(screen.getByText('Non-Pinned Two')).toBeInTheDocument();
		expect(mockFetchProjects).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('button', {name: /show more/i})).not.toBeInTheDocument();
	});

	it('shows a PINNED badge only for pinned projects', async () => {
		mockFetchFeaturedProjects.mockResolvedValue([makeProject('p1', 'Pinned Project', true)]);
		mockFetchProjects.mockResolvedValue([makeProject('np1', 'Non-Pinned One', false)]);

		renderGrid();

		await waitFor(() => screen.getByText('Pinned Project'));
		const pinnedCard = screen.getByText('Pinned Project').closest('.dash-work-card') as HTMLElement;
		const nonPinnedCard = screen.getByText('Non-Pinned One').closest('.dash-work-card') as HTMLElement;

		expect(within(pinnedCard).getByText('PINNED')).toBeInTheDocument();
		expect(within(nonPinnedCard).queryByText('PINNED')).not.toBeInTheDocument();
	});

	it('navigates to the project detail route when a card is clicked', async () => {
		mockFetchFeaturedProjects.mockResolvedValue([]);
		mockFetchProjects.mockResolvedValue([makeProject('np1', 'Non-Pinned One', false)]);

		renderGrid();

		await waitFor(() => screen.getByText('Non-Pinned One'));
		fireEvent.click(screen.getByText('Non-Pinned One'));

		await waitFor(() => expect(screen.getByText('Project detail page')).toBeInTheDocument());
	});

	describe('category filter tabs', () => {
		async function renderMixedGrid() {
			mockFetchFeaturedProjects.mockResolvedValue([]);
			mockFetchProjects.mockResolvedValue([
				makeProject('d1', 'Dev Project', false, 'dev'),
				makeProject('i1', 'Illustration Project', false, 'illustration'),
				makeProject('t1', 'Tech Art Project', false, 'tech-art'),
				makeProject('u1', 'Uncategorized Project', false, undefined),
			]);

			renderGrid();
			await waitFor(() => screen.getByText('Dev Project'));
		}

		it('renders filter tabs: All, Dev, Illustration, Tech Art', async () => {
			await renderMixedGrid();

			expect(screen.getByRole('button', {name: 'All'})).toBeInTheDocument();
			expect(screen.getByRole('button', {name: 'Dev'})).toBeInTheDocument();
			expect(screen.getByRole('button', {name: 'Illustration'})).toBeInTheDocument();
			expect(screen.getByRole('button', {name: 'Tech Art'})).toBeInTheDocument();
		});

		it('defaults to "All" and shows every project, including uncategorized ones', async () => {
			await renderMixedGrid();

			expect(screen.getByRole('button', {name: 'All'})).toHaveClass('active');
			expect(screen.getByText('Dev Project')).toBeInTheDocument();
			expect(screen.getByText('Illustration Project')).toBeInTheDocument();
			expect(screen.getByText('Tech Art Project')).toBeInTheDocument();
			expect(screen.getByText('Uncategorized Project')).toBeInTheDocument();
		});

		it('filters to only Dev projects when the Dev tab is selected, hiding uncategorized', async () => {
			await renderMixedGrid();

			fireEvent.click(screen.getByRole('button', {name: 'Dev'}));

			expect(screen.getByText('Dev Project')).toBeInTheDocument();
			expect(screen.queryByText('Illustration Project')).not.toBeInTheDocument();
			expect(screen.queryByText('Tech Art Project')).not.toBeInTheDocument();
			expect(screen.queryByText('Uncategorized Project')).not.toBeInTheDocument();
		});

		it('filters to only Illustration projects when the Illustration tab is selected', async () => {
			await renderMixedGrid();

			fireEvent.click(screen.getByRole('button', {name: 'Illustration'}));

			expect(screen.getByText('Illustration Project')).toBeInTheDocument();
			expect(screen.queryByText('Dev Project')).not.toBeInTheDocument();
			expect(screen.queryByText('Tech Art Project')).not.toBeInTheDocument();
			expect(screen.queryByText('Uncategorized Project')).not.toBeInTheDocument();
		});

		it('filters to only Tech Art projects when the Tech Art tab is selected', async () => {
			await renderMixedGrid();

			fireEvent.click(screen.getByRole('button', {name: 'Tech Art'}));

			expect(screen.getByText('Tech Art Project')).toBeInTheDocument();
			expect(screen.queryByText('Dev Project')).not.toBeInTheDocument();
			expect(screen.queryByText('Illustration Project')).not.toBeInTheDocument();
			expect(screen.queryByText('Uncategorized Project')).not.toBeInTheDocument();
		});

		it('returns to showing all projects when switching back to "All"', async () => {
			await renderMixedGrid();

			fireEvent.click(screen.getByRole('button', {name: 'Dev'}));
			expect(screen.queryByText('Uncategorized Project')).not.toBeInTheDocument();

			fireEvent.click(screen.getByRole('button', {name: 'All'}));
			expect(screen.getByText('Uncategorized Project')).toBeInTheDocument();
			expect(screen.getByText('Dev Project')).toBeInTheDocument();
		});

		it('renders the correct role-pill label per category and no pill for uncategorized projects', async () => {
			await renderMixedGrid();

			const devCard = screen.getByText('Dev Project').closest('.dash-work-card') as HTMLElement;
			const illustrationCard = screen
				.getByText('Illustration Project')
				.closest('.dash-work-card') as HTMLElement;
			const techArtCard = screen
				.getByText('Tech Art Project')
				.closest('.dash-work-card') as HTMLElement;
			const uncategorizedCard = screen
				.getByText('Uncategorized Project')
				.closest('.dash-work-card') as HTMLElement;

			expect(within(devCard).getByText('Dev')).toBeInTheDocument();
			expect(within(illustrationCard).getByText('Illustration')).toBeInTheDocument();
			expect(within(techArtCard).getByText('Tech Art')).toBeInTheDocument();
			expect(uncategorizedCard.querySelector('.dash-work-role-pill')).not.toBeInTheDocument();
		});
	});
});
