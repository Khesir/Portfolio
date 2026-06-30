/* eslint-disable @typescript-eslint/no-explicit-any */
import {TerminalLayout} from './TerminalLayout'
import {TerminalContactSection} from '../home/terminalContactSection'
import {fetchFeaturedProjects, fetchProjects} from '@/app/api/projects'
import {useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {motion} from 'framer-motion'

const POPOVER_STYLES = `
.pop {
  position: fixed; top: 0; left: 0; z-index: 60; width: 320px;
  pointer-events: none; opacity: 0; transform: translateY(8px) scale(.97);
  transition: opacity .16s ease, transform .16s ease;
  border-radius: 14px; overflow: hidden; border: 1px solid var(--line-2);
  background: #0e0d13; box-shadow: var(--shadow-lg);
}
.pop.show { opacity: 1; transform: translateY(0) scale(1); }
.pop .pop-bar { height: 30px; display: flex; align-items: center; gap: 7px; padding: 0 12px; background: #16151d; border-bottom: 1px solid var(--line); }
.pop .pop-bar i { width: 8px; height: 8px; border-radius: 999px; display: block; }
.pop .pop-bar .t { font-family: var(--mono); font-size: 10.5px; color: var(--ink-4); margin-left: 4px; }
.pop .pop-img { aspect-ratio: 16/9; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden;
  background: repeating-linear-gradient(135deg, rgba(255,255,255,.018) 0 12px, transparent 12px 24px),
  linear-gradient(145deg, rgba(var(--blue-rgb),.16), rgba(var(--plum-rgb),.1)); }
.pop .pop-img #popImg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.pop .pop-img #popImg img { width: 100%; height: 100%; object-fit: cover; }
.pop .pop-img .pl { font-family: var(--mono); font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
.pop .pop-img .yr { position: absolute; top: 10px; right: 10px; font-family: var(--mono); font-size: 10.5px; color: var(--ink-2); background: rgba(14,13,19,.7); border: 1px solid var(--line-2); padding: 3px 8px; border-radius: 999px; }
.pop .pop-body { padding: 14px 15px 15px; }
.pop .pop-role { font-family: var(--mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--blue); }
.pop .pop-h { font-family: var(--serif); font-size: 21px; line-height: 1.05; margin: 5px 0 8px; color: var(--ink); }
.pop .pop-d { font-size: 12.5px; line-height: 1.55; color: var(--ink-2); margin: 0; }
.pop .pop-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 11px; }
.pop .pop-tags .tag { font-size: 10.5px; padding: 3px 8px; }
.pop .pop-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 13px; padding-top: 11px; border-top: 1px solid var(--line); font-family: var(--mono); font-size: 11px; color: var(--ink-4); }
.pop .pop-foot .open { color: var(--accent); }
@media (max-width: 760px) { .pop { display: none; } }
@media (prefers-reduced-motion: reduce) { .pop { transition: opacity .16s ease; transform: none; } .pop.show { transform: none; } }
`

const PAGE_SIZE = 5

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
	hidden: {opacity: 0, y: 20},
	show: {opacity: 1, y: 0, transition: {type: 'spring' as const, stiffness: 80, damping: 18}},
}

function ProjectRow({p, i, navigate}: {p: any; i: number; navigate: ReturnType<typeof useNavigate>}) {
	const id = p._id ?? p.id
	const name = p.name ?? 'Untitled'
	const year = p.releasedDate ? new Date(p.releasedDate).getFullYear() : ''
	const languages: string[] = p.languages ?? []
	const role: string = p.type ?? p.category ?? 'project'
	const desc: string = p.description ?? ''
	const imgUrl: string = p.imageUrl ?? ''
	return (
		<motion.div
			className="proj"
			variants={listItem}
			onClick={() => navigate(`/work/view/${name.replace(/\s+/g, '-')}?id=${id}`)}
			data-title={name}
			data-role={role}
			data-year={year}
			data-desc={desc}
			data-tags={languages.join(',')}
			data-img={imgUrl}
		>
			<span className="idx">{String(i + 1).padStart(2, '0')}</span>
			<div>
				<div className="pt"><h4>{name}</h4></div>
				<div className="ptags">
					{languages.map((l, j) => <span className="tag" key={j}>{l}</span>)}
				</div>
			</div>
			<span className="yr">{year}</span>
		</motion.div>
	)
}

export default function TerminalWorkPage() {
	const [pinnedItems, setPinnedItems] = useState<any[]>([])
	const [pinnedLoaded, setPinnedLoaded] = useState(false)
	const [allNonPinned, setAllNonPinned] = useState<any[]>([])
	const [nonPinnedPage, setNonPinnedPage] = useState(1)
	const [hasMore, setHasMore] = useState(false)
	const [shownCount, setShownCount] = useState(PAGE_SIZE)
	const navigate = useNavigate()

	useEffect(() => {
		fetchFeaturedProjects().then((list: any[]) => {
			setPinnedItems(list.filter((p: any) => p.pinned))
			setPinnedLoaded(true)
		})
		fetchProjects(1, PAGE_SIZE).then((list: any[]) => {
			setAllNonPinned(Array.isArray(list) ? list : [])
			setHasMore((Array.isArray(list) ? list : []).length >= PAGE_SIZE)
		})
	}, [])

	const pinnedIds = new Set(pinnedItems.map((p: any) => p._id ?? p.id))
	const deduplicatedNonPinned = allNonPinned.filter((p: any) => !pinnedIds.has(p._id ?? p.id))

	const visibleNonPinnedCount = Math.max(0, shownCount - pinnedItems.length)
	const visibleNonPinned = deduplicatedNonPinned.slice(0, visibleNonPinnedCount)
	const showMoreButton = hasMore || deduplicatedNonPinned.length > visibleNonPinnedCount

	const loadMore = () => {
		const newShownCount = shownCount + PAGE_SIZE
		setShownCount(newShownCount)
		const nonPinnedNeeded = Math.max(0, newShownCount - pinnedItems.length)
		if (nonPinnedNeeded > deduplicatedNonPinned.length && hasMore) {
			const nextPage = nonPinnedPage + 1
			setNonPinnedPage(nextPage)
			fetchProjects(nextPage, PAGE_SIZE).then((list: any[]) => {
				const newItems = Array.isArray(list) ? list : []
				setAllNonPinned(prev => [...prev, ...newItems.filter((p: any) => !pinnedIds.has(p._id ?? p.id))])
				setHasMore(newItems.length >= PAGE_SIZE)
			})
		}
	}

	useEffect(() => {
		const pop = document.getElementById('projPop')
		if (!pop) return
		const elImg = document.getElementById('popImg') as HTMLElement
		const elYr = document.getElementById('popYr') as HTMLElement
		const elRole = document.getElementById('popRole') as HTMLElement
		const elTitle = document.getElementById('popTitle') as HTMLElement
		const elDesc = document.getElementById('popDesc') as HTMLElement
		const elTags = document.getElementById('popTags') as HTMLElement
		const rows = document.querySelectorAll<HTMLElement>('.proj[data-title]')
		const GAP = 18
		let active: HTMLElement | null = null

		function fill(el: HTMLElement) {
			const imgUrl = el.dataset.img || ''
			elImg.innerHTML = imgUrl ? `<img src="${imgUrl}" alt="preview" />` : '<span class="pl">preview</span>'
			elYr.textContent = el.dataset.year || ''
			elRole.textContent = el.dataset.role || ''
			elTitle.textContent = el.dataset.title || ''
			elDesc.textContent = el.dataset.desc || ''
			elTags.innerHTML = (el.dataset.tags || '').split(',').filter(Boolean)
				.map(t => `<span class="tag">${t.trim()}</span>`).join('')
		}

		function place(x: number, y: number) {
			const w = pop.offsetWidth, h = pop.offsetHeight
			let left = x + GAP, top = y - h / 2
			if (left + w > window.innerWidth - 12) left = x - GAP - w
			if (left < 12) left = 12
			top = Math.max(12, Math.min(top, window.innerHeight - h - 12))
			pop.style.left = left + 'px'
			pop.style.top = top + 'px'
		}

		const handlers: Array<{el: HTMLElement; type: string; fn: EventListener}> = []

		rows.forEach(row => {
			const enter: EventListener = (e) => {
				active = row
				fill(row)
				place((e as MouseEvent).clientX, (e as MouseEvent).clientY)
				pop.classList.add('show')
				pop.setAttribute('aria-hidden', 'false')
			}
			const move: EventListener = (e) => {
				if (active === row) place((e as MouseEvent).clientX, (e as MouseEvent).clientY)
			}
			const leave: EventListener = () => {
				if (active === row) {
					active = null
					pop.classList.remove('show')
					pop.setAttribute('aria-hidden', 'true')
				}
			}
			row.addEventListener('mouseenter', enter)
			row.addEventListener('mousemove', move)
			row.addEventListener('mouseleave', leave)
			handlers.push({el: row, type: 'mouseenter', fn: enter})
			handlers.push({el: row, type: 'mousemove', fn: move})
			handlers.push({el: row, type: 'mouseleave', fn: leave})
		})

		return () => {
			handlers.forEach(({el, type, fn}) => el.removeEventListener(type, fn))
			pop.classList.remove('show')
		}
	}, [pinnedItems, allNonPinned, shownCount])

	return (
		<TerminalLayout>
			<style>{POPOVER_STYLES}</style>

			<motion.section
				className="phead"
				variants={headContainer}
				initial="hidden"
				animate="show"
			>
				<motion.div variants={headItem} className="crumb"><b>aj@khesir</b>:~$ git log --oneline</motion.div>
				<motion.h1 variants={headItem} className="ptitle">Things I&apos;ve <em>built</em>.</motion.h1>
				<motion.p variants={headItem} className="plede">Software, tools and experiments — mostly where engineering and craft meet. A few favorites below.</motion.p>
			</motion.section>

			<div className="sl"><span className="n">01</span><h2>pinned</h2><span className="rule" /></div>
			<motion.section
				className="projs"
				key={pinnedItems.length}
				variants={listContainer}
				initial="hidden"
				whileInView="show"
				viewport={{once: true, amount: 0.1}}
			>
				{pinnedItems.map((p, i) => <ProjectRow key={p._id ?? p.id} p={p} i={i} navigate={navigate} />)}
				{pinnedLoaded && pinnedItems.length === 0 && (
					<p style={{fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--ink-3)'}}>No pinned projects.</p>
				)}
			</motion.section>

			<div className="sl">
				<span className="n">02</span>
				<h2>all_projects</h2>
				<span className="rule" />
			</div>
			<motion.section
				className="projs"
				key={visibleNonPinned.length}
				variants={listContainer}
				initial="hidden"
				whileInView="show"
				viewport={{once: true, amount: 0.1}}
			>
				{visibleNonPinned.map((p, i) => <ProjectRow key={p._id ?? p.id} p={p} i={i} navigate={navigate} />)}
				{visibleNonPinned.length === 0 && pinnedItems.length > 0 && (
					<p style={{fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--ink-3)'}}>No more projects.</p>
				)}
			</motion.section>
			{showMoreButton && (
				<button
					className="show-more"
					style={{fontFamily: 'var(--mono)', fontSize: '13px', cursor: 'pointer', marginTop: '12px'}}
					onClick={loadMore}
				>
					show more
				</button>
			)}

			<TerminalContactSection />

			<div className="pop" id="projPop" aria-hidden="true">
				<div className="pop-bar">
					<i style={{background: '#ff5f57'}}></i>
					<i style={{background: '#febc2e'}}></i>
					<i style={{background: '#28c840'}}></i>
					<span className="t">preview</span>
				</div>
				<div className="pop-img">
					<div id="popImg"><span className="pl">preview</span></div>
					<span className="yr" id="popYr">2025</span>
				</div>
				<div className="pop-body">
					<div className="pop-role" id="popRole">role</div>
					<h4 className="pop-h" id="popTitle">Title</h4>
					<p className="pop-d" id="popDesc">Description</p>
					<div className="pop-tags" id="popTags"></div>
					<div className="pop-foot"><span>./work</span><span className="open">open ↵</span></div>
				</div>
			</div>
		</TerminalLayout>
	)
}
