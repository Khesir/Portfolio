/* eslint-disable @typescript-eslint/no-explicit-any */
import {fetchFeaturedProjects, fetchProjects} from '@/app/api/projects';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import '@/css/terminal-dashboard.css';

const ALL_PROJECTS_PAGE_SIZE = 100;

const CATEGORY_FILTERS: {value: string; label: string}[] = [
	{value: 'all', label: 'All'},
	{value: 'dev', label: 'Dev'},
	{value: 'illustration', label: 'Illustration'},
	{value: 'tech-art', label: 'Tech Art'},
];

const CATEGORY_LABELS: Record<string, string> = {
	dev: 'Dev',
	illustration: 'Illustration',
	'tech-art': 'Tech Art',
};

function ProjectCard({p, navigate}: {p: any; navigate: ReturnType<typeof useNavigate>}) {
	const id = p._id ?? p.id;
	const name = p.name ?? 'Untitled';
	const year = p.releasedDate ? new Date(p.releasedDate).getFullYear() : '';
	const languages: string[] = p.languages ?? [];
	const description: string = p.description ?? '';
	const imageUrl: string = p.imageUrl ?? '';
	const pinned: boolean = Boolean(p.pinned);
	const roleLabel: string | undefined = p.category ? CATEGORY_LABELS[p.category] : undefined;

	return (
		<div
			className="dash-work-card"
			onClick={() => navigate(`/work/view/${name.replace(/\s+/g, '-')}?id=${id}`)}
		>
			{pinned && <span className="dash-work-pinned-badge">PINNED</span>}
			<div className="dash-work-thumb">
				{imageUrl ? <img src={imageUrl} alt={name} /> : null}
			</div>
			<div className="dash-work-body">
				<h3 className="dash-work-title">{name}</h3>
				{roleLabel && <span className="dash-work-role-pill">{roleLabel}</span>}
				<p className="dash-work-desc">{description}</p>
				<div className="dash-work-tags">
					{languages.map((l, i) => (
						<span className="tag" key={i}>{l}</span>
					))}
				</div>
				<span className="dash-work-year">{year}</span>
			</div>
		</div>
	);
}

export default function DashboardWorkGrid() {
	const [pinnedItems, setPinnedItems] = useState<any[]>([]);
	const [allNonPinned, setAllNonPinned] = useState<any[]>([]);
	const [activeCategory, setActiveCategory] = useState<string>('all');
	const navigate = useNavigate();

	useEffect(() => {
		fetchFeaturedProjects().then((list: any[]) => {
			setPinnedItems((Array.isArray(list) ? list : []).filter((p: any) => p.pinned));
		});
		fetchProjects(1, ALL_PROJECTS_PAGE_SIZE).then((list: any[]) => {
			setAllNonPinned(Array.isArray(list) ? list : []);
		});
	}, []);

	const pinnedIds = new Set(pinnedItems.map((p: any) => p._id ?? p.id));
	const deduplicatedNonPinned = allNonPinned.filter((p: any) => !pinnedIds.has(p._id ?? p.id));
	const allItems = [...pinnedItems, ...deduplicatedNonPinned];
	const filteredItems =
		activeCategory === 'all' ? allItems : allItems.filter((p: any) => p.category === activeCategory);

	return (
		<div className="dash-work-slot">
			<div className="dash-work-head">
				<h2>Work</h2>
				<span className="dash-work-count">{filteredItems.length}</span>
			</div>
			<div className="dash-work-filters">
				{CATEGORY_FILTERS.map((f) => (
					<button
						key={f.value}
						type="button"
						className={`dash-work-filter-tab${activeCategory === f.value ? ' active' : ''}`}
						onClick={() => setActiveCategory(f.value)}
					>
						{f.label}
					</button>
				))}
			</div>
			<div className="dash-work-grid">
				{filteredItems.map((p) => (
					<ProjectCard key={p._id ?? p.id} p={p} navigate={navigate} />
				))}
			</div>
		</div>
	);
}
