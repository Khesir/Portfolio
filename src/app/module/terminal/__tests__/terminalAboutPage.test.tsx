import {render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {describe, it, expect, vi, beforeEach} from 'vitest'
import TerminalAboutPage from '../TerminalAboutPage'

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
