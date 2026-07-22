import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import CmsProjectEditor from '../CmsProjectEditor';

vi.mock('@/app/api/projects', () => ({
	fetchProjectsByID: vi.fn(),
}));

vi.mock('@/app/api/cms', () => ({
	cmsCreateProject: vi.fn().mockResolvedValue({}),
	cmsUpdateProject: vi.fn().mockResolvedValue({}),
	cmsDeleteProject: vi.fn().mockResolvedValue({}),
}));

vi.mock('sonner', () => ({
	toast: {success: vi.fn(), error: vi.fn()},
}));

import {fetchProjectsByID} from '@/app/api/projects';
import {cmsCreateProject, cmsUpdateProject} from '@/app/api/cms';

const mockFetchProjectsByID = fetchProjectsByID as ReturnType<typeof vi.fn>;
const mockCmsCreateProject = cmsCreateProject as ReturnType<typeof vi.fn>;
const mockCmsUpdateProject = cmsUpdateProject as ReturnType<typeof vi.fn>;

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
	});

	it('renders a category select with Dev / Illustration / Tech Art options', () => {
		renderNew();
		const select = screen.getByLabelText(/category/i) as HTMLSelectElement;
		expect(select).toBeInTheDocument();

		const optionLabels = Array.from(select.options).map((o) => o.textContent);
		expect(optionLabels).toEqual(expect.arrayContaining(['Dev', 'Illustration', 'Tech Art']));
	});

	it('includes the selected category in the create payload on save', async () => {
		renderNew();

		fireEvent.change(getTitleInput(), {target: {value: 'My Project'}});
		fireEvent.change(screen.getByLabelText(/category/i), {target: {value: 'illustration'}});

		fireEvent.click(screen.getByRole('button', {name: /create/i}));

		await waitFor(() => expect(mockCmsCreateProject).toHaveBeenCalled());
		const payload = mockCmsCreateProject.mock.calls[0][0];
		expect(payload.category).toBe('illustration');
	});

	it('pre-selects the existing category when loading a project for edit', async () => {
		mockFetchProjectsByID.mockResolvedValue({
			name: 'Existing Project',
			category: 'tech-art',
		});

		renderEdit('123');

		await waitFor(() => expect(getTitleInput()).toHaveValue('Existing Project'));
		const select = screen.getByLabelText(/category/i) as HTMLSelectElement;
		expect(select.value).toBe('tech-art');
	});

	it('does not error and leaves category blank when loading a project without one', async () => {
		mockFetchProjectsByID.mockResolvedValue({
			name: 'No Category Project',
		});

		renderEdit('456');

		await waitFor(() => expect(getTitleInput()).toHaveValue('No Category Project'));
		const select = screen.getByLabelText(/category/i) as HTMLSelectElement;
		expect(select.value).toBe('');
	});

	it('includes category in the update payload when saving an edited project', async () => {
		mockFetchProjectsByID.mockResolvedValue({
			name: 'Existing Project',
			category: 'dev',
		});

		renderEdit('789');

		await waitFor(() => expect(getTitleInput()).toHaveValue('Existing Project'));
		fireEvent.click(screen.getByRole('button', {name: /save changes/i}));

		await waitFor(() => expect(mockCmsUpdateProject).toHaveBeenCalled());
		const payload = mockCmsUpdateProject.mock.calls[0][1];
		expect(payload.category).toBe('dev');
	});
});
