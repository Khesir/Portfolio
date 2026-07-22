import {render, screen, fireEvent, within} from '@testing-library/react';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import {describe, it, expect, vi, beforeEach} from 'vitest';

// DashboardWorkGrid measures its own width via ResizeObserver (in both normal and
// fullscreen mode) to compute column count, which jsdom does not implement — same
// class of gap as the IntersectionObserver issue documented in issue 001. Scoped to
// this file only. Tests can override `mockResizeObserverWidth` before rendering to
// simulate a specific measured width.
let mockResizeObserverWidth = 500;
class MockResizeObserver {
	callback: ResizeObserverCallback;
	constructor(callback: ResizeObserverCallback) {
		this.callback = callback;
	}
	observe() {
		this.callback(
			[{contentRect: {width: mockResizeObserverWidth}} as ResizeObserverEntry],
			this as unknown as ResizeObserver,
		);
	}
	unobserve() {}
	disconnect() {}
}
window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

vi.mock('@/data/projects', () => ({
	getFeaturedProjects: vi.fn(),
	getProjects: vi.fn(),
}));

vi.mock('@/data/categories', () => ({
	getCategoryFilters: vi.fn(() => [
		{value: 'all', label: 'All'},
		{value: 'dev', label: 'Dev'},
		{value: 'illustration', label: 'Artwork'},
		{value: 'tech-art', label: 'Tech Art'},
	]),
}));

import {getFeaturedProjects, getProjects} from '@/data/projects';
import DashboardWorkGrid from '../DashboardWorkGrid';

const mockGetFeaturedProjects = getFeaturedProjects as ReturnType<typeof vi.fn>;
const mockGetProjects = getProjects as ReturnType<typeof vi.fn>;

const ROLE_LABELS: Record<string, string> = {
	dev: 'Dev',
	illustration: 'Artwork',
	'tech-art': 'Tech Art',
};

function makeProject(
	id: string,
	name: string,
	pinned = false,
	category?: string,
	images: string[] = [],
) {
	return {
		id,
		name,
		pinned,
		category,
		role: category ? ROLE_LABELS[category] : '',
		year: 2024,
		tags: ['TypeScript'],
		images,
		description: `Description for ${name}`,
		markdown: '',
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
		mockResizeObserverWidth = 500;
	});

	it('renders all pinned and non-pinned projects, synchronously (no fetch)', () => {
		mockGetFeaturedProjects.mockReturnValue([makeProject('p1', 'Pinned Project', true)]);
		mockGetProjects.mockReturnValue([
			makeProject('np1', 'Non-Pinned One', false),
			makeProject('np2', 'Non-Pinned Two', false),
		]);

		renderGrid();

		expect(screen.getByText('Pinned Project')).toBeInTheDocument();
		expect(screen.getByText('Non-Pinned One')).toBeInTheDocument();
		expect(screen.getByText('Non-Pinned Two')).toBeInTheDocument();
	});

	it('shows a Favorite badge with the .feat treatment only for pinned projects', () => {
		mockGetFeaturedProjects.mockReturnValue([makeProject('p1', 'Pinned Project', true)]);
		mockGetProjects.mockReturnValue([makeProject('np1', 'Non-Pinned One', false)]);

		renderGrid();

		const pinnedCard = screen.getByText('Pinned Project').closest('.dash-work-card') as HTMLElement;
		const nonPinnedCard = screen.getByText('Non-Pinned One').closest('.dash-work-card') as HTMLElement;

		expect(within(pinnedCard).getByText('Favorite')).toBeInTheDocument();
		expect(pinnedCard.querySelector('.dash-work-pin-badge')).toBeInTheDocument();
		expect(pinnedCard).toHaveClass('feat');

		expect(within(nonPinnedCard).queryByText('Favorite')).not.toBeInTheDocument();
		expect(nonPinnedCard.querySelector('.dash-work-pin-badge')).not.toBeInTheDocument();
		expect(nonPinnedCard).not.toHaveClass('feat');
	});

	it('shows a multi-image badge only for projects with more than one image', () => {
		mockGetFeaturedProjects.mockReturnValue([]);
		mockGetProjects.mockReturnValue([
			makeProject('multi', 'Gallery Project', false, undefined, ['a', 'b', 'c']),
			makeProject('single', 'Solo Project', false, undefined, ['a']),
			makeProject('none', 'Empty Project', false, undefined, []),
		]);

		renderGrid();

		const multiCard = screen.getByText('Gallery Project').closest('.dash-work-card') as HTMLElement;
		const singleCard = screen.getByText('Solo Project').closest('.dash-work-card') as HTMLElement;
		const noneCard = screen.getByText('Empty Project').closest('.dash-work-card') as HTMLElement;

		expect(within(multiCard).getByText('3')).toBeInTheDocument();
		expect(multiCard.querySelector('.dash-work-multi-badge')).toBeInTheDocument();

		expect(singleCard.querySelector('.dash-work-multi-badge')).not.toBeInTheDocument();
		expect(noneCard.querySelector('.dash-work-multi-badge')).not.toBeInTheDocument();
	});

	it('distributes cards across a 2-column masonry once the measured width fits 2', () => {
		mockResizeObserverWidth = 600;
		mockGetFeaturedProjects.mockReturnValue([]);
		mockGetProjects.mockReturnValue([
			makeProject('a', 'Project A'),
			makeProject('b', 'Project B'),
			makeProject('c', 'Project C'),
		]);

		renderGrid();

		const columns = document.querySelectorAll('.dash-work-col');
		expect(columns).toHaveLength(2);
		expect(within(columns[0] as HTMLElement).getByText('Project A')).toBeInTheDocument();
		expect(within(columns[1] as HTMLElement).getByText('Project B')).toBeInTheDocument();
		expect(within(columns[0] as HTMLElement).getByText('Project C')).toBeInTheDocument();
	});

	it('expands to more columns based on measured width in normal mode, capped at 3', () => {
		mockResizeObserverWidth = 2000; // would fit far more than 3 columns
		mockGetFeaturedProjects.mockReturnValue([]);
		mockGetProjects.mockReturnValue([
			makeProject('a', 'Project A'),
			makeProject('b', 'Project B'),
			makeProject('c', 'Project C'),
		]);

		renderGrid();

		expect(document.querySelectorAll('.dash-work-col')).toHaveLength(3);
	});

	it('expands to more columns when isFullscreen is true, capped at 5', () => {
		mockResizeObserverWidth = 3000; // would fit far more than 5 columns
		mockGetFeaturedProjects.mockReturnValue([]);
		mockGetProjects.mockReturnValue([
			makeProject('a', 'Project A'),
			makeProject('b', 'Project B'),
			makeProject('c', 'Project C'),
		]);

		render(
			<MemoryRouter initialEntries={['/']}>
				<Routes>
					<Route path="/" element={<DashboardWorkGrid isFullscreen />} />
				</Routes>
			</MemoryRouter>,
		);

		expect(document.querySelectorAll('.dash-work-col')).toHaveLength(5);
	});

	it('falls back to a single column when the measured width only fits 1', () => {
		mockResizeObserverWidth = 100;
		mockGetFeaturedProjects.mockReturnValue([]);
		mockGetProjects.mockReturnValue([makeProject('a', 'Project A')]);

		renderGrid();

		expect(document.querySelectorAll('.dash-work-col')).toHaveLength(1);
	});

	it('navigates to the project detail route when a card is clicked', () => {
		mockGetFeaturedProjects.mockReturnValue([]);
		mockGetProjects.mockReturnValue([makeProject('np1', 'Non-Pinned One', false)]);

		renderGrid();

		fireEvent.click(screen.getByText('Non-Pinned One'));

		expect(screen.getByText('Project detail page')).toBeInTheDocument();
	});

	describe('category filter tabs', () => {
		function renderMixedGrid() {
			mockGetFeaturedProjects.mockReturnValue([]);
			mockGetProjects.mockReturnValue([
				makeProject('d1', 'Dev Project', false, 'dev'),
				makeProject('i1', 'Artwork Project', false, 'illustration'),
				makeProject('t1', 'Tech Art Project', false, 'tech-art'),
				makeProject('u1', 'Uncategorized Project', false, undefined),
			]);

			renderGrid();
		}

		it('renders filter tabs sourced from data: All, Dev, Artwork, Tech Art', () => {
			renderMixedGrid();

			expect(screen.getByRole('button', {name: 'All'})).toBeInTheDocument();
			expect(screen.getByRole('button', {name: 'Dev'})).toBeInTheDocument();
			expect(screen.getByRole('button', {name: 'Artwork'})).toBeInTheDocument();
			expect(screen.getByRole('button', {name: 'Tech Art'})).toBeInTheDocument();
		});

		it('defaults to "All" and shows every project, including uncategorized ones', () => {
			renderMixedGrid();

			expect(screen.getByRole('button', {name: 'All'})).toHaveClass('active');
			expect(screen.getByText('Dev Project')).toBeInTheDocument();
			expect(screen.getByText('Artwork Project')).toBeInTheDocument();
			expect(screen.getByText('Tech Art Project')).toBeInTheDocument();
			expect(screen.getByText('Uncategorized Project')).toBeInTheDocument();
		});

		it('filters to only Dev projects when the Dev tab is selected, hiding uncategorized', () => {
			renderMixedGrid();

			fireEvent.click(screen.getByRole('button', {name: 'Dev'}));

			expect(screen.getByText('Dev Project')).toBeInTheDocument();
			expect(screen.queryByText('Artwork Project')).not.toBeInTheDocument();
			expect(screen.queryByText('Tech Art Project')).not.toBeInTheDocument();
			expect(screen.queryByText('Uncategorized Project')).not.toBeInTheDocument();
		});

		it('filters to only Artwork projects when the Artwork tab is selected', () => {
			renderMixedGrid();

			fireEvent.click(screen.getByRole('button', {name: 'Artwork'}));

			expect(screen.getByText('Artwork Project')).toBeInTheDocument();
			expect(screen.queryByText('Dev Project')).not.toBeInTheDocument();
			expect(screen.queryByText('Tech Art Project')).not.toBeInTheDocument();
			expect(screen.queryByText('Uncategorized Project')).not.toBeInTheDocument();
		});

		it('filters to only Tech Art projects when the Tech Art tab is selected', () => {
			renderMixedGrid();

			fireEvent.click(screen.getByRole('button', {name: 'Tech Art'}));

			expect(screen.getByText('Tech Art Project')).toBeInTheDocument();
			expect(screen.queryByText('Dev Project')).not.toBeInTheDocument();
			expect(screen.queryByText('Artwork Project')).not.toBeInTheDocument();
			expect(screen.queryByText('Uncategorized Project')).not.toBeInTheDocument();
		});

		it('returns to showing all projects when switching back to "All"', () => {
			renderMixedGrid();

			fireEvent.click(screen.getByRole('button', {name: 'Dev'}));
			expect(screen.queryByText('Uncategorized Project')).not.toBeInTheDocument();

			fireEvent.click(screen.getByRole('button', {name: 'All'}));
			expect(screen.getByText('Uncategorized Project')).toBeInTheDocument();
			expect(screen.getByText('Dev Project')).toBeInTheDocument();
		});

		it('renders the correct role-pill label per category and no pill for uncategorized projects', () => {
			renderMixedGrid();

			const devCard = screen.getByText('Dev Project').closest('.dash-work-card') as HTMLElement;
			const artworkCard = screen
				.getByText('Artwork Project')
				.closest('.dash-work-card') as HTMLElement;
			const techArtCard = screen
				.getByText('Tech Art Project')
				.closest('.dash-work-card') as HTMLElement;
			const uncategorizedCard = screen
				.getByText('Uncategorized Project')
				.closest('.dash-work-card') as HTMLElement;

			expect(within(devCard).getByText('Dev')).toBeInTheDocument();
			expect(within(artworkCard).getByText('Artwork')).toBeInTheDocument();
			expect(within(techArtCard).getByText('Tech Art')).toBeInTheDocument();
			expect(uncategorizedCard.querySelector('.dash-work-role-pill')).not.toBeInTheDocument();
		});
	});
});
