import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect, vi} from 'vitest';
import {TerminalContactSection} from '../terminalContactSection';

vi.mock('@/hooks/use-home-config', () => ({
	useHomeConfig: vi.fn(),
}));

import {useHomeConfig} from '@/hooks/use-home-config';

const mockUseHomeConfig = useHomeConfig as ReturnType<typeof vi.fn>;

function renderSection(contactEmail: string) {
	mockUseHomeConfig.mockReturnValue({
		config: {contactEmail},
		loading: false,
	});
	return render(
		<MemoryRouter>
			<TerminalContactSection />
		</MemoryRouter>,
	);
}

describe('TerminalContactSection', () => {
	it('renders the heading "Let\'s build something"', () => {
		renderSection('test@example.com');
		expect(screen.getByText(/Let's build something/i)).toBeInTheDocument();
	});

	it('renders the mailto link with correct href when contactEmail is set', () => {
		renderSection('hello@example.com');
		const link = screen.getByRole('link', {name: 'hello@example.com'});
		expect(link).toHaveAttribute('href', 'mailto:hello@example.com');
	});

	it('does not render the email button when contactEmail is empty string', () => {
		renderSection('');
		expect(screen.queryByRole('link', {name: /mailto:/i})).not.toBeInTheDocument();
	});

	it('renders four social links with href="#"', () => {
		renderSection('test@example.com');
		const socLinks = ['GitHub', 'LinkedIn', 'Twitter', 'Email'].map(
			label => screen.getByRole('link', {name: label}),
		);
		socLinks.forEach(link => expect(link).toHaveAttribute('href', '#'));
	});
});
