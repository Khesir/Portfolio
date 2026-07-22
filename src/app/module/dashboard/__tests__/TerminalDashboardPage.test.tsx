import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect, vi} from 'vitest';

// DashboardWorkGrid uses ResizeObserver to compute column count when fullscreen,
// which jsdom does not implement — same class of gap as the IntersectionObserver
// issue documented in issue 001. Scoped to this file only.
class MockResizeObserver {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
}
window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

vi.mock('@/data/profile', () => ({
	getProfile: vi.fn(() => ({
		role: 'Full-Stack Developer',
		bio: 'Building things with code.',
		location: 'Philippines · UTC+8',
		contactEmail: 'test@example.com',
		status: 'online',
		avatarSrc: '',
		socialLinks: [],
	})),
}));

vi.mock('@/data/journey', () => ({
	getJourney: vi.fn(() => []),
}));

vi.mock('@/data/projects', () => ({
	getFeaturedProjects: vi.fn(() => []),
	getProjects: vi.fn(() => []),
}));

import TerminalDashboardPage from '../TerminalDashboardPage';

function renderPage() {
	return render(
		<MemoryRouter>
			<TerminalDashboardPage />
		</MemoryRouter>,
	);
}

describe('TerminalDashboardPage', () => {
	it('renders without crashing', () => {
		renderPage();
	});

	it('renders no nav landmark (no TerminalLayout chrome)', () => {
		renderPage();
		expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
	});

	it('renders no banner (header) landmark', () => {
		renderPage();
		expect(screen.queryByRole('banner')).not.toBeInTheDocument();
	});

	it('renders no contentinfo (footer) landmark', () => {
		renderPage();
		expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
	});

	it('renders the grid shell inside a page-level centering wrapper', () => {
		const {container} = renderPage();
		expect(container.querySelector('.dashboard-page')).not.toBeNull();
		expect(container.querySelector('.dashboard-page .dashboard-shell')).not.toBeNull();
	});

	it('toggles fullscreen classes on the shell and page wrapper when the toggle is clicked', () => {
		const {container} = renderPage();
		const toggle = screen.getByRole('button', {name: 'Enter fullscreen'});

		expect(container.querySelector('.dashboard-shell.fullscreen')).toBeNull();

		fireEvent.click(toggle);
		expect(container.querySelector('.dashboard-shell.fullscreen')).not.toBeNull();
		expect(container.querySelector('.dashboard-page.fullscreen-active')).not.toBeNull();
		expect(screen.getByRole('button', {name: 'Exit fullscreen'})).toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', {name: 'Exit fullscreen'}));
		expect(container.querySelector('.dashboard-shell.fullscreen')).toBeNull();
	});

	it('floats the toggle above the card normally, but relocates it into the work header controls when fullscreen', () => {
		const {container} = renderPage();

		const floatingToggle = screen.getByRole('button', {name: 'Enter fullscreen'});
		expect(floatingToggle.closest('.dash-work-controls')).toBeNull();
		expect(floatingToggle.parentElement).toHaveClass('dashboard-controls-row');

		fireEvent.click(floatingToggle);

		const inlineToggle = screen.getByRole('button', {name: 'Exit fullscreen'});
		expect(inlineToggle.closest('.dash-work-controls')).not.toBeNull();
		expect(container.querySelectorAll('.dashboard-fullscreen-toggle').length).toBe(1);
	});

	describe('flip card', () => {
		it('flips the card when the flip toggle is clicked', () => {
			const {container} = renderPage();
			const flipToggle = screen.getByRole('button', {name: 'Show back of card'});

			expect(container.querySelector('.dashboard-flip-inner.flipped')).toBeNull();

			fireEvent.click(flipToggle);
			expect(container.querySelector('.dashboard-flip-inner.flipped')).not.toBeNull();
			expect(screen.getByRole('button', {name: 'Show front of card'})).toBeInTheDocument();
		});

		it('disables the flip toggle while fullscreen is active', () => {
			renderPage();
			const fullscreenToggle = screen.getByRole('button', {name: 'Enter fullscreen'});

			expect(screen.getByRole('button', {name: /show .* of card/i})).not.toBeDisabled();

			fireEvent.click(fullscreenToggle);
			expect(screen.getByRole('button', {name: /show .* of card/i})).toBeDisabled();
		});

		it('renders both a front and back face of the card', () => {
			const {container} = renderPage();
			expect(container.querySelector('.dashboard-shell:not(.dashboard-shell--back)')).not.toBeNull();
			expect(container.querySelector('.dashboard-shell.dashboard-shell--back')).not.toBeNull();
		});
	});
});
