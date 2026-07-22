import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import type {JourneyEntry} from '@/data/journey';
import {fetchLocalSection, saveLocalSection} from '@/app/api/cms-local';
import {toast} from 'sonner';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

const IS_DEV = import.meta.env.DEV;

export default function CmsJourney() {
	const navigate = useNavigate();
	const [journey, setJourney] = useState<JourneyEntry[]>([]);

	useEffect(() => {
		fetchLocalSection<JourneyEntry[]>('journey').then(setJourney);
	}, []);

	const handleDelete = async (id: string) => {
		try {
			const next = journey.filter((j) => j.id !== id);
			await saveLocalSection('journey', next);
			setJourney(next);
			toast.success('Company removed');
		} catch {
			toast.error('Failed to delete company');
		}
	};

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">Journey</h1>
					<div className="sub">
						aj@khesir:~$ ls ./journey · {journey.length} entries
					</div>
				</div>
				<button
					className="btn-new"
					disabled={!IS_DEV}
					onClick={() => navigate('/cms/journey/new')}
				>
					+ New Company
				</button>
			</div>
			<LocalOnlyNotice />
			<div className="cms-table">
				<div className="cms-listhead">
					<span>Company</span>
					<span>Positions</span>
					<span className="r" />
				</div>
				{journey.map((j) => (
					<div className="lrow" key={j.id}>
						<div>
							<div className="lname">
								{j.company}
								{j.draft && <span className="cbadge draft">draft</span>}
							</div>
						</div>
						<div className="ldate">{j.positions.length}</div>
						<div className="lacts">
							<Link className="edit" to={`/cms/journey/${j.id}/edit`}>
								Edit
							</Link>
							<button
								className="del"
								disabled={!IS_DEV}
								onClick={() => handleDelete(j.id)}
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
