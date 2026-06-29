import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect, vi} from 'vitest';
import {ServicePage} from '../servicePage';

vi.mock('@/hooks/use-home-config', () => ({
	useServiceConfig: vi.fn(),
}));

import {useServiceConfig} from '@/hooks/use-home-config';

const mockUseServiceConfig = useServiceConfig as ReturnType<typeof vi.fn>;

const DEFAULT_SERVICES = [
	{
		icon: 'mdi:code-braces',
		title: 'Full-Stack Development',
		mainTag: 'web',
		description: 'End-to-end web applications.',
		tags: ['React', 'TypeScript'],
	},
	{
		icon: 'mdi:server',
		title: 'Backend Engineering',
		mainTag: 'api',
		description: 'Scalable APIs and services.',
		tags: ['NestJS', 'PostgreSQL'],
	},
];

const DEFAULT_SOCIAL = [
	{label: 'GitHub', href: 'https://github.com/test', icon: 'mdi:github'},
	{label: 'LinkedIn', href: 'https://linkedin.com/test', icon: 'mdi:linkedin'},
];

const DEFAULT_CONFIG = {
	greeting: 'Hey —',
	headline: "here's what I can help with.",
	roleLabel: 'AJ · Khesir // Full-Stack & Toolmaker',
	siteUrl: 'khesir',
	profileImageUrl: 'https://example.com/photo.jpg',
	contactEmail: 'aj@example.com',
	socialLinks: DEFAULT_SOCIAL,
	services: DEFAULT_SERVICES,
};

function renderPage(overrides: object = {}) {
	mockUseServiceConfig.mockReturnValue({
		config: {...DEFAULT_CONFIG, ...overrides},
		loading: false,
	});
	return render(
		<MemoryRouter>
			<ServicePage />
		</MemoryRouter>,
	);
}

describe('ServicePage', () => {
	it('renders greeting, headline, roleLabel, siteUrl from config', () => {
		renderPage();
		expect(screen.getByText("Hey —")).toBeInTheDocument();
		expect(screen.getByText("here's what I can help with.")).toBeInTheDocument();
		expect(screen.getByText('AJ · Khesir // Full-Stack & Toolmaker')).toBeInTheDocument();
		expect(screen.getByText('khesir')).toBeInTheDocument();
	});

	it('renders profile img with src equal to profileImageUrl', () => {
		renderPage();
		const img = screen.getByRole('img', {name: 'profile'});
		expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
	});

	it('clicking the card causes back face service titles to appear in the DOM', () => {
		renderPage();
		const card = screen.getByText("Hey —").closest('[class*="cursor-pointer"]') as HTMLElement;
		fireEvent.click(card);
		expect(screen.getByText('Full-Stack Development')).toBeInTheDocument();
		expect(screen.getByText('Backend Engineering')).toBeInTheDocument();
	});

	it('back face renders each service title, mainTag, and description', () => {
		renderPage();
		expect(screen.getByText('Full-Stack Development')).toBeInTheDocument();
		expect(screen.getByText('web')).toBeInTheDocument();
		expect(screen.getByText('End-to-end web applications.')).toBeInTheDocument();
		expect(screen.getByText('Backend Engineering')).toBeInTheDocument();
		expect(screen.getByText('api')).toBeInTheDocument();
		expect(screen.getByText('Scalable APIs and services.')).toBeInTheDocument();
	});

	it('back footer renders contactEmail and each socialLink href', () => {
		renderPage();
		const emailLink = screen.getByRole('link', {name: 'aj@example.com'});
		expect(emailLink).toHaveAttribute('href', 'mailto:aj@example.com');

		const ghLink = screen.getByRole('link', {name: 'GitHub'});
		expect(ghLink).toHaveAttribute('href', 'https://github.com/test');

		const liLink = screen.getByRole('link', {name: 'LinkedIn'});
		expect(liLink).toHaveAttribute('href', 'https://linkedin.com/test');
	});

	it('renders without error when services is empty', () => {
		renderPage({services: []});
		expect(screen.getByText("Hey —")).toBeInTheDocument();
	});

	it('renders without error when socialLinks is empty', () => {
		renderPage({socialLinks: []});
		expect(screen.getByText("Hey —")).toBeInTheDocument();
	});

	it('renders three skeleton placeholders when loading', () => {
		mockUseServiceConfig.mockReturnValue({
			config: DEFAULT_CONFIG,
			loading: true,
		});
		render(
			<MemoryRouter>
				<ServicePage />
			</MemoryRouter>,
		);
		const skeletons = document.querySelectorAll('.animate-pulse');
		expect(skeletons.length).toBe(3);
	});
});
