import {render, screen} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';

vi.mock('@/data/profile', () => ({
	getProfile: vi.fn(() => ({
		role: 'Technical Artist',
		bio: '',
		location: '',
		contactEmail: '',
		status: 'online',
		avatarSrc: 'https://example.com/aj.jpg',
		socialLinks: [],
	})),
}));

vi.mock('@/data/about', () => ({
	getAbout: vi.fn(() => ({
		greeting: "Hey, I'm AJ.",
		kicker: 'Software engineer and artist.',
		polaroidCaption: "it's me, AJ",
		bio: ['First paragraph.', 'Second **bold** paragraph.'],
		education: [
			{
				school: 'Test University',
				degree: 'BS Testing',
				yearRange: '2019 — 2023',
				current: true,
				description: 'Studied things.',
			},
		],
		services: [
			{title: 'Character Art', badge: 'Illustration', description: 'Draws characters.'},
			{title: 'Technical Art', badge: 'Shaders', description: 'Builds shaders.'},
		],
		skills: ['Painting', 'React'],
		tools: {languages: ['TypeScript'], software: ['Figma']},
	})),
}));

import {DashboardCardBack} from '../DashboardCardBack';

describe('DashboardCardBack', () => {
	it('renders the hero greeting, kicker, and avatar photo', () => {
		render(<DashboardCardBack />);
		expect(screen.getByText("Hey, I'm AJ.")).toBeInTheDocument();
		expect(screen.getByText('Software engineer and artist.')).toBeInTheDocument();
		expect(screen.getByAltText('AJ')).toHaveAttribute('src', 'https://example.com/aj.jpg');
	});

	it('renders the bio paragraphs as markdown, including bold emphasis', () => {
		render(<DashboardCardBack />);
		expect(screen.getByText('First paragraph.')).toBeInTheDocument();
		expect(screen.getByText('bold')).toBeInTheDocument();
	});

	it('renders education entries with school, degree, and year range', () => {
		render(<DashboardCardBack />);
		expect(screen.getByText('BS Testing')).toBeInTheDocument();
		expect(screen.getByText('Test University')).toBeInTheDocument();
		expect(screen.getByText('2019 — 2023')).toBeInTheDocument();
	});

	it('renders every service with its title, badge, and description', () => {
		render(<DashboardCardBack />);
		expect(screen.getByText('Character Art')).toBeInTheDocument();
		expect(screen.getByText('Illustration')).toBeInTheDocument();
		expect(screen.getByText('Technical Art')).toBeInTheDocument();
		expect(screen.getByText('Builds shaders.')).toBeInTheDocument();
	});

	it('renders skills and tools chips', () => {
		render(<DashboardCardBack />);
		expect(screen.getByText('React')).toBeInTheDocument();
		expect(screen.getByText('TypeScript')).toBeInTheDocument();
		expect(screen.getByText('Figma')).toBeInTheDocument();
	});
});
