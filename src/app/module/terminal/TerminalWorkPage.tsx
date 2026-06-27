/* eslint-disable @typescript-eslint/no-explicit-any */
import { TerminalLayout } from './TerminalLayout'
import { TerminalContactSection } from '../home/terminalContactSection'
import { fetchFeaturedProjects, fetchProjects } from '@/app/api/projects'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function TerminalWorkPage() {
  const [featured, setFeatured] = useState<any | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchFeaturedProjects().then((list: any[]) => {
      const pinned = list.filter((p: any) => p.pinned)
      setFeatured(pinned[0] ?? null)
    })
    fetchProjects().then((list: any[]) => setProjects(Array.isArray(list) ? list : []))
  }, [])

  return (
    <TerminalLayout>
      <section className="phead">
        <div className="crumb"><b>aj@khesir</b>:~$ git log --oneline</div>
        <h1 className="ptitle">Things I&apos;ve <em>built</em>.</h1>
        <p className="plede">Software, tools and experiments — mostly where engineering and craft meet. A few favorites below.</p>
      </section>

      <div className="sl"><span className="n">01</span><h2>featured</h2><span className="rule" /></div>
      {featured ? (
        <section
          className="feature"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/projects/view/${(featured.name ?? '').replace(/\s+/g, '-')}?id=${featured._id ?? featured.id}`)}
        >
          {featured.imageUrl
            ? <div className="fimg"><img src={featured.imageUrl} alt={featured.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
            : <div className="fimg ph"><span className="ph-label">project cover</span></div>
          }
          <div className="fbody">
            <div className="pt" style={{ display: 'flex', gap: '12px', alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span className="yr" style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>
                {featured.releasedDate ? new Date(featured.releasedDate).getFullYear() : ''}
              </span>
            </div>
            <h3>{featured.name}</h3>
            <div className="ptags">
              {(featured.languages ?? []).map((l: string, i: number) => <span className="tag" key={i}>{l}</span>)}
            </div>
          </div>
        </section>
      ) : (
        <section className="feature" style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--ink-3)' }}>No featured project yet.</p>
        </section>
      )}

      <div className="sl">
        <span className="n">02</span>
        <h2>all_projects</h2>
        <span className="rule" />
        {projects.length > 0 && <span className="more">{projects.length} repos</span>}
      </div>
      <section className="projs">
        {projects.map((p, i) => {
          const id = p._id ?? p.id
          const name = p.name ?? 'Untitled'
          const year = p.releasedDate ? new Date(p.releasedDate).getFullYear() : ''
          const languages: string[] = p.languages ?? []
          return (
            <div
              className="proj"
              key={id}
              onClick={() => navigate(`/projects/view/${name.replace(/\s+/g, '-')}?id=${id}`)}
            >
              <span className="idx">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div className="pt"><h4>{name}</h4></div>
                <div className="ptags">
                  {languages.map((l, j) => <span className="tag" key={j}>{l}</span>)}
                </div>
              </div>
              <span className="yr">{year}</span>
            </div>
          )
        })}
        {projects.length === 0 && (
          <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--ink-3)' }}>No projects yet.</p>
        )}
      </section>

      <TerminalContactSection />
    </TerminalLayout>
  )
}
