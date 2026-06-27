import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {fetchProjectsCms, cmsDeleteProject, cmsUpdateProject} from '@/app/api/cms';
import {toast} from 'sonner';

const fmtDate = (iso: string) =>
	new Date(iso).toISOString().split('T')[0].replace(/-/g, '.');

export default function CmsProjects() {
	const navigate = useNavigate();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [projects, setProjects] = useState<any[]>([]);
	const [togglingId, setTogglingId] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState<'all' | 'featured' | 'drafts'>('all');

	useEffect(() => {
		fetchProjectsCms().then(setProjects);
	}, []);

	const handleDelete = async (id: string) => {
		await cmsDeleteProject(id);
		setProjects((prev) => prev.filter((p) => p._id !== id && p.id !== id));
		toast.success('Project deleted');
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleTogglePin = async (project: any) => {
		const id = project._id ?? project.id;
		const nextPinned = !project.pinned;
		setTogglingId(id);
		try {
			await cmsUpdateProject(id, {pinned: nextPinned});
			setProjects((prev) =>
				prev.map((p) =>
					p._id === id || p.id === id ? {...p, pinned: nextPinned} : p,
				),
			);
			toast.success(
				nextPinned
					? 'Project featured on homepage'
					: 'Project removed from featured',
			);
		} catch {
			toast.error('Failed to update project');
		} finally {
			setTogglingId(null);
		}
	};

	const filteredProjects = projects
		.filter((p) =>
			filter === 'all'
				? true
				: filter === 'featured'
					? p.pinned
					: p.draft,
		)
		.filter(
			(p) =>
				!search ||
				(p.name ?? '').toLowerCase().includes(search.toLowerCase()),
		);

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
					onClick={() => navigate('/cms/projects/new')}
				>
					+ New Project
				</button>
			</div>
			<div className="cms-toolbar">
				<div className="cms-search">
					<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.6}>
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
					<div className="lrow" key={p.id ?? p._id}>
						<div>
							<div className="lname">
								{p.name}
								{p.pinned && <span className="cbadge feat">featured</span>}
								{p.draft && <span className="cbadge draft">draft</span>}
							</div>
						</div>
						<div className="ldate">
							{p.releasedDate ? fmtDate(p.releasedDate) : '—'}
						</div>
						<div className="lacts">
							<button
								className={`feat${p.pinned ? ' on' : ''}`}
								disabled={togglingId === (p.id ?? p._id)}
								onClick={() => handleTogglePin(p)}
							>
								<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.6}>
									<path d="M12 17v5M9 3h6l-1 7 3 3H7l3-3z" />
								</svg>
								{p.pinned ? 'Featured' : 'Feature'}
							</button>
							<Link
								className="edit"
								to={`/cms/projects/${p.id ?? p._id}/edit`}
							>
								Edit
							</Link>
							<button
								className="del"
								onClick={() => handleDelete(p.id ?? p._id)}
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
