import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import TerminalAboutPage from '../TerminalAboutPage'

// The shared test-setup.ts mocks IntersectionObserver as a plain vi.fn(), which
// framer-motion's `whileInView`/`viewport` props cannot invoke as a constructor
// (`new IntersectionObserver()` throws "not a constructor"). This is a pre-existing,
// already-flagged issue affecting ~70 tests repo-wide (see issue 002 notes) — it is
// not something this ticket is scoped to fix globally. To keep this file's own
// assertions meaningful (rather than failing on an unrelated environment error),
// we override with a real class locally, scoped to this file only.
class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver

vi.mock('@/hooks/use-home-config', () => ({
  useAboutConfig: vi.fn(),
  useHomeConfig: vi.fn(),
}))
vi.mock('@/app/api/experience', () => ({
  fetchExperiences: vi.fn(),
}))
vi.mock('@/app/_components/readPage/readingPage', () => ({
  MarkDownComponent: ({markdown}: {markdown: string}) => <div data-testid="markdown">{markdown}</div>,
}))

import {useAboutConfig, useHomeConfig} from '@/hooks/use-home-config'
import {fetchExperiences} from '@/app/api/experience'

const mockUseAboutConfig = useAboutConfig as ReturnType<typeof vi.fn>
const mockUseHomeConfig = useHomeConfig as ReturnType<typeof vi.fn>
const mockFetchExperiences = fetchExperiences as ReturnType<typeof vi.fn>

const DEFAULT_HOME = { name: '', role: '', description: '', contactEmail: '', status: {type: 'online' as const}, profileImageUrl: '', bannerImageUrl: '', heroButtons: [] }
const DEFAULT_ABOUT = { aboutTitle: '', lastUpdatedAt: '', location: '', profileImageUrl: '', aboutButtons: [], professionalSummary: '', technicalSkills: [], coreCompetencies: [], bioTagline: '', bioBody: '' }

const makeExps = (n: number) => Array.from({length: n}, (_, i) => ({
  id: `exp-${i}`,
  position: `Position ${i}`,
  companyName: `Company ${i}`,
  jobType: 'Remote',
  durationStart: '2022-01-01',
  durationEnd: null,
  pageMd: `## Detail ${i}\n\nContent for ${i}`,
}))

function renderPage() {
  mockUseHomeConfig.mockReturnValue({config: DEFAULT_HOME, loading: false})
  mockUseAboutConfig.mockReturnValue({config: DEFAULT_ABOUT, loading: false})
  return render(<MemoryRouter><TerminalAboutPage /></MemoryRouter>)
}

describe('TerminalAboutPage — journey section', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders 5 rows initially', async () => {
    mockFetchExperiences.mockResolvedValue(makeExps(5))
    renderPage()
    await waitFor(() => expect(screen.getAllByText(/Position \d/).length).toBe(5))
  })

  it('shows show-more button when 5 rows loaded', async () => {
    mockFetchExperiences.mockResolvedValue(makeExps(5))
    renderPage()
    await waitFor(() => expect(screen.getByRole('button', {name: /show more/i})).toBeInTheDocument())
  })

  it('clicking show-more calls fetchExperiences(20)', async () => {
    mockFetchExperiences.mockResolvedValueOnce(makeExps(5)).mockResolvedValueOnce(makeExps(20))
    renderPage()
    await waitFor(() => screen.getByRole('button', {name: /show more/i}))
    fireEvent.click(screen.getByRole('button', {name: /show more/i}))
    expect(mockFetchExperiences).toHaveBeenCalledWith(20)
  })

  it('clicking a row expands its pageMd content', async () => {
    mockFetchExperiences.mockResolvedValue(makeExps(5))
    renderPage()
    await waitFor(() => screen.getByText('Position 1'))
    fireEvent.click(screen.getByText('Position 1').closest('.exp-row')!)
    expect(screen.getByText(/Content for 1/)).toBeInTheDocument()
  })

  it('clicking the same row again collapses it', async () => {
    mockFetchExperiences.mockResolvedValue(makeExps(5))
    renderPage()
    await waitFor(() => screen.getByText('Position 1'))
    const row = screen.getByText('Position 1').closest('.exp-row')!
    fireEvent.click(row)
    expect(screen.getByText(/Content for 1/)).toBeInTheDocument()
    fireEvent.click(row)
    expect(screen.queryByText(/Content for 1/)).not.toBeInTheDocument()
  })

  it('clicking a different row collapses the first', async () => {
    mockFetchExperiences.mockResolvedValue(makeExps(5))
    renderPage()
    await waitFor(() => screen.getByText('Position 0'))
    fireEvent.click(screen.getByText('Position 0').closest('.exp-row')!)
    expect(screen.getByText(/Content for 0/)).toBeInTheDocument()
    fireEvent.click(screen.getByText('Position 1').closest('.exp-row')!)
    expect(screen.queryByText(/Content for 0/)).not.toBeInTheDocument()
    expect(screen.getByText(/Content for 1/)).toBeInTheDocument()
  })
})

describe('TerminalAboutPage — journey section under VITE_HOME_LAYOUT flag', () => {
  beforeEach(() => { vi.clearAllMocks() })
  afterEach(() => { vi.unstubAllEnvs() })

  it('omits the journey section when VITE_HOME_LAYOUT is "single"', async () => {
    vi.stubEnv('VITE_HOME_LAYOUT', 'single')
    mockFetchExperiences.mockResolvedValue(makeExps(5))
    renderPage()
    await waitFor(() => expect(mockFetchExperiences).not.toHaveBeenCalled())
    expect(screen.queryByText('journey')).not.toBeInTheDocument()
    expect(screen.queryByText(/Position \d/)).not.toBeInTheDocument()
  })

  it('renders the journey section when VITE_HOME_LAYOUT is "multi"', async () => {
    vi.stubEnv('VITE_HOME_LAYOUT', 'multi')
    mockFetchExperiences.mockResolvedValue(makeExps(5))
    renderPage()
    expect(screen.getByText('journey')).toBeInTheDocument()
    await waitFor(() => expect(screen.getAllByText(/Position \d/).length).toBe(5))
  })

  it('renders the journey section when VITE_HOME_LAYOUT is unset', async () => {
    mockFetchExperiences.mockResolvedValue(makeExps(5))
    renderPage()
    expect(screen.getByText('journey')).toBeInTheDocument()
    await waitFor(() => expect(screen.getAllByText(/Position \d/).length).toBe(5))
  })
})
