import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect, vi} from 'vitest';
import {TerminalStackSection} from '../terminalStackSection';

vi.mock('@/hooks/use-home-config', () => ({
	useAboutConfig: vi.fn(),
}));

import {useAboutConfig} from '@/hooks/use-home-config';

const mockUseAboutConfig = useAboutConfig as ReturnType<typeof vi.fn>;

const MOCK_SKILLS = [
	{category: 'Frontend', items: ['React', 'TypeScript']},
	{category: 'Backend', items: ['Node.js', 'NestJS']},
];

function renderSection(technicalSkills = MOCK_SKILLS) {
	mockUseAboutConfig.mockReturnValue({
		config: {technicalSkills},
		loading: false,
	});
	return render(
		<MemoryRouter>
			<TerminalStackSection />
		</MemoryRouter>,
	);
}

describe('TerminalStackSection', () => {
	it('renders the section label "tech_stack"', () => {
		renderSection();
		expect(screen.getByRole('heading', {name: 'tech_stack'})).toBeInTheDocument();
	});

	it('renders category labels from mocked data', () => {
		renderSection();
		expect(screen.getByText('Frontend')).toBeInTheDocument();
		expect(screen.getByText('Backend')).toBeInTheDocument();
	});

	it('renders chip items from mocked data', () => {
		renderSection();
		expect(screen.getByText('React')).toBeInTheDocument();
		expect(screen.getByText('TypeScript')).toBeInTheDocument();
		expect(screen.getByText('Node.js')).toBeInTheDocument();
		expect(screen.getByText('NestJS')).toBeInTheDocument();
	});

	it('renders with empty technicalSkills without crashing', () => {
		renderSection([]);
		expect(screen.getByRole('heading', {name: 'tech_stack'})).toBeInTheDocument();
		expect(document.querySelector('.stack')).toBeInTheDocument();
		expect(document.querySelectorAll('.stack-row')).toHaveLength(0);
	});
});
