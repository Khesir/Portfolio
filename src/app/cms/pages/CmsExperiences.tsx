import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {fetchExperiencesCms, cmsDeleteExperience} from '@/app/api/cms';
import {toast} from 'sonner';

export default function CmsExperiences() {
	const navigate = useNavigate();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [experiences, setExperiences] = useState<any[]>([]);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState<'all' | 'current' | 'drafts'>('all');

	useEffect(() => {
		fetchExperiencesCms().then(setExperiences);
	}, []);

	const handleDelete = async (id: string) => {
		await cmsDeleteExperience(id);
		setExperiences((prev) => prev.filter((e) => e._id !== id && e.id !== id));
		toast.success('Experience deleted');
	};

	const filteredExperiences = experiences
		.filter((e) =>
			filter === 'all'
				? true
				: filter === 'current'
					? !e.durationEnd
					: e.draft,
		)
		.filter(
			(e) =>
				!search ||
				(e.position ?? '').toLowerCase().includes(search.toLowerCase()),
		);

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">Experiences</h1>
					<div className="sub">
						aj@khesir:~$ ls ./experiences · {experiences.length} entries
					</div>
				</div>
				<button
					className="btn-new"
					onClick={() => navigate('/cms/experiences/new')}
				>
					+ New Experience
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
						placeholder="search experiences…"
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
						className={filter === 'current' ? 'on' : ''}
						onClick={() => setFilter('current')}
					>
						Current
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
					<span>Position</span>
					<span>Period</span>
					<span className="r" />
				</div>
				{filteredExperiences.map((exp) => (
					<div className="lrow" key={exp.id ?? exp._id}>
						<div>
							<div className="lname">
								{exp.position}
								{!exp.durationEnd && (
									<span className="cbadge feat">current</span>
								)}
								{exp.draft && <span className="cbadge draft">draft</span>}
							</div>
							<div className="lsub">
								{exp.companyName} · {exp.jobType}
							</div>
						</div>
						<div className="ldate">
							{exp.durationStart} — {exp.durationEnd ?? 'now'}
						</div>
						<div className="lacts">
							<Link
								className="edit"
								to={`/cms/experiences/${exp.id ?? exp._id}/edit`}
							>
								Edit
							</Link>
							<button
								className="del"
								onClick={() => handleDelete(exp.id ?? exp._id)}
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
