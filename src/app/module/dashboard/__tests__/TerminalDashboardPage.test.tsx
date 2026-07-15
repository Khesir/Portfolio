import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect, vi} from 'vitest';

vi.mock('@/app/api/experience', () => ({
	fetchExperiences: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/app/api/projects', () => ({
	fetchFeaturedProjects: vi.fn().mockResolvedValue([]),
	fetchProjects: vi.fn().mockResolvedValue([]),
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
});
