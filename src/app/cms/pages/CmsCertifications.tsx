import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {fetchCertificationsCms, cmsDeleteCertification} from '@/app/api/cms';
import {toast} from 'sonner';

const CATEGORIES = ['Cloud', 'AI / ML', 'Engineering', 'DevOps', 'Backend', 'Game'];

export default function CmsCertifications() {
	const navigate = useNavigate();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [certs, setCerts] = useState<any[]>([]);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState('all');

	useEffect(() => {
		fetchCertificationsCms().then(setCerts);
	}, []);

	const handleDelete = async (id: string) => {
		await cmsDeleteCertification(id);
		setCerts((prev) => prev.filter((c) => c._id !== id && c.id !== id));
		toast.success('Certification deleted');
	};

	const filtered = certs
		.filter((c) => filter === 'all' ? true : filter === 'drafts' ? c.draft : c.category === filter)
		.filter((c) => !search || (c.title ?? '').toLowerCase().includes(search.toLowerCase()));

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">Certifications</h1>
					<div className="sub">aj@khesir:~$ ls ./certifications · {certs.length} credentials</div>
				</div>
				<button className="btn-new" onClick={() => navigate('/cms/certifications/new')}>
					+ New Certification
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
						placeholder="search certifications…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="cms-filter">
					<button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>All</button>
					{CATEGORIES.map((cat) => (
						<button key={cat} className={filter === cat ? 'on' : ''} onClick={() => setFilter(cat)}>
							{cat}
						</button>
					))}
					<button className={filter === 'drafts' ? 'on' : ''} onClick={() => setFilter('drafts')}>Drafts</button>
				</div>
			</div>

			<div className="cms-table">
				<div className="cms-listhead">
					<span>Certification</span>
					<span>Proof</span>
					<span className="r" />
				</div>
				{filtered.map((cert) => (
					<div className="lrow" key={cert.id ?? cert._id}>
						<div>
							<div className="lname">
								{cert.title}
								{cert.category && <span className="tag" style={{marginLeft: 8}}>{cert.category}</span>}
								{cert.draft && <span className="cbadge draft">draft</span>}
							</div>
							<div className="lsub">
								{cert.issuedDate && `Issued ${cert.issuedDate}`}
								{cert.issuer && ` · ${cert.issuer}`}
							</div>
						</div>
						<div className="ldate">
							{cert.proofUrl ? (
								<a
									className="proof"
									href={cert.proofUrl}
									target="_blank"
									rel="noreferrer"
									style={{display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-3)', textDecoration: 'none'}}
								>
									{cert.proofType === 'image' ? (
										<svg viewBox="0 0 24 24" width={13} height={13} stroke="currentColor" fill="none" strokeWidth={1.7}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
									) : (
										<svg viewBox="0 0 24 24" width={13} height={13} stroke="currentColor" fill="none" strokeWidth={1.7}><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" /></svg>
									)}
									{cert.proofType === 'image' ? 'image' : 'link'}
								</a>
							) : (
								<span style={{color: 'var(--ink-4)', fontSize: 12}}>—</span>
							)}
						</div>
						<div className="lacts">
							<Link className="edit" to={`/cms/certifications/${cert.id ?? cert._id}/edit`}>Edit</Link>
							<button className="del" onClick={() => handleDelete(cert.id ?? cert._id)}>Delete</button>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
