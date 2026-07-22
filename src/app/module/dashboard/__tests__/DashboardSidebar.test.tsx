import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';

vi.mock('@/data/profile', () => ({
	getProfile: vi.fn(),
}));

vi.mock('@/data/journey', () => ({
	getJourney: vi.fn(() => []),
}));

import {getProfile} from '@/data/profile';
import DashboardSidebar from '../DashboardSidebar';

const mockGetProfile = getProfile as ReturnType<typeof vi.fn>;

const DEFAULT_PROFILE = {
	role: 'Full-Stack Developer',
	bio: 'Building things with code.',
	location: 'Philippines · UTC+8',
	contactEmail: 'test@example.com',
	status: 'online',
	avatarSrc: 'https://example.com/photo.jpg',
	socialLinks: [
		{label: 'GitHub', href: 'https://github.com/khesir'},
		{label: 'LinkedIn', href: 'https://linkedin.com/in/khesir'},
	],
};

function renderSidebar(overrides = {}) {
	mockGetProfile.mockReturnValue({...DEFAULT_PROFILE, ...overrides});
	return render(<DashboardSidebar />);
}

describe('DashboardSidebar', () => {
	it('renders role from profile data', () => {
		renderSidebar();
		expect(screen.getByText('Full-Stack Developer')).toBeInTheDocument();
	});

	it('renders avatar image using avatarSrc from profile data', () => {
		renderSidebar();
		const img = screen.getByAltText('Khesir');
		expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
	});

	it('falls back to /img/Mee.png when avatarSrc is empty', () => {
		renderSidebar({avatarSrc: ''});
		const img = screen.getByAltText('Khesir');
		expect(img).toHaveAttribute('src', '/img/Mee.png');
	});

	it('shows an availability indicator when status is online', () => {
		renderSidebar();
		expect(screen.getByText(/available for work/i)).toBeInTheDocument();
	});

	it('does not show the online availability indicator when status is not online', () => {
		renderSidebar({status: 'dnd'});
		expect(screen.queryByText(/available for work/i)).not.toBeInTheDocument();
	});

	it('renders the bio from profile data', () => {
		renderSidebar();
		expect(screen.getByText('Building things with code.')).toBeInTheDocument();
	});

	it('renders location from profile data', () => {
		renderSidebar();
		expect(screen.getByText('Philippines · UTC+8')).toBeInTheDocument();
	});

	it('renders the contact email as a trigger that opens the contact dialog', () => {
		renderSidebar();
		expect(screen.getByText('test@example.com')).toBeInTheDocument();

		fireEvent.click(screen.getByText('test@example.com'));
		expect(screen.getByRole('dialog', {name: 'Get in touch'})).toBeInTheDocument();
	});

	it('renders social links from profile.socialLinks with real hrefs', () => {
		renderSidebar();
		const githubLink = screen.getByRole('link', {name: 'GitHub'});
		expect(githubLink).toHaveAttribute('href', 'https://github.com/khesir');

		const linkedinLink = screen.getByRole('link', {name: 'LinkedIn'});
		expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/khesir');
	});

	it('opens social links in a new tab with rel=noopener noreferrer', () => {
		renderSidebar();
		const githubLink = screen.getByRole('link', {name: 'GitHub'});
		expect(githubLink).toHaveAttribute('target', '_blank');
		expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('renders the journey slot (DashboardJourney) within the sidebar', () => {
		renderSidebar();
		expect(document.querySelector('.dash-journey-slot')).toBeInTheDocument();
	});

	it('renders the avatar with rounded-square styling, not a circle', () => {
		renderSidebar();
		const img = screen.getByAltText('Khesir');
		expect(img).toHaveClass('dash-avatar');
	});

	it('renders the Journey section before the Contact section in DOM order', () => {
		renderSidebar();
		const journey = document.querySelector('.dash-journey-slot');
		const contact = document.querySelector('.dash-contact');
		expect(journey).toBeInTheDocument();
		expect(contact).toBeInTheDocument();
		expect(
			journey!.compareDocumentPosition(contact!) & Node.DOCUMENT_POSITION_FOLLOWING
		).toBeTruthy();
	});
});
