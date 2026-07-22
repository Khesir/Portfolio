import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';

// Radix's Popover (via react-popper) uses ResizeObserver to measure the anchor,
// which jsdom does not implement — same class of gap as the IntersectionObserver
// issue documented in issue 001. Scoped to this file only.
class MockResizeObserver {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
}
window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

vi.mock('@/data/journey', () => ({
	getJourney: vi.fn(),
}));

import {getJourney} from '@/data/journey';
import DashboardJourney from '../DashboardJourney';

const mockGetJourney = getJourney as ReturnType<typeof vi.fn>;

const makeEntries = (n: number) =>
	Array.from({length: n}, (_, i) => ({
		company: `Company ${i}`,
		positions: [
			{
				yearRange: `202${i} — Present`,
				title: `Position ${i}`,
				current: i === 0,
				description: `Description for ${i}`,
				skills: ['React', 'TypeScript'],
				detail: `Deeper write-up for ${i}`,
			},
		],
	}));

describe('DashboardJourney', () => {
	it('renders one row per journey entry, synchronously (no fetch)', () => {
		mockGetJourney.mockReturnValue(makeEntries(3));
		render(<DashboardJourney />);
		expect(screen.getAllByText(/Position \d/).length).toBe(3);
		expect(screen.getByText('Position 0')).toBeInTheDocument();
		expect(screen.getByText(/Company 0/)).toBeInTheDocument();
	});

	it('always renders description and skills, without needing a click', () => {
		mockGetJourney.mockReturnValue(makeEntries(1));
		render(<DashboardJourney />);
		expect(screen.getByText('Description for 0')).toBeInTheDocument();
		expect(screen.getByText(/React/)).toBeInTheDocument();
		expect(screen.getByText(/TypeScript/)).toBeInTheDocument();
	});

	it('renders the yearRange string as given', () => {
		mockGetJourney.mockReturnValue(makeEntries(1));
		render(<DashboardJourney />);
		expect(screen.getByText('2020 — Present')).toBeInTheDocument();
	});

	it('renders nothing when journey is empty', () => {
		mockGetJourney.mockReturnValue([]);
		render(<DashboardJourney />);
		expect(screen.queryByText(/Position/)).not.toBeInTheDocument();
	});

	it('renders one timeline row per fixture entry (per company)', () => {
		mockGetJourney.mockReturnValue(makeEntries(3));
		render(<DashboardJourney />);
		expect(document.querySelectorAll('.dash-journey-item').length).toBe(3);
	});

	it('marks a company as current when any of its positions is current', () => {
		mockGetJourney.mockReturnValue(makeEntries(3));
		render(<DashboardJourney />);
		const items = document.querySelectorAll('.dash-journey-item');
		expect(items[0]).toHaveClass('dash-journey-item--current');
		expect(items[1]).not.toHaveClass('dash-journey-item--current');
		expect(items[2]).not.toHaveClass('dash-journey-item--current');
	});

	it('does not render the deeper detail until the "more" trigger is clicked', () => {
		mockGetJourney.mockReturnValue(makeEntries(1));
		render(<DashboardJourney />);
		expect(screen.queryByText('Deeper write-up for 0')).not.toBeInTheDocument();

		fireEvent.click(screen.getByLabelText('Show more detail'));
		expect(screen.getByText('Deeper write-up for 0')).toBeInTheDocument();
	});

	it('clicking an open "more" trigger again closes its popover', () => {
		mockGetJourney.mockReturnValue(makeEntries(1));
		render(<DashboardJourney />);

		fireEvent.click(screen.getByLabelText('Show more detail'));
		expect(screen.getByText('Deeper write-up for 0')).toBeInTheDocument();

		fireEvent.click(screen.getByLabelText('Show less detail'));
		expect(screen.queryByText('Deeper write-up for 0')).not.toBeInTheDocument();
	});

	it('opening one entry\'s popover closes any previously opened one', () => {
		mockGetJourney.mockReturnValue(makeEntries(2));
		render(<DashboardJourney />);
		const triggers = screen.getAllByLabelText('Show more detail');

		fireEvent.click(triggers[0]);
		expect(screen.getByText('Deeper write-up for 0')).toBeInTheDocument();

		fireEvent.click(screen.getAllByLabelText('Show more detail')[0]);
		expect(screen.queryByText('Deeper write-up for 0')).not.toBeInTheDocument();
		expect(screen.getByText('Deeper write-up for 1')).toBeInTheDocument();
	});

	it('does not render a "more" trigger when there is no detail content', () => {
		mockGetJourney.mockReturnValue([
			{
				company: 'Bare Co',
				positions: [
					{yearRange: '2020', title: 'Bare Role', current: false, description: 'Just the brief.', skills: []},
				],
			},
		]);
		render(<DashboardJourney />);
		expect(screen.getByText('Just the brief.')).toBeInTheDocument();
		expect(screen.queryByLabelText(/show more detail/i)).not.toBeInTheDocument();
	});

	describe('promotions (multiple positions at one company)', () => {
		function makeGroupedEntry() {
			return {
				company: 'Growth Co',
				positions: [
					{
						yearRange: '2024 — Present',
						title: 'Senior Engineer',
						current: true,
						description: 'Promoted to lead the platform team.',
						skills: ['Leadership'],
						detail: 'Led the migration to microservices.',
					},
					{
						yearRange: '2022 — 24',
						title: 'Software Engineer',
						current: false,
						description: 'Joined as an individual contributor.',
						skills: ['React'],
						detail: 'Shipped the initial product as an IC.',
					},
				],
			};
		}

		it('renders the most recent position first, un-indented, same as a single-position entry', () => {
			mockGetJourney.mockReturnValue([makeGroupedEntry()]);
			render(<DashboardJourney />);

			expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
			expect(screen.getByText('Growth Co')).toBeInTheDocument();
			// the first position is not inside the indented .dash-journey-positions wrapper
			expect(screen.getByText('Senior Engineer').closest('.dash-journey-position')).toBeNull();
		});

		it('renders earlier positions indented underneath the first', () => {
			mockGetJourney.mockReturnValue([makeGroupedEntry()]);
			render(<DashboardJourney />);

			expect(screen.getByText('Software Engineer')).toBeInTheDocument();
			expect(document.querySelectorAll('.dash-journey-position')).toHaveLength(1);
			expect(screen.getByText('Software Engineer').closest('.dash-journey-position')).not.toBeNull();
		});

		it('renders only one timeline dot/item for the whole company, not one per position', () => {
			mockGetJourney.mockReturnValue([makeGroupedEntry()]);
			render(<DashboardJourney />);
			expect(document.querySelectorAll('.dash-journey-item')).toHaveLength(1);
		});

		it('marks the company current if any nested position is current', () => {
			mockGetJourney.mockReturnValue([makeGroupedEntry()]);
			render(<DashboardJourney />);
			expect(document.querySelector('.dash-journey-item')).toHaveClass('dash-journey-item--current');
		});

		it('each position keeps its own independent "more" popover', () => {
			mockGetJourney.mockReturnValue([makeGroupedEntry()]);
			render(<DashboardJourney />);

			const triggers = screen.getAllByLabelText('Show more detail');
			expect(triggers).toHaveLength(2);

			fireEvent.click(triggers[1]);
			expect(screen.getByText('Shipped the initial product as an IC.')).toBeInTheDocument();
			expect(screen.queryByText('Led the migration to microservices.')).not.toBeInTheDocument();
		});
	});
});
