import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {describe, it, expect, vi, beforeEach} from 'vitest'
import TerminalBlogPage from '../TerminalBlogPage'

vi.mock('@/hooks/use-home-config', () => ({
  useHomeConfig: vi.fn(),
}))
vi.mock('@/app/api/blogs', () => ({
  fetchBlogs: vi.fn(),
}))

import {useHomeConfig} from '@/hooks/use-home-config'
import {fetchBlogs} from '@/app/api/blogs'

const mockUseHomeConfig = useHomeConfig as ReturnType<typeof vi.fn>
const mockFetchBlogs = fetchBlogs as ReturnType<typeof vi.fn>

const DEFAULT_HOME = { name: '', role: '', description: '', contactEmail: '', status: {type: 'online' as const}, profileImageUrl: '', bannerImageUrl: '', heroButtons: [] }

function makeBlogs(n: number) {
  return Array.from({length: n}, (_, i) => ({
    id: `blog-${i}`,
    _id: `blog-${i}`,
    name: `Blog Post ${i}`,
    releasedDate: `2024-${String(i + 1).padStart(2, '0')}-01`,
    tags: ['tag'],
    minRead: 3,
  }))
}

function renderPage() {
  mockUseHomeConfig.mockReturnValue({config: DEFAULT_HOME, loading: false})
  return render(<MemoryRouter><TerminalBlogPage /></MemoryRouter>)
}

describe('TerminalBlogPage show-more', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders only 5 posts initially when more exist', async () => {
    mockFetchBlogs.mockResolvedValue(makeBlogs(8))
    renderPage()
    await waitFor(() => screen.getByText('Blog Post 0'))
    // 1 featured + 4 in list = 5 posts visible
    expect(screen.getAllByText(/Blog Post \d/).length).toBe(5)
  })

  it('shows show-more button when more posts exist', async () => {
    mockFetchBlogs.mockResolvedValue(makeBlogs(8))
    renderPage()
    await waitFor(() => expect(screen.getByRole('button', {name: /show more/i})).toBeInTheDocument())
  })

  it('clicking show-more reveals more posts', async () => {
    mockFetchBlogs.mockResolvedValue(makeBlogs(8))
    renderPage()
    await waitFor(() => screen.getByRole('button', {name: /show more/i}))
    fireEvent.click(screen.getByRole('button', {name: /show more/i}))
    await waitFor(() => expect(screen.getAllByText(/Blog Post \d/).length).toBe(8))
  })

  it('hides show-more button when exactly 5 posts exist', async () => {
    mockFetchBlogs.mockResolvedValue(makeBlogs(5))
    renderPage()
    await waitFor(() => screen.getByText('Blog Post 0'))
    expect(screen.queryByRole('button', {name: /show more/i})).not.toBeInTheDocument()
  })

  it('hides show-more button after all posts are revealed', async () => {
    mockFetchBlogs.mockResolvedValue(makeBlogs(7))
    renderPage()
    await waitFor(() => screen.getByRole('button', {name: /show more/i}))
    fireEvent.click(screen.getByRole('button', {name: /show more/i}))
    await waitFor(() => expect(screen.queryByRole('button', {name: /show more/i})).not.toBeInTheDocument())
  })
})
