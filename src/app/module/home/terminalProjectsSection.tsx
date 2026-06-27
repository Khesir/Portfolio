import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {fetchFeaturedProjects} from '@/app/api/projects';

export function TerminalProjectsSection() {
	const [projects, setProjects] = useState<any[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchFeaturedProjects().then((data: any[]) => {
			setProjects(data.filter((p) => p.pinned === true).slice(0, 3));
		});
	}, []);

	return (
		<>
			<div className="sl">
				<span className="n">02</span>
				<h2>selected_work</h2>
				<span className="rule" />
				<Link to="/work" className="more">all projects →</Link>
			</div>
			<section className="projs">
				{projects.length === 0 ? (
					<p style={{color: 'var(--ink-3)', fontFamily: 'var(--mono)', fontSize: '13px'}}>
						No featured projects yet.
					</p>
				) : (
					projects.map((p, i) => {
						const id = p._id ?? p.id;
						const name = p.name ?? 'Untitled';
						const languages: string[] = p.languages ?? [];
						const year = p.releasedDate ? new Date(p.releasedDate).getFullYear() : '';
						return (
							<div
								className="proj"
								key={id}
								onClick={() => navigate(`/work/view/${name.replace(/\s+/g, '-')}?id=${id}`)}
							>
								<span className="idx">{String(i + 1).padStart(2, '0')}</span>
								<div>
									<div className="pt">
										<h4>{name}</h4>
									</div>
									<div className="ptags">
										{languages.map((lang, j) => (
											<span className="tag" key={j}>{lang}</span>
										))}
									</div>
								</div>
								<span className="yr">{year}</span>
							</div>
						);
					})
				)}
			</section>
		</>
	);
}
