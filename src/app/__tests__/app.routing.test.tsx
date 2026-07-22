import {render, screen} from '@testing-library/react';
import {describe, it, expect, afterEach, vi} from 'vitest';

vi.mock('../module/dashboard/TerminalDashboardPage', () => ({
	default: () => <div data-testid="terminal-dashboard-page">dashboard</div>,
}));

vi.mock('../module/terminal/ProjectReadPage', () => ({
	default: () => <div data-testid="project-read-page">project read</div>,
}));

import App from '../app';

afterEach(() => {
	window.history.pushState({}, '', '/');
});

describe('App routing', () => {
	it('renders TerminalDashboardPage at the index route', () => {
		render(<App />);
		expect(screen.getByTestId('terminal-dashboard-page')).toBeInTheDocument();
	});

	it('renders ProjectReadPage at /work/view/:title', () => {
		window.history.pushState({}, '', '/work/view/some-project');
		render(<App />);
		expect(screen.getByTestId('project-read-page')).toBeInTheDocument();
	});

	it('does not render the dashboard for a previously-existing route like /about', () => {
		window.history.pushState({}, '', '/about');
		render(<App />);
		expect(screen.queryByTestId('terminal-dashboard-page')).not.toBeInTheDocument();
		expect(screen.queryByTestId('project-read-page')).not.toBeInTheDocument();
	});

	it('does not render anything for other previously-existing routes like /work or /blogs', () => {
		window.history.pushState({}, '', '/work');
		const {container: workContainer} = render(<App />);
		expect(workContainer.textContent).toBe('');

		window.history.pushState({}, '', '/blogs');
		const {container: blogsContainer} = render(<App />);
		expect(blogsContainer.textContent).toBe('');
	});
});
