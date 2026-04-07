/* eslint-disable @typescript-eslint/no-explicit-any */
import {fetchProjects} from '@/app/api/projects';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {dateParser} from '@/lib/utils';
import {useState, useEffect, useRef, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowUpRight, Github, Calendar} from 'lucide-react';
import {motion} from 'framer-motion';
import {useEnvironment} from '@/hooks/use-environment-store';

const PAGE_SIZE = 6;

const containerVariants = {
	initial: {},
	animate: {transition: {staggerChildren: 0.08}},
};

const cardVariants = {
	initial: {opacity: 0, y: 30},
	animate: {opacity: 1, y: 0, transition: {duration: 0.4}},
};

export function ProjectList() {
	const [allProjects, setAllProjects] = useState<any[]>([]);
	const [displayed, setDisplayed] = useState<any[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [res, setRes] = useState(null);
	const [loading, setLoading] = useState(false);
	const sentinelRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const {refreshKey} = useEnvironment();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const data = await fetchProjects();
				const list = Array.isArray(data) ? data : [];
				setAllProjects(list);
				setDisplayed(list.slice(0, PAGE_SIZE));
				setPage(1);
				setHasMore(list.length > PAGE_SIZE);
			} catch (e: any) {
				setRes(e.toString());
				setAllProjects([]);
				setDisplayed([]);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [refreshKey]);

	const loadMore = useCallback(() => {
		const nextPage = page + 1;
		const next = allProjects.slice(0, nextPage * PAGE_SIZE);
		setDisplayed(next);
		setPage(nextPage);
		setHasMore(next.length < allProjects.length);
	}, [page, allProjects]);

	useEffect(() => {
		const el = sentinelRef.current;
		if (!el || !hasMore) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) loadMore();
			},
			{threshold: 0.1},
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [hasMore, loadMore]);

	if (res) {
		return (
			<motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
				className="bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all"
				onClick={() => window.location.reload()}
			>
				<div className="flex items-start gap-4">
					<div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
						<ArrowUpRight className="w-6 h-6 text-red-600 dark:text-red-400 animate-pulse" />
					</div>
					<div className="flex-1">
						<h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Failed to Load Projects</h3>
						<div className="text-xs text-red-600 dark:text-red-400 font-mono bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-3 break-all">Error: {res}</div>
						<p className="text-sm text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
							<span>Click to retry</span><ArrowUpRight className="w-4 h-4" />
						</p>
					</div>
				</div>
			</motion.div>
		);
	}

	if (loading || !displayed) {
		return (
			<div className="flex flex-col gap-4">
				<motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md overflow-hidden">
							<Skeleton className="h-[200px] w-full bg-slate-300 dark:bg-slate-700" />
							<div className="p-5 space-y-3">
								<Skeleton className="h-6 w-3/4 bg-slate-300 dark:bg-slate-700" />
								<Skeleton className="h-4 w-1/2 bg-slate-300 dark:bg-slate-700" />
								<div className="flex gap-2">
									<Skeleton className="h-6 w-16 rounded-full bg-slate-300 dark:bg-slate-700" />
									<Skeleton className="h-6 w-16 rounded-full bg-slate-300 dark:bg-slate-700" />
								</div>
							</div>
						</div>
					))}
				</motion.div>
				<p className="text-center text-sm text-slate-400 dark:text-slate-500">
					Fetching for the first time — subsequent visits load instantly from cache.
				</p>
			</div>
		);
	}

	if (displayed.length === 0 && !loading) {
		return (
			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 text-center">
				<p className="text-slate-600 dark:text-slate-400">No projects available yet</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
		<motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{displayed.map((d: any, i) => {
				const id = d._id ?? d.id;
				const name = d.name ?? 'Untitled';
				const languages: string[] = d.languages ?? [];

				return (
					<motion.div
						key={i}
						variants={cardVariants}
						className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02]"
						onClick={() => navigate(`/projects/view/${name.replace(/\s+/g, '-')}?id=${id}`)}
					>
						<div className="relative h-[200px] overflow-hidden bg-slate-100 dark:bg-slate-800">
							<img
								src={d.imageUrl || '/img/profile3.jpg'}
								alt={name}
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

							<div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								{d.url && (
									<a href={d.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
										className="p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all shadow-lg">
										<Github className="w-4 h-4" />
									</a>
								)}
								{d.deployment && (
									<a href={d.deployment} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
										className="p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all shadow-lg">
										<ArrowUpRight className="w-4 h-4" />
									</a>
								)}
							</div>
						</div>

						<div className="p-5 space-y-3">
							<h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
								{name}
							</h3>

							<div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
								<Calendar className="w-4 h-4" />
								<span>{d.releasedDate ? dateParser(d.releasedDate) : 'In Progress'}</span>
							</div>

							<div className="flex flex-wrap gap-1.5">
								{languages.slice(0, 3).map((lang, index) => (
									<Badge key={index} variant="secondary" className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
										{lang}
									</Badge>
								))}
								{languages.length > 3 && (
									<Badge variant="secondary" className="px-2 py-0.5 text-xs">+{languages.length - 3}</Badge>
								)}
							</div>
						</div>
					</motion.div>
				);
			})}
		</motion.div>
		{hasMore && <div ref={sentinelRef} className="h-10" />}
		{!hasMore && displayed.length > 0 && (
			<p className="text-center text-sm text-slate-400 dark:text-slate-500 pb-2">
				All {allProjects.length} projects loaded
			</p>
		)}
		</div>
	);
}
