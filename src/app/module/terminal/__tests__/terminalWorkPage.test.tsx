import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {describe, it, expect, vi, beforeEach} from 'vitest'
import TerminalWorkPage from '../TerminalWorkPage'

vi.mock('@/hooks/use-home-config', () => ({
  useHomeConfig: vi.fn(),
}))
vi.mock('@/app/api/projects', () => ({
  fetchFeaturedProjects: vi.fn(),
  fetchProjects: vi.fn(),
}))

import {useHomeConfig} from '@/hooks/use-home-config'
import {fetchFeaturedProjects, fetchProjects} from '@/app/api/projects'

const mockUseHomeConfig = useHomeConfig as ReturnType<typeof vi.fn>
const mockFetchFeaturedProjects = fetchFeaturedProjects as ReturnType<typeof vi.fn>
const mockFetchProjects = fetchProjects as ReturnType<typeof vi.fn>

const DEFAULT_HOME = { name: '', role: '', description: '', contactEmail: '', status: {type: 'online' as const}, profileImageUrl: '', bannerImageUrl: '', heroButtons: [] }

function makeProject(id: string, name: string, pinned = false) {
  return { id, _id: id, name, pinned, releasedDate: '2024-01-01', languages: ['TypeScript'], imageUrl: '' }
}

function renderPage() {
  mockUseHomeConfig.mockReturnValue({config: DEFAULT_HOME, loading: false})
  return render(<MemoryRouter><TerminalWorkPage /></MemoryRouter>)
}

describe('TerminalWorkPage', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders pinned projects before non-pinned', async () => {
    mockFetchFeaturedProjects.mockResolvedValue([makeProject('p1', 'Pinned Project', true)])
    mockFetchProjects.mockResolvedValue([makeProject('np1', 'Non-Pinned Project', false)])
    renderPage()
    await waitFor(() => screen.getByText('Pinned Project'))
    const items = screen.getAllByText(/Project/)
    const pinnedIdx = items.findIndex(el => el.textContent === 'Pinned Project')
    const nonPinnedIdx = items.findIndex(el => el.textContent === 'Non-Pinned Project')
    expect(pinnedIdx).toBeLessThan(nonPinnedIdx)
  })

  it('does not show a pinned project in the non-pinned section', async () => {
    const pinned = makeProject('dup', 'Duplicate', true)
    mockFetchFeaturedProjects.mockResolvedValue([pinned])
    mockFetchProjects.mockResolvedValue([makeProject('dup', 'Duplicate', false), makeProject('other', 'Other Project', false)])
    renderPage()
    await waitFor(() => screen.getByText('Duplicate'))
    expect(screen.getAllByText('Duplicate').length).toBe(1)
  })

  it('shows at most 5 items initially', async () => {
    mockFetchFeaturedProjects.mockResolvedValue([makeProject('p1', 'Pinned 1', true), makeProject('p2', 'Pinned 2', true)])
    mockFetchProjects.mockResolvedValue([
      makeProject('np1', 'Non 1'), makeProject('np2', 'Non 2'), makeProject('np3', 'Non 3'),
      makeProject('np4', 'Non 4'), makeProject('np5', 'Non 5'),
    ])
    renderPage()
    await waitFor(() => screen.getByText('Pinned 1'))
    const allItems = screen.getAllByText(/Pinned \d|Non \d/)
    expect(allItems.length).toBe(5)
  })

  it('shows show-more button when more projects exist', async () => {
    mockFetchFeaturedProjects.mockResolvedValue([])
    mockFetchProjects.mockResolvedValue([
      makeProject('p1', 'Proj 1'), makeProject('p2', 'Proj 2'), makeProject('p3', 'Proj 3'),
      makeProject('p4', 'Proj 4'), makeProject('p5', 'Proj 5'),
    ])
    renderPage()
    await waitFor(() => expect(screen.getByRole('button', {name: /show more/i})).toBeInTheDocument())
  })

  it('clicking show-more triggers fetchProjects with page 2', async () => {
    mockFetchFeaturedProjects.mockResolvedValue([])
    mockFetchProjects.mockResolvedValueOnce([
      makeProject('p1', 'Proj 1'), makeProject('p2', 'Proj 2'), makeProject('p3', 'Proj 3'),
      makeProject('p4', 'Proj 4'), makeProject('p5', 'Proj 5'),
    ]).mockResolvedValueOnce([makeProject('p6', 'Proj 6')])
    renderPage()
    await waitFor(() => screen.getByRole('button', {name: /show more/i}))
    fireEvent.click(screen.getByRole('button', {name: /show more/i}))
    await waitFor(() => expect(mockFetchProjects).toHaveBeenCalledWith(2, 5))
  })
})
