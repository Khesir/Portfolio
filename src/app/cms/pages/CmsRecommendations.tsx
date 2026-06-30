import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {
	fetchRecommendationsCms,
	cmsDeleteRecommendation,
	cmsToggleRecommendationFeatured,
} from '@/app/api/cms';
import {toast} from 'sonner';

export default function CmsRecommendations() {
	const navigate = useNavigate();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [recos, setRecos] = useState<any[]>([]);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState<'all' | 'featured' | 'hidden'>('all');

	useEffect(() => {
		fetchRecommendationsCms().then(setRecos);
	}, []);

	const handleDelete = async (id: string) => {
		try {
			await cmsDeleteRecommendation(id);
			setRecos((prev) => prev.filter((r) => r._id !== id && r.id !== id));
			toast.success('Recommendation deleted');
		} catch {
			toast.error('Failed to delete recommendation');
		}
	};

	const handleToggleFeatured = async (id: string, current: boolean) => {
		try {
			await cmsToggleRecommendationFeatured(id, !current);
			setRecos((prev) =>
				prev.map((r) => (r._id === id || r.id === id) ? {...r, featured: !current} : r),
			);
			toast.success(!current ? 'Marked as featured' : 'Removed from featured');
		} catch {
			toast.error('Failed to update recommendation');
		}
	};

	const filtered = recos
		.filter((r) =>
			filter === 'all' ? true : filter === 'featured' ? r.featured : r.hidden,
		)
		.filter((r) => !search || (r.name ?? '').toLowerCase().includes(search.toLowerCase()));

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">Recommendations</h1>
					<div className="sub">aj@khesir:~$ cat ./recommendations · {recos.length} entries</div>
				</div>
				<button className="btn-new" onClick={() => navigate('/cms/recommendations/new')}>
					+ New Recommendation
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
						placeholder="search recommendations…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="cms-filter">
					<button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>All</button>
					<button className={filter === 'featured' ? 'on' : ''} onClick={() => setFilter('featured')}>Featured</button>
					<button className={filter === 'hidden' ? 'on' : ''} onClick={() => setFilter('hidden')}>Hidden</button>
				</div>
			</div>

			<div className="cms-table">
				<div className="cms-listhead">
					<span>From</span>
					<span>Source</span>
					<span className="r" />
				</div>
				{filtered.map((reco) => {
					const id = reco.id ?? reco._id;
					return (
						<div className="lrow" key={id}>
							<div>
								<div className="lname">
									{reco.name}
									{reco.featured && <span className="cbadge feat">featured</span>}
									{reco.hidden && <span className="cbadge draft">hidden</span>}
								</div>
								<div className="lsub">{reco.role} · {reco.company}</div>
							</div>
							<div className="ldate">
								{reco.sourceUrl ? (
									<a
										href={reco.sourceUrl}
										target="_blank"
										rel="noreferrer"
										style={{display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-3)', textDecoration: 'none', fontSize: 12}}
									>
										{reco.sourceType === 'linkedin' && (
											<svg viewBox="0 0 24 24" width={13} height={13} stroke="currentColor" fill="none" strokeWidth={1.7}><rect x="2" y="2" width="20" height="20" rx="3" /><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 17v-7" /></svg>
										)}
										{reco.sourceType === 'email' && (
											<svg viewBox="0 0 24 24" width={13} height={13} stroke="currentColor" fill="none" strokeWidth={1.7}><path d="M4 4h16v12H5.2L4 17.2z" /></svg>
										)}
										{(!reco.sourceType || reco.sourceType === 'other') && (
											<svg viewBox="0 0 24 24" width={13} height={13} stroke="currentColor" fill="none" strokeWidth={1.7}><path d="M7 17 17 7M7 7h10v10" /></svg>
										)}
										{reco.sourceType ?? 'source'}
									</a>
								) : (
									<span style={{color: 'var(--ink-4)', fontSize: 12}}>—</span>
								)}
							</div>
							<div className="lacts">
								<button
									className={`feat${reco.featured ? ' on' : ''}`}
									onClick={() => handleToggleFeatured(id, reco.featured)}
								>
									{reco.featured ? 'Featured' : 'Feature'}
								</button>
								<Link className="edit" to={`/cms/recommendations/${id}/edit`}>Edit</Link>
								<button className="del" onClick={() => handleDelete(id)}>Delete</button>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}
