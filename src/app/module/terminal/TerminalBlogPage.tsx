import {TerminalLayout} from './TerminalLayout'
import {TerminalContactSection} from '../home/terminalContactSection'
import {fetchBlogs} from '@/app/api/blogs'
import {useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {motion} from 'framer-motion'

function fmtDate(iso: string): string {
	const d = new Date(iso)
	return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

const headContainer = {
	hidden: {},
	show: {transition: {staggerChildren: 0.1, delayChildren: 0.05}},
}
const headItem = {
	hidden: {opacity: 0, y: 18},
	show: {opacity: 1, y: 0, transition: {type: 'spring' as const, stiffness: 80, damping: 18}},
}
const listContainer = {
	hidden: {},
	show: {transition: {staggerChildren: 0.08}},
}
const listItem = {
	hidden: {opacity: 0, x: -18},
	show: {opacity: 1, x: 0, transition: {type: 'spring' as const, stiffness: 80, damping: 18}},
}

export default function TerminalBlogPage() {
	const [blogs, setBlogs] = useState<any[]>([])
	const [visibleCount, setVisibleCount] = useState(5)
	const navigate = useNavigate()

	useEffect(() => {
		fetchBlogs().then((list: any) => setBlogs(Array.isArray(list) ? list : []))
	}, [])

	const latest = blogs[0] ?? null
	const rest = blogs.slice(1, visibleCount)

	return (
		<TerminalLayout>
			<motion.section
				className="phead"
				variants={headContainer}
				initial="hidden"
				animate="show"
			>
				<motion.div variants={headItem} className="crumb"><b>aj@khesir</b>:~$ ls ./blog</motion.div>
				<motion.h1 variants={headItem} className="ptitle">The <em>blog</em>.</motion.h1>
				<motion.p variants={headItem} className="plede">Notes on building software and the tools around it — APIs, automation, full-stack and the occasional lesson learned the hard way.</motion.p>
			</motion.section>

			<div className="sl"><span className="n">01</span><h2>latest</h2><span className="rule" /></div>
			<motion.div
				key={latest?._id ?? latest?.id ?? 'empty'}
				initial={{opacity: 0, y: 28}}
				whileInView={{opacity: 1, y: 0}}
				viewport={{once: true, amount: 0.2}}
				transition={{type: 'spring', stiffness: 75, damping: 18}}
			>
				{latest ? (
					<div
						className="feature"
						style={{cursor: 'pointer', textDecoration: 'none', color: 'inherit'}}
						onClick={() => navigate(`/blogs/view/${(latest.name ?? '').replace(/\s+/g, '-')}?id=${latest._id ?? latest.id}`)}
					>
						{latest.imageUrl
							? <div className="fimg"><img src={latest.imageUrl} alt={latest.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
							: <div className="fimg ph"><span className="ph-label">cover · 16:9</span></div>
						}
						<div className="fbody">
							<div className="pt">
								{(latest.tags ?? [])[0] && (
									<span className="pr">{latest.tags[0]}</span>
								)}
								<span className="yr">
									{latest.releasedDate ? fmtDate(latest.releasedDate) : ''}
									{latest.minRead ? ` · ${latest.minRead} min` : ''}
								</span>
							</div>
							<h3>{latest.name}</h3>
							<div className="ptags">
								{(latest.tags ?? []).map((t: string, i: number) => <span className="tag" key={i}>{t}</span>)}
							</div>
						</div>
					</div>
				) : (
					<div className="feature fimg ph">
						<p className="ph-label">No posts yet.</p>
					</div>
				)}
			</motion.div>

			<div className="sl">
				<span className="n">02</span>
				<h2>all_posts</h2>
				<span className="rule" />
				{blogs.length > 0 && <span className="more">{blogs.length} posts</span>}
			</div>
			<motion.section
				className="posts"
				key={rest.length}
				variants={listContainer}
				initial="hidden"
				whileInView="show"
				viewport={{once: true, amount: 0.1}}
			>
				{rest.map((b) => {
					const id = b._id ?? b.id
					const name = b.name ?? 'Untitled'
					const tags: string[] = b.tags ?? []
					return (
						<motion.div
							className="post"
							key={id}
							variants={listItem}
							onClick={() => navigate(`/blogs/view/${name.replace(/\s+/g, '-')}?id=${id}`)}
						>
							<span className="pdate">{b.releasedDate ? fmtDate(b.releasedDate) : '—'}</span>
							<div className="pmain"><h4>{name}</h4></div>
							<div className="pmeta">
								{tags[0] && <span className="pcat">{tags[0]}</span>}
								{b.minRead && <span className="pread">{b.minRead} min</span>}
							</div>
						</motion.div>
					)
				})}
				{blogs.length === 0 && (
					<p style={{fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--ink-3)'}}>No posts yet.</p>
				)}
			</motion.section>

			{blogs.length > visibleCount && (
				<button
					className="show-more"
					style={{fontFamily: 'var(--mono)', fontSize: '13px', cursor: 'pointer', marginTop: '12px'}}
					onClick={() => setVisibleCount(prev => prev + 5)}
				>
					show more
				</button>
			)}

			<TerminalContactSection />
		</TerminalLayout>
	)
}
