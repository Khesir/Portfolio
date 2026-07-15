import {render, screen} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';

vi.mock('@/hooks/use-home-config', () => ({
	useHomeConfig: vi.fn(),
	useAboutConfig: vi.fn(),
}));

vi.mock('@/app/api/experience', () => ({
	fetchExperiences: vi.fn().mockResolvedValue([]),
}));

import {useHomeConfig, useAboutConfig} from '@/hooks/use-home-config';
import DashboardSidebar from '../DashboardSidebar';

const mockUseHomeConfig = useHomeConfig as ReturnType<typeof vi.fn>;
const mockUseAboutConfig = useAboutConfig as ReturnType<typeof vi.fn>;

const DEFAULT_HOME = {
	name: 'AJ Rizaldo',
	role: 'Full-Stack Developer',
	description: 'Building things with code.',
	contactEmail: 'test@example.com',
	status: {type: 'online' as const},
	profileImageUrl: 'https://example.com/photo.jpg',
	location: 'Philippines · UTC+8',
	socialLinks: [
		{label: 'GitHub', href: 'https://github.com/khesir', icon: 'mdi:github'},
		{label: 'LinkedIn', href: 'https://linkedin.com/in/khesir', icon: ''},
	],
};

const DEFAULT_ABOUT = {
	bioTagline: 'Short bio tagline here.',
	bioBody: 'Long form bio body text.',
	profileImageUrl: '',
	location: '',
};

function renderSidebar(homeOverrides = {}, aboutOverrides = {}) {
	mockUseHomeConfig.mockReturnValue({config: {...DEFAULT_HOME, ...homeOverrides}, loading: false});
	mockUseAboutConfig.mockReturnValue({config: {...DEFAULT_ABOUT, ...aboutOverrides}, loading: false});
	return render(<DashboardSidebar />);
}

describe('DashboardSidebar', () => {
	it('renders name and role from config', () => {
		renderSidebar();
		expect(screen.getByText('AJ Rizaldo')).toBeInTheDocument();
		expect(screen.getByText('Full-Stack Developer')).toBeInTheDocument();
	});

	it('renders avatar image using profileImageUrl from config', () => {
		renderSidebar();
		const img = screen.getByAltText('AJ Rizaldo');
		expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
	});

	it('shows an availability indicator when status is online', () => {
		renderSidebar();
		expect(screen.getByText(/available for work/i)).toBeInTheDocument();
	});

	it('does not show the online availability indicator when status is dnd', () => {
		renderSidebar({status: {type: 'dnd'}});
		expect(screen.queryByText(/available for work/i)).not.toBeInTheDocument();
	});

	it('renders the short bio (bioTagline) from about config', () => {
		renderSidebar();
		expect(screen.getByText('Short bio tagline here.')).toBeInTheDocument();
	});

	it('renders location from home config', () => {
		renderSidebar();
		expect(screen.getByText('Philippines · UTC+8')).toBeInTheDocument();
	});

	it('renders a mailto link using the real contact email from config', () => {
		renderSidebar();
		const emailLink = screen.getByRole('link', {name: 'test@example.com'});
		expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
	});

	it('renders social links from config.socialLinks with real hrefs, not placeholders', () => {
		renderSidebar();
		const githubLink = screen.getByRole('link', {name: 'GitHub'});
		expect(githubLink).toHaveAttribute('href', 'https://github.com/khesir');
		expect(githubLink).not.toHaveAttribute('href', '#');

		const linkedinLink = screen.getByRole('link', {name: 'LinkedIn'});
		expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/khesir');
	});

	it('opens social links in a new tab with rel=noopener noreferrer', () => {
		renderSidebar();
		const githubLink = screen.getByRole('link', {name: 'GitHub'});
		expect(githubLink).toHaveAttribute('target', '_blank');
		expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
	});
});
