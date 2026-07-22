import {render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import TerminalAboutPage from '../TerminalAboutPage'

// See terminalAboutJourney.test.tsx for context: the shared IntersectionObserver
// mock in test-setup.ts isn't a valid constructor for framer-motion's `whileInView`,
// which throws and fails every test in files that render this component (pre-existing,
// out of scope for this ticket). Scoped local fix so this file's own assertions hold.
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
  fetchExperiences: vi.fn().mockResolvedValue([]),
}))
vi.mock('@/app/_components/readPage/readingPage', () => ({
  MarkDownComponent: ({markdown}: {markdown: string}) => <div>{markdown}</div>,
}))

import {useAboutConfig, useHomeConfig} from '@/hooks/use-home-config'

const mockUseAboutConfig = useAboutConfig as ReturnType<typeof vi.fn>
const mockUseHomeConfig = useHomeConfig as ReturnType<typeof vi.fn>

const DEFAULT_HOME = { name: '', role: '', description: '', contactEmail: '', status: {type: 'online' as const}, profileImageUrl: '', bannerImageUrl: '', heroButtons: [] }
const BASE_ABOUT = {
  aboutTitle: '', lastUpdatedAt: '', location: '', profileImageUrl: '',
  aboutButtons: [], professionalSummary: 'My summary', technicalSkills: [], coreCompetencies: [],
  bioTagline: 'My tagline here', bioBody: 'My bio body text',
}

const RICH_ABOUT = {
  ...BASE_ABOUT,
  offTheClock: [{icon: 'mdi:bike', label: 'Cycling', description: 'Weekend rides'}],
  technicalSkills: [{category: 'Languages', items: ['TypeScript', 'Go']}],
}

function renderPage() {
  mockUseHomeConfig.mockReturnValue({config: DEFAULT_HOME, loading: false})
  mockUseAboutConfig.mockReturnValue({config: BASE_ABOUT, loading: false})
  return render(<MemoryRouter><TerminalAboutPage /></MemoryRouter>)
}

describe('TerminalAboutPage', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders bioTagline in .lead paragraph', () => {
    renderPage()
    expect(screen.getByText('My tagline here')).toBeInTheDocument()
  })

  it('renders bioBody content', () => {
    renderPage()
    expect(screen.getByText('My bio body text')).toBeInTheDocument()
  })

  it('renders professionalSummary in .plede position', () => {
    renderPage()
    expect(screen.getByText('My summary')).toBeInTheDocument()
  })

  it('renders bioTagline independently from professionalSummary', () => {
    mockUseHomeConfig.mockReturnValue({config: DEFAULT_HOME, loading: false})
    mockUseAboutConfig.mockReturnValue({config: {...BASE_ABOUT, bioTagline: 'Unique tagline', professionalSummary: 'Unique summary'}, loading: false})
    render(<MemoryRouter><TerminalAboutPage /></MemoryRouter>)
    expect(screen.getByText('Unique tagline')).toBeInTheDocument()
    expect(screen.getByText('Unique summary')).toBeInTheDocument()
  })
})

describe('TerminalAboutPage — bio/off_the_clock/skills unaffected by VITE_HOME_LAYOUT flag', () => {
  beforeEach(() => { vi.clearAllMocks() })
  afterEach(() => { vi.unstubAllEnvs() })

  it('still renders bio, off_the_clock, and skills sections when the flag is "single"', () => {
    vi.stubEnv('VITE_HOME_LAYOUT', 'single')
    mockUseHomeConfig.mockReturnValue({config: DEFAULT_HOME, loading: false})
    mockUseAboutConfig.mockReturnValue({config: RICH_ABOUT, loading: false})
    render(<MemoryRouter><TerminalAboutPage /></MemoryRouter>)

    expect(screen.getByText('My tagline here')).toBeInTheDocument()
    expect(screen.getByText('My bio body text')).toBeInTheDocument()
    expect(screen.getByText('off_the_clock')).toBeInTheDocument()
    expect(screen.getByText('Cycling')).toBeInTheDocument()
    expect(screen.getByText('skills')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders section numbers 01 (off_the_clock) and 02 (skills) with no gap when journey is omitted', () => {
    vi.stubEnv('VITE_HOME_LAYOUT', 'single')
    mockUseHomeConfig.mockReturnValue({config: DEFAULT_HOME, loading: false})
    mockUseAboutConfig.mockReturnValue({config: RICH_ABOUT, loading: false})
    render(<MemoryRouter><TerminalAboutPage /></MemoryRouter>)

    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.queryByText('03')).not.toBeInTheDocument()
    expect(screen.queryByText('journey')).not.toBeInTheDocument()
  })
})
