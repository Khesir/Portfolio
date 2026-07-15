import {useEffect, useState} from 'react';
import {fetchExperiences} from '@/app/api/experience';

export default function DashboardJourney() {
	const [experiences, setExperiences] = useState<any[]>([]);

	useEffect(() => {
		fetchExperiences(5).then((list: any) => setExperiences(Array.isArray(list) ? list : []));
	}, []);

	return (
		<div className="dash-journey-slot">
			<div className="dash-journey-list">
				{experiences.map((e: any, i: number) => {
					const startYr = e.durationStart ? new Date(e.durationStart).getFullYear() : '';
					const endYr = e.durationEnd ? String(new Date(e.durationEnd).getFullYear()).slice(-2) : null;
					const yr = endYr ? `${startYr} — ${endYr}` : `${startYr} —`;
					return (
						<div className="dash-journey-row" key={e.id ?? i}>
							<div>
								<h4>{e.position}</h4>
								<div className="dash-journey-place">
									{e.companyName} · {e.jobType}
								</div>
								{Array.isArray(e.highlightSkills) && e.highlightSkills.length > 0 && (
									<div className="dash-journey-skills">
										{e.highlightSkills.join(' · ')}
									</div>
								)}
							</div>
							<span className="dash-journey-yr">{yr}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
