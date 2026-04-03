import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {fetchBlogs} from '@/app/api/blogs';
import {fetchProjects} from '@/app/api/projects';
import {fetchExperiences} from '@/app/api/experience';
import axios from 'axios';
import {Skeleton} from '@/components/ui/skeleton';
import {Eye, Heart, TrendingUp, Users, FileText, Briefcase, Code, Layers} from 'lucide-react';
import {
	fetchAnalytics,
	fetchBlogEngagementSummary,
	AnalyticsData,
	BlogEngagementSummary,
} from '@/app/api/cms';
import {dateParser} from '@/lib/utils';

const API = import.meta.env.VITE_API_URL;

// --- Mini bar chart ---
function VisitChart({data}: {data: AnalyticsData['chart']}) {
	if (!data.length) return null;
	const max = Math.max(...data.map((d) => d.visits), 1);

	return (
		<div className="flex items-end gap-1 h-16">
			{data.map((d) => {
				const pct = Math.max((d.visits / max) * 100, 4);
				const label = new Date(d.date).toLocaleDateString('en-US', {weekday: 'short'});
				return (
					<div key={d.date} className="flex-1 flex flex-col items-center gap-1 group">
						<div className="relative w-full">
							<div
								className="w-full bg-blue-500 dark:bg-blue-400 rounded-t transition-all group-hover:bg-blue-600 dark:group-hover:bg-blue-300"
								style={{height: `${(pct / 100) * 56}px`}}
							/>
							<div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none">
								{d.visits}
							</div>
						</div>
						<span className="text-[9px] text-slate-400">{label}</span>
					</div>
				);
			})}
		</div>
	);
}

// --- Content count cards ---
interface ContentStat {
	label: string;
	count: number | null;
	href: string;
	icon: React.ReactNode;
}

export default function CmsDashboard() {
	const [contentStats, setContentStats] = useState<ContentStat[]>([
		{label: 'Blogs', count: null, href: '/cms/blogs', icon: <FileText className="w-4 h-4" />},
		{label: 'Projects', count: null, href: '/cms/projects', icon: <Code className="w-4 h-4" />},
		{label: 'Experiences', count: null, href: '/cms/experiences', icon: <Briefcase className="w-4 h-4" />},
		{label: 'Progress', count: null, href: '/cms/progress', icon: <Layers className="w-4 h-4" />},
	]);
	const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
	const [latestBlogs, setLatestBlogs] = useState<BlogEngagementSummary[]>([]);
	const [contentLoading, setContentLoading] = useState(true);
	const [analyticsLoading, setAnalyticsLoading] = useState(true);
	const [blogsLoading, setBlogsLoading] = useState(true);

	useEffect(() => {
		Promise.allSettled([
			fetchBlogs(),
			fetchProjects(),
			fetchExperiences(20),
			axios.get(`${API}/progress`),
		]).then(([blogs, projects, experiences, progress]) => {
			setContentStats([
				{
					label: 'Blogs',
					count: blogs.status === 'fulfilled' ? (blogs.value as unknown[]).length : 0,
					href: '/cms/blogs',
					icon: <FileText className="w-4 h-4" />,
				},
				{
					label: 'Projects',
					count: projects.status === 'fulfilled' ? (projects.value as unknown[]).length : 0,
					href: '/cms/projects',
					icon: <Code className="w-4 h-4" />,
				},
				{
					label: 'Experiences',
					count: experiences.status === 'fulfilled' ? (experiences.value as unknown[]).length : 0,
					href: '/cms/experiences',
					icon: <Briefcase className="w-4 h-4" />,
				},
				{
					label: 'Progress',
					count:
						progress.status === 'fulfilled'
							? (progress.value.data?.data?.result?.results ?? []).length
							: 0,
					href: '/cms/progress',
					icon: <Layers className="w-4 h-4" />,
				},
			]);
			setContentLoading(false);
		});
	}, []);

	useEffect(() => {
		fetchAnalytics()
			.then(setAnalytics)
			.catch(() => {})
			.finally(() => setAnalyticsLoading(false));
	}, []);

	useEffect(() => {
		fetchBlogEngagementSummary()
			.then(setLatestBlogs)
			.catch(() => {})
			.finally(() => setBlogsLoading(false));
	}, []);

	return (
		<div className="space-y-8">
			<h1 className="text-2xl font-semibold">Dashboard</h1>

			{/* Visit Stats */}
			<section className="space-y-3">
				<h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
					Site Traffic
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					{/* Total Visits */}
					<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-center gap-4">
						<div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
							<Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
						</div>
						<div>
							<p className="text-xs text-slate-500 dark:text-slate-400">Total Visits</p>
							{analyticsLoading ? (
								<Skeleton className="h-7 w-20 mt-1" />
							) : (
								<p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
									{analytics?.totalVisits.toLocaleString() ?? '—'}
								</p>
							)}
						</div>
					</div>

					{/* Today */}
					<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-center gap-4">
						<div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
							<TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
						</div>
						<div>
							<p className="text-xs text-slate-500 dark:text-slate-400">Today</p>
							{analyticsLoading ? (
								<Skeleton className="h-7 w-14 mt-1" />
							) : (
								<p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
									{analytics?.todayVisits.toLocaleString() ?? '—'}
								</p>
							)}
						</div>
					</div>

					{/* 7-day chart */}
					<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
						<p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Last 7 days</p>
						{analyticsLoading ? (
							<div className="flex items-end gap-1 h-16">
								{Array.from({length: 7}).map((_, i) => (
									<Skeleton key={i} className="flex-1 rounded-t" style={{height: `${Math.random() * 48 + 8}px`}} />
								))}
							</div>
						) : analytics?.chart ? (
							<VisitChart data={analytics.chart} />
						) : (
							<p className="text-xs text-slate-400">No data</p>
						)}
					</div>
				</div>
			</section>

			{/* Content Counts */}
			<section className="space-y-3">
				<h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
					Content
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					{contentStats.map(({label, count, href, icon}) => (
						<Link key={label} to={href}>
							<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
								<div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
									{icon}
									<span className="text-xs font-medium">{label}</span>
								</div>
								{contentLoading ? (
									<Skeleton className="h-8 w-10" />
								) : (
									<p className="text-3xl font-bold text-slate-900 dark:text-white">{count}</p>
								)}
								<p className="text-xs text-slate-400 mt-1">Manage →</p>
							</div>
						</Link>
					))}
				</div>
			</section>

			{/* Latest Blogs with Engagement */}
			<section className="space-y-3">
				<div className="flex items-center justify-between">
					<h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
						Latest Blogs
					</h2>
					<Link to="/cms/blogs" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
						View all →
					</Link>
				</div>
				<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
					{blogsLoading ? (
						<div className="divide-y divide-slate-100 dark:divide-slate-800">
							{Array.from({length: 5}).map((_, i) => (
								<div key={i} className="flex items-center justify-between px-5 py-3.5 gap-4">
									<Skeleton className="h-4 flex-1 max-w-xs" />
									<Skeleton className="h-4 w-24 shrink-0" />
								</div>
							))}
						</div>
					) : latestBlogs.length === 0 ? (
						<p className="text-sm text-slate-400 px-5 py-4">No blogs yet.</p>
					) : (
						<div className="divide-y divide-slate-100 dark:divide-slate-800">
							{latestBlogs.map((blog) => (
								<div key={blog.id} className="flex items-center justify-between px-5 py-3.5 gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
									<div className="min-w-0">
										<p className="text-sm font-medium text-slate-900 dark:text-white truncate">
											{blog.title}
										</p>
										<p className="text-xs text-slate-400 mt-0.5">
											{dateParser(blog.publishedAt)}
										</p>
									</div>
									<div className="flex items-center gap-4 shrink-0">
										<div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
											<Eye className="w-3.5 h-3.5" />
											<span className="text-xs tabular-nums">{blog.views.toLocaleString()}</span>
										</div>
										<div className="flex items-center gap-1.5 text-red-400">
											<Heart className="w-3.5 h-3.5 fill-current" />
											<span className="text-xs tabular-nums">{blog.hearts.toLocaleString()}</span>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
