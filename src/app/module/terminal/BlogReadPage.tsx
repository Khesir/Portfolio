/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState, useEffect} from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import {TerminalLayout} from './TerminalLayout'
import {MarkDownComponent} from '@/app/_components/readPage/readingPage'
import {TerminalContactSection} from '../home/terminalContactSection'
import {fetchBlogsByID, fetchBlogs} from '@/app/api/blogs'
import {fetchEngagement, trackView, toggleHeart} from '@/app/api/cms'
import '../../../css/terminal-article.css'

function fmtDate(iso: string): string {
	const d = new Date(iso)
	return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function slugify(text: string): string {
	return (text ?? '').replace(/\s+/g, '-')
}

function extractHeadings(md: string) {
	return md
		.split('\n')
		.filter(l => /^#{2,3}\s/.test(l))
		.map(l => {
			const level = l.startsWith('### ') ? 3 : 2
			const text = l.replace(/^#{2,3}\s/, '')
			const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
			return {level, text, id}
		})
}

interface EngagementState {
	views: number
	hearts: number
	hearted: boolean
}

export default function BlogReadPage() {
	const [searchParams] = useSearchParams()
	const id = searchParams.get('id') ?? ''

	const [data, setData] = useState<any>(null)
	const [error, setError] = useState<string | null>(null)
	const [blogs, setBlogs] = useState<any[]>([])
	const [engagement, setEngagement] = useState<EngagementState | null>(null)

	useEffect(() => {
		if (!id) {
			setError('Missing ID')
			return
		}
		fetchBlogsByID(id)
			.then(res => {
				if (!res) {setError('Not found'); return}
				setData(res)
			})
			.catch(() => setError('Failed to load content'))
		trackView('blog', id)
		fetchEngagement('blog', id).then(setEngagement)
		fetchBlogs().then(list => setBlogs(Array.isArray(list) ? list : []))
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
	const tags: string[] = data.tags ?? []
	const headings = extractHeadings(markdown)

	const idx = blogs.findIndex(b => (b._id ?? b.id) === id)
	const prev = idx > 0 ? blogs[idx - 1] : null
	const next = idx >= 0 && idx < blogs.length - 1 ? blogs[idx + 1] : null

	function handleHeart() {
		if (!id) return
		toggleHeart('blog', id).then(res => {
			setEngagement(prev => (prev ? {...prev, hearts: res.hearts, hearted: res.hearted} : prev))
		})
	}

	const slug = slugify(data.name ?? '')

	return (
		<TerminalLayout>
			<Link to="/blogs" className="backlink">
				<span className="ar">←</span> back to /blog
			</Link>

			<div className="ahead">
				<div className="crumb">
					<b>aj@khesir</b>:~$ cat ./blog/<span className="seg">{slug}.md</span>
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
				{tags.length > 0 && (
					<div className="atags">
						{tags.map((t, i) => (
							<span className="tag" key={i}>{t}</span>
						))}
					</div>
				)}
			</div>

			{data.imageUrl && (
				<div className="ahero">
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
								to={`/blogs/view/${slugify(prev.name)}?id=${prev._id ?? prev.id}`}
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
								to={`/blogs/view/${slugify(next.name)}?id=${next._id ?? next.id}`}
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
					<button className="htbtn" onClick={handleHeart}>
						<svg viewBox="0 0 24 24">
							<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
						</svg>
						<span className="c">{engagement?.hearts ?? 0}</span>
					</button>
					{headings.length > 0 && (
						<div className="toc">
							{headings.map((h, i) => (
								<a
									key={i}
									href={`#${h.id}`}
									style={{
										display: 'block',
										color: h.level === 2 ? 'var(--ink-3)' : 'var(--ink-4)',
										marginBottom: '8px',
										opacity: h.level === 3 ? 0.7 : 1,
									}}
								>
									{h.text}
								</a>
							))}
						</div>
					)}
				</aside>
			</div>

			<TerminalContactSection />
		</TerminalLayout>
	)
}
