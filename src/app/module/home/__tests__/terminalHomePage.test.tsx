import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect, vi} from 'vitest';
import TerminalHomePage from '../terminalHomePage';

vi.mock('@/hooks/use-home-config', () => ({
	useHomeConfig: vi.fn(),
	useAboutConfig: vi.fn(() => ({config: {technicalSkills: [], coreCompetencies: []}, loading: false})),
	useServiceConfig: vi.fn(() => ({config: {services: []}, loading: false})),
}));

import {useHomeConfig} from '@/hooks/use-home-config';

const mockUseHomeConfig = useHomeConfig as ReturnType<typeof vi.fn>;

const DEFAULT_CONFIG = {
	name: 'AJ Rizaldo',
	role: 'Full-Stack Developer',
	description: 'Building things with code.',
	contactEmail: 'test@example.com',
	status: {type: 'online' as const},
	heroButtons: [
		{label: 'View work →', to: '/work'},
		{label: '$ cat about.me', to: '/about'},
	],
	profileImageUrl: 'https://example.com/photo.jpg',
	bannerImageUrl: '',
	neofetchRows: [
		{key: 'Role', value: 'Full-Stack · Toolmaker'},
		{key: 'Lang', value: 'TypeScript · C#'},
	],
	location: 'Philippines · UTC+8',
	tags: ['agentic AI', 'APIs & tooling'],
	selectedWorkCount: 3,
	writingCount: 3,
	contactHeading: "Let's build something & make it faster.",
	contactSubtext: 'Open for engineering work and collaborations.',
	socialLinks: [],
	footerCopyright: '© 2026 AJ — Khesir',
	footerTagline: 'direction B — "Terminal" · tech-first',
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
		expect(screen.getByRole('link', {name: /khesir/i})).toBeInTheDocument();
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

	it('renders /work nav link pointing to /work', () => {
		renderAt('/');
		const link = screen.getByRole('link', {name: '/work'});
		expect(link).toHaveAttribute('href', '/work');
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

	it('"View work →" link points to /work', () => {
		renderAt('/');
		const link = screen.getByRole('link', {name: 'View work →'});
		expect(link).toHaveAttribute('href', '/work');
	});

	it('"$ cat about.me" link points to /about', () => {
		renderAt('/');
		const link = screen.getByRole('link', {name: '$ cat about.me'});
		expect(link).toHaveAttribute('href', '/about');
	});

	it('renders heroButtons from config', () => {
		mockUseHomeConfig.mockReturnValue({
			config: {...DEFAULT_CONFIG, heroButtons: [{label: 'Custom Btn', to: '/custom'}]},
			loading: false,
		});
		render(
			<MemoryRouter initialEntries={['/']}>
				<TerminalHomePage />
			</MemoryRouter>,
		);
		expect(screen.getByRole('link', {name: 'Custom Btn'})).toBeInTheDocument();
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

	it('renders neofetchRows from config', () => {
		renderAt('/');
		expect(screen.getByText('Role')).toBeInTheDocument();
		expect(screen.getByText('Full-Stack · Toolmaker')).toBeInTheDocument();
		expect(screen.getByText('Lang')).toBeInTheDocument();
	});

	it('renders location in hmeta from config', () => {
		renderAt('/');
		expect(screen.getByText('Philippines · UTC+8')).toBeInTheDocument();
	});

	it('renders tags in hmeta from config', () => {
		renderAt('/');
		expect(screen.getByText('agentic AI')).toBeInTheDocument();
		expect(screen.getByText('APIs & tooling')).toBeInTheDocument();
	});

	it('renders empty neofetchRows without crashing', () => {
		mockUseHomeConfig.mockReturnValue({
			config: {...DEFAULT_CONFIG, neofetchRows: []},
			loading: false,
		});
		render(
			<MemoryRouter initialEntries={['/']}>
				<TerminalHomePage />
			</MemoryRouter>,
		);
		expect(screen.queryByText('Role')).not.toBeInTheDocument();
	});

	it('renders empty tags without crashing', () => {
		mockUseHomeConfig.mockReturnValue({
			config: {...DEFAULT_CONFIG, tags: []},
			loading: false,
		});
		render(
			<MemoryRouter initialEntries={['/']}>
				<TerminalHomePage />
			</MemoryRouter>,
		);
		expect(screen.queryByText('agentic AI')).not.toBeInTheDocument();
	});
});
