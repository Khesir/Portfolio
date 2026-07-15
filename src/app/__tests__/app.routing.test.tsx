import {render, screen} from '@testing-library/react';
import {describe, it, expect, vi, afterEach} from 'vitest';

vi.mock('@/components/LoadingScreen', () => ({
	LoadingScreen: ({children}: {children: React.ReactNode}) => <>{children}</>,
}));

vi.mock('../module/home/terminalHomePage', () => ({
	default: () => <div data-testid="terminal-home-page">home</div>,
}));

vi.mock('../module/dashboard/TerminalDashboardPage', () => ({
	default: () => <div data-testid="terminal-dashboard-page">dashboard</div>,
}));

vi.mock('../module/terminal/TerminalAboutPage', () => ({
	default: () => <div data-testid="terminal-about-page">about</div>,
}));

import App from '../app';

afterEach(() => {
	vi.unstubAllEnvs();
	window.history.pushState({}, '', '/');
});

describe('index route (/) — VITE_HOME_LAYOUT flag', () => {
	it('renders TerminalHomePage when the flag is unset', () => {
		render(<App />);
		expect(screen.getByTestId('terminal-home-page')).toBeInTheDocument();
		expect(screen.queryByTestId('terminal-dashboard-page')).not.toBeInTheDocument();
	});

	it('renders TerminalHomePage when the flag is "multi"', () => {
		vi.stubEnv('VITE_HOME_LAYOUT', 'multi');
		render(<App />);
		expect(screen.getByTestId('terminal-home-page')).toBeInTheDocument();
		expect(screen.queryByTestId('terminal-dashboard-page')).not.toBeInTheDocument();
	});

	it('renders TerminalDashboardPage when the flag is "single"', () => {
		vi.stubEnv('VITE_HOME_LAYOUT', 'single');
		render(<App />);
		expect(screen.getByTestId('terminal-dashboard-page')).toBeInTheDocument();
		expect(screen.queryByTestId('terminal-home-page')).not.toBeInTheDocument();
	});

	it('does not affect other routes, e.g. /about, regardless of flag value', () => {
		vi.stubEnv('VITE_HOME_LAYOUT', 'single');
		window.history.pushState({}, '', '/about');
		render(<App />);
		expect(screen.getByTestId('terminal-about-page')).toBeInTheDocument();
		expect(screen.queryByTestId('terminal-home-page')).not.toBeInTheDocument();
		expect(screen.queryByTestId('terminal-dashboard-page')).not.toBeInTheDocument();
	});
});
