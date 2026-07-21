import {getFeaturedProjects, getProjects, type Project} from '@/data/projects';
import {getCategoryFilters} from '@/data/categories';
import {useState, useRef, useEffect, type ReactNode} from 'react';
import {useNavigate} from 'react-router-dom';
import '@/css/terminal-dashboard.css';

const MIN_COLUMN_COUNT = 2;
const MAX_COLUMN_COUNT_NORMAL = 3;
const MAX_COLUMN_COUNT_FULLSCREEN = 5;
const MIN_COLUMN_WIDTH = 260;
const COLUMN_GAP = 12;

function StarIcon() {
	return (
		<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
			<path
				d="M8 1.5l1.9 3.98 4.35.64-3.15 3.11.74 4.37L8 11.5l-3.84 2.1.74-4.37-3.15-3.11 4.35-.64L8 1.5z"
				fill="currentColor"
			/>
		</svg>
	);
}

function StackIcon() {
	return (
		<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
			<path
				d="M8 1.5l6.5 3.5L8 8.5 1.5 5 8 1.5z"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.3"
				strokeLinejoin="round"
			/>
			<path
				d="M1.5 8l6.5 3.5L14.5 8"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.3"
				strokeLinejoin="round"
			/>
			<path
				d="M1.5 11l6.5 3.5L14.5 11"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.3"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function ProjectCard({p, navigate}: {p: Project; navigate: ReturnType<typeof useNavigate>}) {
	const thumb = p.images?.[0] ?? '';
	const hasMultipleImages = (p.images?.length ?? 0) > 1;

	return (
		<div
			className={`dash-work-card${p.pinned ? ' feat' : ''}`}
			onClick={() => navigate(`/work/view/${p.name.replace(/\s+/g, '-')}?id=${p.id}`)}
		>
			<div className="dash-work-thumb">
				{p.pinned && (
					<span className="dash-work-pin-badge">
						<StarIcon />
						Favorite
					</span>
				)}
				{hasMultipleImages && (
					<span className="dash-work-multi-badge">
						<StackIcon />
						{p.images.length}
					</span>
				)}
				{thumb ? <img src={thumb} alt={p.name} /> : null}
			</div>
			<div className="dash-work-body">
				<div className="dash-work-title-row">
					<h3 className="dash-work-title">{p.name}</h3>
					{p.role && <span className="dash-work-role-pill">{p.role}</span>}
				</div>
				<p className="dash-work-desc">{p.description}</p>
				<div className="dash-work-tags">
					{p.tags.map((t, i) => (
						<span className="tag" key={i}>{t}</span>
					))}
				</div>
				<span className="dash-work-year">{p.year}</span>
			</div>
		</div>
	);
}

interface DashboardWorkGridProps {
	headerControls?: ReactNode;
	isFullscreen?: boolean;
}

export default function DashboardWorkGrid({headerControls, isFullscreen = false}: DashboardWorkGridProps) {
	const [activeCategory, setActiveCategory] = useState<string>('all');
	const navigate = useNavigate();
	const categoryFilters = getCategoryFilters();
	const gridRef = useRef<HTMLDivElement>(null);
	const [columnCount, setColumnCount] = useState(MIN_COLUMN_COUNT);

	useEffect(() => {
		const el = gridRef.current;
		if (!el) return;

		const maxColumns = isFullscreen ? MAX_COLUMN_COUNT_FULLSCREEN : MAX_COLUMN_COUNT_NORMAL;
		const observer = new ResizeObserver((entries) => {
			const width = entries[0]?.contentRect.width ?? el.clientWidth;
			const fitCount = Math.floor((width + COLUMN_GAP) / (MIN_COLUMN_WIDTH + COLUMN_GAP));
			setColumnCount(Math.min(maxColumns, Math.max(MIN_COLUMN_COUNT, fitCount)));
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [isFullscreen]);

	const pinnedItems = getFeaturedProjects();
	const pinnedIds = new Set(pinnedItems.map((p) => p.id));
	const deduplicatedNonPinned = getProjects().filter((p) => !pinnedIds.has(p.id));
	const allItems = [...pinnedItems, ...deduplicatedNonPinned];
	const filteredItems =
		activeCategory === 'all' ? allItems : allItems.filter((p) => p.category === activeCategory);

	const columns: Project[][] = Array.from({length: columnCount}, () => []);
	filteredItems.forEach((p, i) => {
		columns[i % columnCount].push(p);
	});

	return (
		<div className="dash-work-slot">
			<div className="dash-work-rhead">
				<div className="dash-work-head">
					<h2>Work</h2>
					<span className="dash-work-count">{filteredItems.length}</span>
				</div>
				<div className="dash-work-controls">
					<div className="dash-work-filters">
						{categoryFilters.map((f) => (
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
					{headerControls}
				</div>
			</div>
			<div className="dash-work-grid" ref={gridRef}>
				{columns.map((col, i) => (
					<div className="dash-work-col" key={i}>
						{col.map((p) => (
							<ProjectCard key={p.id} p={p} navigate={navigate} />
						))}
					</div>
				))}
			</div>
		</div>
	);
}
