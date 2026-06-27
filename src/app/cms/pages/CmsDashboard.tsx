import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {fetchBlogs} from '@/app/api/blogs';
import {fetchProjects} from '@/app/api/projects';
import {fetchExperiences} from '@/app/api/experience';
import axios from 'axios';
import {
	fetchAnalytics,
	fetchBlogEngagementSummary,
	AnalyticsData,
	BlogEngagementSummary,
} from '@/app/api/cms';

const API = import.meta.env.VITE_API_URL;

interface ContentStat {
	label: string;
	count: number | null;
	href: string;
	icon: React.ReactNode;
}

const FileSvg = () => (
	<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.6}>
		<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
		<polyline points="14 2 14 8 20 8" />
	</svg>
);

const CodeSvg = () => (
	<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.6}>
		<polyline points="16 18 22 12 16 6" />
		<polyline points="8 6 2 12 8 18" />
	</svg>
);

const BriefcaseSvg = () => (
	<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.6}>
		<rect x="2" y="7" width="20" height="14" rx="2" />
		<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
	</svg>
);

const ListSvg = () => (
	<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.6}>
		<line x1="8" y1="6" x2="21" y2="6" />
		<line x1="8" y1="12" x2="21" y2="12" />
		<line x1="8" y1="18" x2="21" y2="18" />
		<line x1="3" y1="6" x2="3.01" y2="6" />
		<line x1="3" y1="12" x2="3.01" y2="12" />
		<line x1="3" y1="18" x2="3.01" y2="18" />
	</svg>
);

const UsersSvg = () => (
	<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.6}>
		<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
		<circle cx="9" cy="7" r="4" />
		<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
		<path d="M16 3.13a4 4 0 0 1 0 7.75" />
	</svg>
);

const TrendingSvg = () => (
	<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.6}>
		<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
		<polyline points="17 6 23 6 23 12" />
	</svg>
);

const EyeSvg = () => (
	<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.6}>
		<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
		<circle cx="12" cy="12" r="3" />
	</svg>
);

const HeartSvg = () => (
	<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.6}>
		<path d="M12 21s-7.5-4.6-10-9.3C.4 8.4 2 5 5.2 5c2 0 3.3 1.1 4.1 2.3l1.4 2 1.4-2C12.9 6.1 14.2 5 16.2 5 19.4 5 21 8.4 19.5 11.7 17 16.4 12 21 12 21Z" />
	</svg>
);

export default function CmsDashboard() {
	const [contentStats, setContentStats] = useState<ContentStat[]>([
		{label: 'Blogs', count: null, href: '/cms/blogs', icon: <FileSvg />},
		{label: 'Projects', count: null, href: '/cms/projects', icon: <CodeSvg />},
		{label: 'Experiences', count: null, href: '/cms/experiences', icon: <BriefcaseSvg />},
		{label: 'Progress', count: null, href: '/cms/progress', icon: <ListSvg />},
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
					icon: <FileSvg />,
				},
				{
					label: 'Projects',
					count: projects.status === 'fulfilled' ? (projects.value as unknown[]).length : 0,
					href: '/cms/projects',
					icon: <CodeSvg />,
				},
				{
					label: 'Experiences',
					count: experiences.status === 'fulfilled' ? (experiences.value as unknown[]).length : 0,
					href: '/cms/experiences',
					icon: <BriefcaseSvg />,
				},
				{
					label: 'Progress',
					count:
						progress.status === 'fulfilled'
							? (progress.value.data?.data?.result?.results ?? []).length
							: 0,
					href: '/cms/progress',
					icon: <ListSvg />,
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

	const maxVisits = analytics
		? Math.max(...analytics.chart.map((pt) => pt.visits), 1)
		: 1;

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">Dashboard</h1>
					<div className="sub">aj@khesir:~$ ./cms --status · all systems nominal</div>
				</div>
				<span className="cms-now">
					<span className="dot" /> production · synced just now
				</span>
			</div>

			<section className="cms-sec">
				<div className="slabel">Site traffic</div>
				<div className="cms-stats">
					<div className="cms-stat">
						<div className="ic blue">
							<UsersSvg />
						</div>
						<div>
							<div className="lab">Total visits</div>
							<div className="val">
								{analyticsLoading ? '—' : (analytics?.totalVisits.toLocaleString() ?? '—')}
							</div>
						</div>
					</div>

					<div className="cms-stat">
						<div className="ic green">
							<TrendingSvg />
						</div>
						<div>
							<div className="lab">Today</div>
							<div className="val">
								{analyticsLoading ? '—' : (analytics?.todayVisits ?? '—')}
							</div>
						</div>
					</div>

					<div className="cms-stat chart">
						<div className="lab">Last 7 days</div>
						{!analyticsLoading && analytics?.chart && (
							<div className="cms-chart">
								{analytics.chart.map((pt, i) => (
									<div className="col" key={i}>
										<b style={{height: `${Math.round((pt.visits / maxVisits) * 100)}%`}} />
										<span>
											{new Date(pt.date)
												.toLocaleDateString('en', {weekday: 'short'})
												.slice(0, 3)}
										</span>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</section>

			<section className="cms-sec">
				<div className="slabel">Content</div>
				<div className="cms-counts">
					{contentStats.map(({label, count, href, icon}) => (
						<Link className="cms-count" to={href} key={label}>
							<div className="ch">
								{icon} {label}
							</div>
							<div className="cn">{contentLoading ? '—' : count}</div>
							<div className="cm">Manage →</div>
						</Link>
					))}
				</div>
			</section>

			<section className="cms-sec">
				<div className="slabel-row">
					<div className="slabel" style={{margin: 0}}>Latest blogs</div>
					<Link to="/cms/blogs">View all →</Link>
				</div>
				<div className="cms-table">
					{!blogsLoading &&
						latestBlogs.map((b) => (
							<div className="cms-row" key={b.id}>
								<div>
									<div className="rt">{b.title}</div>
									<div className="rd">{b.publishedAt}</div>
								</div>
								<div className="rmeta">
									<span className="st live">live</span>
									<span className="e">
										<EyeSvg /> {b.views}
									</span>
									<span className="e heart">
										<HeartSvg /> {b.hearts}
									</span>
								</div>
							</div>
						))}
				</div>
			</section>
		</>
	);
}
