import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import type {Project} from '@/data/projects';
import {fetchLocalSection, saveLocalSection} from '@/app/api/cms-local';
import {toast} from 'sonner';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

const IS_DEV = import.meta.env.DEV;

/** Falls back to Jan 1 of `year` for projects saved before releasedDate existed. */
function sortKey(p: Project): string {
	return p.releasedDate ?? `${p.year}-01-01`;
}

export default function CmsProjects() {
	const navigate = useNavigate();
	const [projects, setProjects] = useState<Project[]>([]);
	const [togglingId, setTogglingId] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState<'all' | 'featured' | 'drafts'>('all');

	useEffect(() => {
		fetchLocalSection<Project[]>('projects').then(setProjects);
	}, []);

	const persist = async (next: Project[]) => {
		setProjects(next);
		await saveLocalSection('projects', next);
	};

	const handleDelete = async (id: string) => {
		try {
			await persist(projects.filter((p) => p.id !== id));
			toast.success('Project deleted');
		} catch {
			toast.error('Failed to delete project');
		}
	};

	const handleTogglePin = async (project: Project) => {
		setTogglingId(project.id);
		try {
			await persist(
				projects.map((p) =>
					p.id === project.id ? {...p, pinned: !p.pinned} : p,
				),
			);
			toast.success(
				project.pinned
					? 'Project removed from featured'
					: 'Project featured on homepage',
			);
		} catch {
			toast.error('Failed to update project');
		} finally {
			setTogglingId(null);
		}
	};

	const filteredProjects = projects
		.filter((p) =>
			filter === 'all' ? true : filter === 'featured' ? p.pinned : p.draft,
		)
		.filter(
			(p) => !search || p.name.toLowerCase().includes(search.toLowerCase()),
		)
		.sort((a, b) => sortKey(b).localeCompare(sortKey(a)));

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">Projects</h1>
					<div className="sub">
						aj@khesir:~$ ls ./projects · {projects.length} entries
					</div>
				</div>
				<button
					className="btn-new"
					disabled={!IS_DEV}
					onClick={() => navigate('/cms/projects/new')}
				>
					+ New Project
				</button>
			</div>
			<LocalOnlyNotice />
			<div className="cms-toolbar">
				<div className="cms-search">
					<svg
						viewBox="0 0 24 24"
						stroke="currentColor"
						fill="none"
						strokeWidth={1.6}
					>
						<circle cx="11" cy="11" r="7" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
					<input
						type="text"
						placeholder="search projects…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="cms-filter">
					<button
						className={filter === 'all' ? 'on' : ''}
						onClick={() => setFilter('all')}
					>
						All
					</button>
					<button
						className={filter === 'featured' ? 'on' : ''}
						onClick={() => setFilter('featured')}
					>
						Featured
					</button>
					<button
						className={filter === 'drafts' ? 'on' : ''}
						onClick={() => setFilter('drafts')}
					>
						Drafts
					</button>
				</div>
			</div>
			<div className="cms-table">
				<div className="cms-listhead">
					<span>Title</span>
					<span>Released</span>
					<span className="r" />
				</div>
				{filteredProjects.map((p) => (
					<div className="lrow" key={p.id}>
						<div>
							<div className="lname">
								{p.name}
								{p.pinned && <span className="cbadge feat">featured</span>}
								{p.draft && <span className="cbadge draft">draft</span>}
							</div>
						</div>
						<div className="ldate">{p.releasedDate ?? p.year}</div>
						<div className="lacts">
							<button
								className={`feat${p.pinned ? ' on' : ''}`}
								disabled={!IS_DEV || togglingId === p.id}
								onClick={() => handleTogglePin(p)}
							>
								<svg
									viewBox="0 0 24 24"
									stroke="currentColor"
									fill="none"
									strokeWidth={1.6}
								>
									<path d="M12 17v5M9 3h6l-1 7 3 3H7l3-3z" />
								</svg>
								{p.pinned ? 'Featured' : 'Feature'}
							</button>
							<Link className="edit" to={`/cms/projects/${p.id}/edit`}>
								Edit
							</Link>
							<button
								className="del"
								disabled={!IS_DEV}
								onClick={() => handleDelete(p.id)}
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
