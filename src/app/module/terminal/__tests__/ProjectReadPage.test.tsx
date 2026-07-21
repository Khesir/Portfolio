import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import {describe, it, expect, vi} from 'vitest';

vi.mock('@/data/projects', () => ({
	getProjectById: vi.fn(),
	getProjects: vi.fn(),
}));

import {getProjectById, getProjects} from '@/data/projects';
import ProjectReadPage from '../ProjectReadPage';

const mockGetProjectById = getProjectById as ReturnType<typeof vi.fn>;
const mockGetProjects = getProjects as ReturnType<typeof vi.fn>;

function makeProject(overrides = {}) {
	return {
		id: 'p1',
		name: 'Pinned Project',
		category: 'dev',
		role: 'Dev',
		description: 'desc',
		tags: ['TypeScript'],
		year: 2024,
		pinned: true,
		images: ['https://example.com/a.png'],
		markdown: '## Overview\n\nBody text.',
		...overrides,
	};
}

function renderAt(id: string) {
	return render(
		<MemoryRouter initialEntries={[`/work/view/pinned-project?id=${id}`]}>
			<Routes>
				<Route path="/work/view/:title" element={<ProjectReadPage />} />
			</Routes>
		</MemoryRouter>,
	);
}

describe('ProjectReadPage', () => {
	it('renders project data synchronously from getProjectById, no fetch/loading state', () => {
		mockGetProjectById.mockReturnValue(makeProject());
		mockGetProjects.mockReturnValue([makeProject()]);

		renderAt('p1');

		expect(screen.getByText('Pinned Project')).toBeInTheDocument();
		expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
	});

	it('shows an error state when the project is not found', () => {
		mockGetProjectById.mockReturnValue(undefined);
		mockGetProjects.mockReturnValue([]);

		renderAt('does-not-exist');

		expect(screen.getByText(/not found/i)).toBeInTheDocument();
	});

	it('renders prev/next links from getProjects, sourced locally', () => {
		const current = makeProject({id: 'p1', name: 'Current Project', pinned: false});
		const other = makeProject({id: 'p2', name: 'Other Project', pinned: true});
		mockGetProjectById.mockReturnValue(current);
		mockGetProjects.mockReturnValue([other, current]);

		renderAt('p1');

		expect(screen.getByRole('link', {name: /Other Project/})).toBeInTheDocument();
	});

	it('renders all images for the project', () => {
		mockGetProjectById.mockReturnValue(makeProject({images: ['https://example.com/a.png']}));
		mockGetProjects.mockReturnValue([makeProject()]);

		renderAt('p1');

		expect(screen.getByAltText('Pinned Project')).toHaveAttribute('src', 'https://example.com/a.png');
	});

	it('renders a multi-image project as a carousel showing one image at a time, navigable via next/prev/dots', () => {
		const images = [
			'https://example.com/a.png',
			'https://example.com/b.png',
			'https://example.com/c.png',
		];
		mockGetProjectById.mockReturnValue(makeProject({images}));
		mockGetProjects.mockReturnValue([makeProject({images})]);

		renderAt('p1');

		expect(screen.getByAltText('Pinned Project')).toHaveAttribute('src', images[0]);
		expect(screen.getAllByRole('button', {name: /go to image/i})).toHaveLength(3);

		fireEvent.click(screen.getByRole('button', {name: /next image/i}));
		expect(screen.getByAltText('Pinned Project')).toHaveAttribute('src', images[1]);

		fireEvent.click(screen.getByRole('button', {name: /previous image/i}));
		expect(screen.getByAltText('Pinned Project')).toHaveAttribute('src', images[0]);

		fireEvent.click(screen.getByRole('button', {name: 'Go to image 3'}));
		expect(screen.getByAltText('Pinned Project')).toHaveAttribute('src', images[2]);
	});

	it('navigates the carousel with the left/right arrow keys', () => {
		const images = [
			'https://example.com/a.png',
			'https://example.com/b.png',
			'https://example.com/c.png',
		];
		mockGetProjectById.mockReturnValue(makeProject({images}));
		mockGetProjects.mockReturnValue([makeProject({images})]);

		renderAt('p1');

		fireEvent.keyDown(document, {key: 'ArrowRight'});
		expect(screen.getByAltText('Pinned Project')).toHaveAttribute('src', images[1]);

		fireEvent.keyDown(document, {key: 'ArrowLeft'});
		expect(screen.getByAltText('Pinned Project')).toHaveAttribute('src', images[0]);
	});

	it('opens the currently-shown carousel image in the lightbox', () => {
		const images = ['https://example.com/a.png', 'https://example.com/b.png'];
		mockGetProjectById.mockReturnValue(makeProject({images}));
		mockGetProjects.mockReturnValue([makeProject({images})]);

		renderAt('p1');

		fireEvent.click(screen.getByRole('button', {name: /next image/i}));
		fireEvent.click(document.querySelector('.ahero') as HTMLElement);

		const lightboxImg = document.querySelector(`.img-lb-inner img[src="${images[1]}"]`);
		expect(lightboxImg).toBeTruthy();
	});

	it('renders a single-image project as a plain hero, no carousel controls', () => {
		mockGetProjectById.mockReturnValue(makeProject({images: ['https://example.com/a.png']}));
		mockGetProjects.mockReturnValue([makeProject()]);

		renderAt('p1');

		expect(screen.queryByRole('button', {name: /next image/i})).not.toBeInTheDocument();
		expect(screen.queryByRole('button', {name: /go to image/i})).not.toBeInTheDocument();
	});

	it('renders no header/nav or footer chrome', () => {
		mockGetProjectById.mockReturnValue(makeProject());
		mockGetProjects.mockReturnValue([makeProject()]);

		renderAt('p1');

		expect(screen.queryByRole('banner')).not.toBeInTheDocument();
		expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
		expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
	});

	it('renders no heart button or view-count UI', () => {
		mockGetProjectById.mockReturnValue(makeProject());
		mockGetProjects.mockReturnValue([makeProject()]);

		renderAt('p1');

		expect(document.querySelector('.mi.heart')).not.toBeInTheDocument();
		expect(screen.queryByText(/\d+\s*views?/i)).not.toBeInTheDocument();
		expect(screen.queryByRole('button', {name: /heart/i})).not.toBeInTheDocument();
	});

	it('the "back to" link points at an existing route, not the removed /work index', () => {
		mockGetProjectById.mockReturnValue(makeProject());
		mockGetProjects.mockReturnValue([makeProject()]);

		renderAt('p1');

		const backLink = screen.getByText(/back to/i).closest('a');
		expect(backLink).toHaveAttribute('href', '/');
	});
});
