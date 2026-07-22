import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import CmsProjectEditor from '../CmsProjectEditor';

vi.mock('@/app/api/cms-local', () => ({
	fetchLocalSection: vi.fn().mockResolvedValue([]),
	saveLocalSection: vi.fn().mockResolvedValue(undefined),
	uploadLocalImage: vi.fn().mockResolvedValue('/img/projects/test/test.png'),
	uniqueSlug: vi.fn((name: string) => name.toLowerCase().replace(/\s+/g, '-')),
}));

vi.mock('sonner', () => ({
	toast: {success: vi.fn(), error: vi.fn()},
}));

import {fetchLocalSection, saveLocalSection} from '@/app/api/cms-local';

const mockFetchLocalSection = fetchLocalSection as ReturnType<typeof vi.fn>;
const mockSaveLocalSection = saveLocalSection as ReturnType<typeof vi.fn>;

function renderNew() {
	return render(
		<MemoryRouter initialEntries={['/cms/projects/new']}>
			<Routes>
				<Route path="/cms/projects/new" element={<CmsProjectEditor />} />
			</Routes>
		</MemoryRouter>,
	);
}

function renderEdit(id: string) {
	return render(
		<MemoryRouter initialEntries={[`/cms/projects/${id}/edit`]}>
			<Routes>
				<Route path="/cms/projects/:id/edit" element={<CmsProjectEditor />} />
			</Routes>
		</MemoryRouter>,
	);
}

// The "Title" label in CmsProjectEditor is a sibling of its <input>, not
// associated via htmlFor/id, so getByLabelText can't resolve it. Grab it by
// its required-title-input position instead (first input in the Metadata section).
function getTitleInput(): HTMLInputElement {
	return document.querySelector('.fsection input[required]') as HTMLInputElement;
}

describe('CmsProjectEditor - category field', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFetchLocalSection.mockResolvedValue([]);
	});

	it('renders a category select with Dev / Illustration / Tech Art options', () => {
		renderNew();
		const select = screen.getByLabelText(/category/i) as HTMLSelectElement;
		expect(select).toBeInTheDocument();

		const optionLabels = Array.from(select.options).map((o) => o.textContent);
		expect(optionLabels).toEqual(expect.arrayContaining(['Dev', 'Illustration', 'Tech Art']));
	});

	it('includes the selected category in the saved payload on create', async () => {
		renderNew();
		await waitFor(() => expect(mockFetchLocalSection).toHaveBeenCalled());

		fireEvent.change(getTitleInput(), {target: {value: 'My Project'}});
		fireEvent.change(screen.getByLabelText(/category/i), {target: {value: 'illustration'}});

		fireEvent.click(screen.getByRole('button', {name: /create/i}));

		await waitFor(() => expect(mockSaveLocalSection).toHaveBeenCalled());
		const [, payload] = mockSaveLocalSection.mock.calls[0];
		expect(payload[0].category).toBe('illustration');
	});

	it('pre-selects the existing category when loading a project for edit', async () => {
		mockFetchLocalSection.mockResolvedValue([{
			id: '123',
			name: 'Existing Project',
			category: 'tech-art',
			role: '',
			description: '',
			year: 2026,
			tags: [],
			images: [],
			markdown: '',
			pinned: false,
			draft: false,
		}]);

		renderEdit('123');

		await waitFor(() => expect(getTitleInput()).toHaveValue('Existing Project'));
		const select = screen.getByLabelText(/category/i) as HTMLSelectElement;
		expect(select.value).toBe('tech-art');
	});

	it('includes category in the saved payload when saving an edited project', async () => {
		mockFetchLocalSection.mockResolvedValue([{
			id: '789', name: 'Existing Project', category: 'dev', role: '', description: '',
			year: 2026, tags: [], images: [], markdown: '', pinned: false, draft: false,
		}]);

		renderEdit('789');

		await waitFor(() => expect(getTitleInput()).toHaveValue('Existing Project'));
		fireEvent.click(screen.getByRole('button', {name: /save changes/i}));

		await waitFor(() => expect(mockSaveLocalSection).toHaveBeenCalled());
		const [, payload] = mockSaveLocalSection.mock.calls[0];
		expect(payload[0].category).toBe('dev');
	});
});
