import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect, vi} from 'vitest';
import TerminalHomePage from '../terminalHomePage';

vi.mock('@/hooks/use-home-config', () => ({
	useHomeConfig: vi.fn(),
}));

import {useHomeConfig} from '@/hooks/use-home-config';

const mockUseHomeConfig = useHomeConfig as ReturnType<typeof vi.fn>;

const DEFAULT_CONFIG = {
	name: 'AJ Rizaldo',
	role: 'Full-Stack Developer',
	description: 'Building things with code.',
	contactEmail: 'test@example.com',
	status: {type: 'online' as const},
	languages: [],
	bannerTitle: '',
	bannerSubtitle: '',
	bannerButtons: [],
	profileImageUrl: 'https://example.com/photo.jpg',
	bannerImageUrl: '',
};

function renderAt(path: string) {
	mockUseHomeConfig.mockReturnValue({config: DEFAULT_CONFIG, loading: false});
	return render(
		<MemoryRouter initialEntries={[path]}>
			<TerminalHomePage />
		</MemoryRouter>,
	);
}

describe('TerminalHomePage', () => {
	it('renders the brand link', () => {
		renderAt('/');
		expect(screen.getByRole('link', {name: /AJ Rizaldo/i})).toBeInTheDocument();
	});

	it('~/home nav link has the "on" active class when at /', () => {
		renderAt('/');
		const homeLink = screen.getByRole('link', {name: '~/home'});
		expect(homeLink).toHaveClass('on');
	});

	it('renders /about nav link with correct href', () => {
		renderAt('/');
		const link = screen.getByRole('link', {name: '/about'});
		expect(link).toHaveAttribute('href', '/about');
	});

	it('renders /work nav link pointing to /projects', () => {
		renderAt('/');
		const link = screen.getByRole('link', {name: '/work'});
		expect(link).toHaveAttribute('href', '/projects');
	});

	it('renders /blog nav link pointing to /blogs', () => {
		renderAt('/');
		const link = screen.getByRole('link', {name: '/blog'});
		expect(link).toHaveAttribute('href', '/blogs');
	});

	it('~/home nav link does not have "on" class when not at /', () => {
		renderAt('/about');
		const homeLink = screen.getByRole('link', {name: '~/home'});
		expect(homeLink).not.toHaveClass('on');
	});

	it('renders name and role from config', () => {
		renderAt('/');
		expect(screen.getByText(/AJ Rizaldo/)).toBeInTheDocument();
		expect(screen.getAllByText('Full-Stack Developer').length).toBeGreaterThan(0);
	});

	it('renders description blurb from config', () => {
		renderAt('/');
		expect(screen.getByText('Building things with code.')).toBeInTheDocument();
	});

	it('"View work →" link points to /projects', () => {
		renderAt('/');
		const link = screen.getByRole('link', {name: 'View work →'});
		expect(link).toHaveAttribute('href', '/projects');
	});

	it('"$ cat about.me" link points to /about', () => {
		renderAt('/');
		const link = screen.getByRole('link', {name: '$ cat about.me'});
		expect(link).toHaveAttribute('href', '/about');
	});

	it('shows "available for work" badge when status is online', () => {
		renderAt('/');
		expect(screen.getByText('available for work')).toBeInTheDocument();
	});

	it('uses config.profileImageUrl for the neofetch profile image', () => {
		renderAt('/');
		const img = screen.getByAltText('Khesir');
		expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
	});

	it('falls back to /img/Mee.png when profileImageUrl is empty', () => {
		mockUseHomeConfig.mockReturnValue({
			config: {...DEFAULT_CONFIG, profileImageUrl: ''},
			loading: false,
		});
		render(
			<MemoryRouter initialEntries={['/']}>
				<TerminalHomePage />
			</MemoryRouter>,
		);
		const img = screen.getByAltText('Khesir');
		expect(img).toHaveAttribute('src', '/img/Mee.png');
	});
});
