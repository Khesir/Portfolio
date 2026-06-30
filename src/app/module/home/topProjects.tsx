/* eslint-disable @typescript-eslint/no-explicit-any */
import {fetchFeaturedProjects} from '@/app/api/projects';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {dateParser} from '@/lib/utils';
import {useState, useEffect, useRef} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ArrowUpRight, Github, RefreshCw, ExternalLink} from 'lucide-react';
import {toast} from 'sonner';
import {useEnvironment} from '@/hooks/use-environment-store';

const CARD_POPOVER_STYLES = `
.tp-pop {
  position: fixed; top: 0; left: 0; z-index: 9999; width: 280px;
  pointer-events: none; opacity: 0; transform: translateY(8px) scale(.97);
  transition: opacity .16s ease, transform .16s ease;
  border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,.12);
  background: #0e0d13; box-shadow: 0 20px 60px rgba(0,0,0,.5);
}
.tp-pop.show { opacity: 1; transform: translateY(0) scale(1); }
.tp-pop .tp-bar { height: 28px; display: flex; align-items: center; gap: 6px; padding: 0 10px; background: #16151d; border-bottom: 1px solid rgba(255,255,255,.07); }
.tp-pop .tp-bar i { width: 8px; height: 8px; border-radius: 999px; display: block; }
.tp-pop .tp-img { aspect-ratio: 16/9; position: relative; overflow: hidden;
  background: repeating-linear-gradient(135deg, rgba(255,255,255,.02) 0 12px, transparent 12px 24px); }
.tp-pop .tp-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.tp-pop .tp-yr { position: absolute; top: 8px; right: 8px; font-size: 10px; color: rgba(255,255,255,.7); background: rgba(14,13,19,.7); border: 1px solid rgba(255,255,255,.12); padding: 2px 7px; border-radius: 999px; font-family: monospace; }
.tp-pop .tp-body { padding: 12px 13px 13px; }
.tp-pop .tp-title { font-size: 14px; font-weight: 700; color: #fff; margin: 0 0 6px; line-height: 1.2; }
.tp-pop .tp-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.tp-pop .tp-tag { font-size: 10px; padding: 2px 7px; border-radius: 999px; background: rgba(255,255,255,.08); color: rgba(255,255,255,.6); }
@media (max-width: 760px) { .tp-pop { display: none; } }
`

export function TopProjects() {
	const [projects, setProjects] = useState<any[]>([]);
	const [res, setRes] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const {refreshKey} = useEnvironment();
	const popRef = useRef<HTMLDivElement>(null);

	const fetchData = async () => {
		setRes(null);
		setLoading(true);
		try {
			const data = await fetchFeaturedProjects();
			const list = Array.isArray(data) ? data : [];
			setProjects(list.filter((p: any) => p.pinned == true));
		} catch (e: any) {
			toast.error(e instanceof Error ? e.message : String(e));
			setRes(e.toString());
			setProjects([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [refreshKey]);

	useEffect(() => {
		const pop = popRef.current;
		if (!pop) return;
		const elImg = pop.querySelector<HTMLDivElement>('.tp-img');
		const elYr = pop.querySelector<HTMLSpanElement>('.tp-yr');
		const elTitle = pop.querySelector<HTMLParagraphElement>('.tp-title');
		const elTags = pop.querySelector<HTMLDivElement>('.tp-tags');
		const cards = document.querySelectorAll<HTMLElement>('.tp-card[data-title]');
		const GAP = 16;
		let active: HTMLElement | null = null;

		function fill(el: HTMLElement) {
			const imgUrl = el.dataset.img || '';
			if (elImg) elImg.innerHTML = imgUrl
				? `<img src="${imgUrl}" alt="preview" /><span class="tp-yr">${el.dataset.year || ''}</span>`
				: `<span class="tp-yr">${el.dataset.year || ''}</span>`;
			if (elYr) elYr.textContent = el.dataset.year || '';
			if (elTitle) elTitle.textContent = el.dataset.title || '';
			if (elTags) elTags.innerHTML = (el.dataset.tags || '').split(',').filter(Boolean)
				.map(t => `<span class="tp-tag">${t.trim()}</span>`).join('');
		}

		function place(x: number, y: number) {
			const w = pop.offsetWidth, h = pop.offsetHeight;
			let left = x + GAP, top = y - h / 2;
			if (left + w > window.innerWidth - 12) left = x - GAP - w;
			if (left < 12) left = 12;
			top = Math.max(12, Math.min(top, window.innerHeight - h - 12));
			pop.style.left = left + 'px';
			pop.style.top = top + 'px';
		}

		const handlers: Array<{el: HTMLElement; type: string; fn: EventListener}> = [];

		cards.forEach(card => {
			const enter: EventListener = (e) => {
				active = card;
				fill(card);
				place((e as MouseEvent).clientX, (e as MouseEvent).clientY);
				pop.classList.add('show');
			};
			const move: EventListener = (e) => {
				if (active === card) place((e as MouseEvent).clientX, (e as MouseEvent).clientY);
			};
			const leave: EventListener = () => {
				if (active === card) {
					active = null;
					pop.classList.remove('show');
				}
			};
			card.addEventListener('mouseenter', enter);
			card.addEventListener('mousemove', move);
			card.addEventListener('mouseleave', leave);
			handlers.push({el: card, type: 'mouseenter', fn: enter});
			handlers.push({el: card, type: 'mousemove', fn: move});
			handlers.push({el: card, type: 'mouseleave', fn: leave});
		});

		return () => {
			handlers.forEach(({el, type, fn}) => el.removeEventListener(type, fn));
			pop.classList.remove('show');
		};
	}, [projects]);

	const Header = () => (
		<div className="flex justify-between items-center">
			<Link to={'/work'} className="group">
				<h2 className="font-bold text-3xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
					Featured Projects
				</h2>
			</Link>
			<Link
				to={'/work'}
				className="font-semibold text-sm hover:underline text-blue-600 dark:text-blue-400 flex items-center gap-1 group"
			>
				View all
				<ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
			</Link>
		</div>
	);

	if (res) {
		return (
			<div className="flex flex-col w-full gap-6 mb-10">
				<Header />
				<div
					className="bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all"
					onClick={() => fetchData()}
				>
					<div className="flex items-start gap-4">
						<div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
							<RefreshCw className="w-6 h-6 text-red-600 dark:text-red-400 animate-pulse" />
						</div>
						<div className="flex-1">
							<h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
								Failed to Load Projects
							</h3>
							<p className="text-xs text-red-600 dark:text-red-400 font-mono bg-red-50 dark:bg-red-900/20 p-2 rounded-lg mt-2 break-all">
								{res}
							</p>
							<p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-3 flex items-center gap-1">
								Click to retry <ArrowUpRight className="w-4 h-4" />
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="flex flex-col w-full gap-4 mb-10">
				<Header />
				<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<Skeleton
							key={i}
							className="h-52 rounded-xl bg-slate-200 dark:bg-slate-700"
						/>
					))}
				</div>
			</div>
		);
	}

	if (projects.length === 0) {
		return (
			<div className="flex flex-col w-full gap-6 mb-10">
				<Header />
				<div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center">
					<Github className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
					<h3 className="font-bold text-lg text-slate-900 dark:text-white">
						No Projects Yet
					</h3>
					<p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
						Pin projects in the CMS to feature them here.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full gap-4 mb-10">
			<style>{CARD_POPOVER_STYLES}</style>
			<Header />
			<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
				{projects.map((project: any) => {
					const id = project._id ?? project.id;
					const name = project.name ?? 'Untitled';
					const imageUrl = project.imageUrl || '/img/profile3.jpg';
					const githubUrl = project.url;
					const deployUrl = project.deployment;
					const releasedDate = project.releasedDate;
					const languages: string[] = project.languages ?? [];
					const year = releasedDate ? new Date(releasedDate).getFullYear().toString() : '';

					return (
						<div
							key={id}
							className="tp-card relative h-52 rounded-xl overflow-hidden cursor-pointer group border border-slate-200 dark:border-slate-700"
							data-title={name}
							data-img={imageUrl}
							data-year={year}
							data-tags={languages.join(',')}
							onClick={() =>
								navigate(`/work/view/${name.replace(/\s+/g, '-')}?id=${id}`)
							}
						>
							<img
								src={imageUrl}
								alt={name}
								className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

							<div className="absolute bottom-0 left-0 right-0 p-3 space-y-1.5">
								<p className="text-white font-bold text-base leading-tight">
									{name}
								</p>
								<div className="flex flex-wrap gap-1">
									{languages.slice(0, 3).map((lang, idx) => (
										<Badge
											key={idx}
											className="text-xs px-2 py-0.5 bg-white/15 text-white border-0 backdrop-blur-sm"
										>
											{lang}
										</Badge>
									))}
									{languages.length > 3 && (
										<Badge className="text-xs px-2 py-0.5 bg-white/15 text-white border-0 backdrop-blur-sm">
											+{languages.length - 3}
										</Badge>
									)}
								</div>
							</div>

							<div className="absolute top-2 left-2">
								<span className="text-xs text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
									{releasedDate ? dateParser(releasedDate) : 'In progress'}
								</span>
							</div>

							<div
								className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
								onClick={(e) => e.stopPropagation()}
							>
								{githubUrl && (
									<a
										href={githubUrl}
										target="_blank"
										rel="noreferrer"
										className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
									>
										<Github className="w-4 h-4" />
									</a>
								)}
								{deployUrl && (
									<a
										href={deployUrl}
										target="_blank"
										rel="noreferrer"
										className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
									>
										<ExternalLink className="w-4 h-4" />
									</a>
								)}
							</div>
						</div>
					);
				})}
			</div>

			<div className="tp-pop" ref={popRef}>
				<div className="tp-bar">
					<i style={{background: '#ff5f57'}}></i>
					<i style={{background: '#febc2e'}}></i>
					<i style={{background: '#28c840'}}></i>
				</div>
				<div className="tp-img">
					<span className="tp-yr"></span>
				</div>
				<div className="tp-body">
					<p className="tp-title"></p>
					<div className="tp-tags"></div>
				</div>
			</div>
		</div>
	);
}
