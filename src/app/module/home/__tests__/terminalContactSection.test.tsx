import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect, vi} from 'vitest';
import {TerminalContactSection} from '../TerminalContactSection';

vi.mock('@/hooks/use-home-config', () => ({
	useHomeConfig: vi.fn(),
}));

import {useHomeConfig} from '@/hooks/use-home-config';

const mockUseHomeConfig = useHomeConfig as ReturnType<typeof vi.fn>;

const DEFAULT_SOCIAL = [
	{label: 'GitHub', href: 'https://github.com/test', icon: 'mdi:github'},
	{label: 'LinkedIn', href: 'https://linkedin.com/test', icon: 'mdi:linkedin'},
];

function renderSection(overrides: object = {}) {
	mockUseHomeConfig.mockReturnValue({
		config: {
			contactEmail: 'test@example.com',
			contactHeading: "Let's build something & make it faster.",
			contactSubtext: 'Open for engineering work and collaborations.',
			socialLinks: DEFAULT_SOCIAL,
			...overrides,
		},
		loading: false,
	});
	return render(
		<MemoryRouter>
			<TerminalContactSection />
		</MemoryRouter>,
	);
}

describe('TerminalContactSection', () => {
	it("renders contactHeading from config", () => {
		renderSection();
		expect(screen.getByText(/Let's build something/i)).toBeInTheDocument();
	});

	it('renders contactSubtext from config', () => {
		renderSection();
		expect(screen.getByText('Open for engineering work and collaborations.')).toBeInTheDocument();
	});

	it('renders custom contactHeading', () => {
		renderSection({contactHeading: 'Custom heading here'});
		expect(screen.getByText('Custom heading here')).toBeInTheDocument();
	});

	it('renders the mailto link with correct href when contactEmail is set', () => {
		renderSection();
		const link = screen.getByRole('link', {name: 'test@example.com'});
		expect(link).toHaveAttribute('href', 'mailto:test@example.com');
	});

	it('does not render the email button when contactEmail is empty string', () => {
		renderSection({contactEmail: ''});
		expect(screen.queryByRole('link', {name: /mailto:/i})).not.toBeInTheDocument();
	});

	it('renders social links from config with correct hrefs', () => {
		renderSection();
		const ghLink = screen.getByRole('link', {name: 'GitHub'});
		expect(ghLink).toHaveAttribute('href', 'https://github.com/test');
		const liLink = screen.getByRole('link', {name: 'LinkedIn'});
		expect(liLink).toHaveAttribute('href', 'https://linkedin.com/test');
	});

	it('renders no social links when socialLinks is empty', () => {
		renderSection({socialLinks: []});
		expect(screen.queryByRole('link', {name: 'GitHub'})).not.toBeInTheDocument();
	});
});
