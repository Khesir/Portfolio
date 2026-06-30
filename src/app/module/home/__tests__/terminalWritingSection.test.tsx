import {render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, it, expect, vi} from 'vitest';
import {TerminalWritingSection} from '../terminalWritingSection';

vi.mock('@/app/api/blogs', () => ({
	fetchBlogs: vi.fn(),
}));

import {fetchBlogs} from '@/app/api/blogs';

const mockFetchBlogs = fetchBlogs as ReturnType<typeof vi.fn>;

function makeBlogs(count: number) {
	return Array.from({length: count}, (_, i) => ({
		_id: `id-${i}`,
		name: `Blog Post ${i + 1}`,
		releasedDate: `2024-0${(i % 9) + 1}-15`,
		minRead: i % 2 === 0 ? 5 : undefined,
		tags: i % 2 === 0 ? [`tag-${i}`] : [],
	}));
}

function renderComponent(props: {count?: number} = {}) {
	return render(
		<MemoryRouter>
			<TerminalWritingSection {...props} />
		</MemoryRouter>,
	);
}

describe('TerminalWritingSection', () => {
	it('renders blog titles when fetchBlogs resolves', async () => {
		mockFetchBlogs.mockResolvedValue(makeBlogs(2));
		renderComponent();
		await waitFor(() => {
			expect(screen.getByText('Blog Post 1')).toBeInTheDocument();
			expect(screen.getByText('Blog Post 2')).toBeInTheDocument();
		});
	});

	it('renders date formatted as YYYY.MM.DD', async () => {
		mockFetchBlogs.mockResolvedValue([
			{_id: '1', name: 'Test', releasedDate: '2024-03-07', tags: []},
		]);
		renderComponent();
		await waitFor(() => {
			expect(screen.getByText('2024.03.07')).toBeInTheDocument();
		});
	});

	it('shows at most count blogs when more are returned (default 3)', async () => {
		mockFetchBlogs.mockResolvedValue(makeBlogs(5));
		renderComponent();
		await waitFor(() => {
			expect(screen.getByText('Blog Post 1')).toBeInTheDocument();
			expect(screen.getByText('Blog Post 3')).toBeInTheDocument();
		});
		expect(screen.queryByText('Blog Post 4')).not.toBeInTheDocument();
		expect(screen.queryByText('Blog Post 5')).not.toBeInTheDocument();
	});

	it('respects count prop when set to 1', async () => {
		mockFetchBlogs.mockResolvedValue(makeBlogs(5));
		renderComponent({count: 1});
		await waitFor(() => {
			expect(screen.getByText('Blog Post 1')).toBeInTheDocument();
		});
		expect(screen.queryByText('Blog Post 2')).not.toBeInTheDocument();
	});

	it('renders first tag as category chip', async () => {
		mockFetchBlogs.mockResolvedValue([
			{_id: '1', name: 'Tagged Post', releasedDate: '2024-01-01', tags: ['typescript', 'react']},
		]);
		renderComponent();
		await waitFor(() => {
			expect(screen.getByText('typescript')).toBeInTheDocument();
		});
		expect(screen.queryByText('react')).not.toBeInTheDocument();
	});

	it('omits category chip when tags is empty', async () => {
		mockFetchBlogs.mockResolvedValue([
			{_id: '1', name: 'No Tags', releasedDate: '2024-01-01', tags: []},
		]);
		renderComponent();
		await waitFor(() => {
			expect(screen.getByText('No Tags')).toBeInTheDocument();
		});
		expect(document.querySelector('.pcat')).not.toBeInTheDocument();
	});

	it('omits read time when minRead is absent', async () => {
		mockFetchBlogs.mockResolvedValue([
			{_id: '1', name: 'No Read Time', releasedDate: '2024-01-01', tags: []},
		]);
		renderComponent();
		await waitFor(() => {
			expect(screen.getByText('No Read Time')).toBeInTheDocument();
		});
		expect(document.querySelector('.pread')).not.toBeInTheDocument();
	});

	it('renders empty state when blogs array is empty', async () => {
		mockFetchBlogs.mockResolvedValue([]);
		renderComponent();
		await waitFor(() => {
			expect(screen.getByText('No posts yet.')).toBeInTheDocument();
		});
	});

	it('"all posts →" link is present', async () => {
		mockFetchBlogs.mockResolvedValue([]);
		renderComponent();
		await waitFor(() => {
			const link = screen.getByRole('link', {name: 'all posts →'});
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute('href', '/blogs');
		});
	});
});
