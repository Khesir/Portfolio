/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState, useEffect} from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import {TerminalLayout} from './TerminalLayout'
import {MarkDownComponent, ImageLightbox} from '@/app/_components/readPage/readingPage'
import {TerminalContactSection} from '../home/TerminalContactSection'
import {fetchProjectsByID, fetchProjects} from '@/app/api/projects'
import {fetchEngagement, trackView, toggleHeart} from '@/app/api/cms'
import '../../../css/terminal-article.css'

function fmtDate(iso: string): string {
	const d = new Date(iso)
	return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function slugify(text: string): string {
	return (text ?? '').replace(/\s+/g, '-')
}

interface EngagementState {
	views: number
	hearts: number
	hearted: boolean
}

export default function ProjectReadPage() {
	const [searchParams] = useSearchParams()
	const id = searchParams.get('id') ?? ''

	const [data, setData] = useState<any>(null)
	const [error, setError] = useState<string | null>(null)
	const [projects, setProjects] = useState<any[]>([])
	const [engagement, setEngagement] = useState<EngagementState | null>(null)
	const [lightbox, setLightbox] = useState<string | null>(null)

	useEffect(() => {
		if (!id) {
			setError('Missing ID')
			return
		}
		fetchProjectsByID(id)
			.then(res => {
				if (!res) {setError('Not found'); return}
				setData(res)
			})
			.catch(() => setError('Failed to load content'))
		trackView('project', id)
		fetchEngagement('project', id).then(setEngagement)
		fetchProjects().then(list => setProjects(Array.isArray(list) ? list : []))
	}, [id])

	if (error) {
		return (
			<TerminalLayout>
				<p style={{fontFamily: 'var(--mono)', color: 'var(--ink-3)', marginTop: '40px'}}>
					error: {error}
				</p>
			</TerminalLayout>
		)
	}

	if (!data) {
		return (
			<TerminalLayout>
				<p style={{fontFamily: 'var(--mono)', color: 'var(--ink-3)', marginTop: '40px'}}>
					loading...
				</p>
			</TerminalLayout>
		)
	}

	const markdown: string = data.markdown ?? ''
	const languages: string[] = data.languages ?? []

	const sorted = [...projects].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
	const idx = sorted.findIndex(p => (p._id ?? p.id) === id)
	const prev = idx > 0 ? sorted[idx - 1] : null
	const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null

	function handleHeart() {
		if (!id) return
		toggleHeart('project', id).then(res => {
			setEngagement(prev => (prev ? {...prev, hearts: res.hearts, hearted: res.hearted} : prev))
		})
	}

	const slug = slugify(data.name ?? '')

	return (
		<TerminalLayout>
			<Link to="/work" className="backlink">
				<span className="ar">←</span> back to /work
			</Link>

			<div className="ahead">
				<div className="crumb">
					<b>aj@khesir</b>:~$ git show <span className="seg">{slug}</span>
				</div>
				<h1 className="atitle">{data.name}</h1>
				<div className="ameta">
					{data.releasedDate && (
						<span className="mi">
							<svg viewBox="0 0 24 24">
								<rect x="3" y="4" width="18" height="18" rx="2" />
								<line x1="3" y1="9" x2="21" y2="9" />
								<line x1="8" y1="2" x2="8" y2="6" />
								<line x1="16" y1="2" x2="16" y2="6" />
							</svg>
							{fmtDate(data.releasedDate)}
						</span>
					)}
					{data.minRead && (
						<>
							<span className="mdiv" />
							<span className="mi">
								<svg viewBox="0 0 24 24">
									<circle cx="12" cy="12" r="9" />
									<polyline points="12 7 12 12 15 15" />
								</svg>
								{data.minRead} min read
							</span>
						</>
					)}
					{engagement && (
						<>
							<span className="mdiv" />
							<span className="mi">
								<svg viewBox="0 0 24 24">
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
									<circle cx="12" cy="12" r="3" />
								</svg>
								{engagement.views}
							</span>
							<span className="mdiv" />
							<span className="mi heart">
								<svg viewBox="0 0 24 24">
									<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
								</svg>
								{engagement.hearts}
							</span>
						</>
					)}
				</div>
				{languages.length > 0 && (
					<div className="atags">
						{languages.map((l, i) => (
							<span className="tag" key={i}>{l}</span>
						))}
					</div>
				)}
			</div>

			{data.imageUrl && (
				<div className="ahero" onClick={() => setLightbox(data.imageUrl)}>
					<img src={data.imageUrl} alt={data.name} />
				</div>
			)}

			<div className="alayout">
				<div className="article">
					{markdown ? (
						<MarkDownComponent markdown={markdown} />
					) : (
						<p style={{fontFamily: 'var(--mono)', color: 'var(--ink-3)'}}>
							Content coming soon.
						</p>
					)}

					<div className="anext">
						{prev ? (
							<Link
								className="pv"
								to={`/work/view/${slugify(prev.name)}?id=${prev._id ?? prev.id}`}
							>
								<span className="dir">← previous</span>
								<span className="ttl">{prev.name}</span>
							</Link>
						) : (
							<span />
						)}
						{next ? (
							<Link
								className="nx"
								to={`/work/view/${slugify(next.name)}?id=${next._id ?? next.id}`}
							>
								<span className="dir">next →</span>
								<span className="ttl">{next.name}</span>
							</Link>
						) : (
							<span />
						)}
					</div>
				</div>

				<aside className="aside-tools">
					{(data.url || data.deployment) && (
						<div className="pmeta-card">
							<h4>repository</h4>
							<div className="links">
								{data.url && (
									<a href={data.url} target="_blank" rel="noopener noreferrer">
										<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
										source code
										<span className="ar">↗</span>
									</a>
								)}
								{data.deployment && (
									<a href={data.deployment} target="_blank" rel="noopener noreferrer">
										<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
										live demo
										<span className="ar">↗</span>
									</a>
								)}
							</div>
						</div>
					)}
					{languages.length > 0 && (
						<div className="pmeta-card">
							<h4>stack</h4>
							<div className="atags" style={{marginTop: '4px'}}>
								{languages.map((l, i) => <span className="tag" key={i}>{l}</span>)}
							</div>
						</div>
					)}
					{data.releasedDate && (
						<div className="pmeta-card">
							<h4>released</h4>
							<span style={{fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--ink-2)'}}>{fmtDate(data.releasedDate)}</span>
						</div>
					)}
					<button className="htbtn" onClick={handleHeart}>
						<svg viewBox="0 0 24 24">
							<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
						</svg>
						<span className="c">{engagement?.hearts ?? 0}</span>
					</button>
				</aside>
			</div>

			<TerminalContactSection />
			{lightbox && <ImageLightbox src={lightbox} onClose={() => setLightbox(null)} />}
		</TerminalLayout>
	)
}
