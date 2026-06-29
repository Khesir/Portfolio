import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {fetchFeaturedProjects} from '@/app/api/projects';
import {motion} from 'framer-motion';

const listContainer = {
	hidden: {},
	show: {transition: {staggerChildren: 0.09}},
};
const listItem = {
	hidden: {opacity: 0, y: 22},
	show: {opacity: 1, y: 0, transition: {type: 'spring' as const, stiffness: 80, damping: 18}},
};
const tagContainer = {
	hidden: {},
	show: {transition: {staggerChildren: 0.05}},
};
const tagItem = {
	hidden: {opacity: 0, scale: 0.78},
	show: {opacity: 1, scale: 1, transition: {type: 'spring' as const, stiffness: 140, damping: 14}},
};

export function TerminalProjectsSection({count = 3}: {count?: number}) {
	const [projects, setProjects] = useState<any[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchFeaturedProjects().then((data: any[]) => {
			setProjects(data.filter((p) => p.pinned === true).slice(0, count));
		});
	}, [count]);

	return (
		<>
			<div className="sl">
				<span className="n">02</span>
				<h2>selected_work</h2>
				<span className="rule" />
				<Link to="/work" className="more">all projects →</Link>
			</div>
			<motion.section
				className="projs"
				key={projects.length}
				variants={listContainer}
				initial="hidden"
				whileInView="show"
				viewport={{once: true, amount: 0.1}}
			>
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
							<motion.div
								className="proj"
								key={id}
								variants={listItem}
								onClick={() => navigate(`/work/view/${name.replace(/\s+/g, '-')}?id=${id}`)}
							>
								<span className="idx">{String(i + 1).padStart(2, '0')}</span>
								<div>
									<div className="pt">
										<h4>{name}</h4>
									</div>
									<motion.div className="ptags" variants={tagContainer}>
										{languages.map((lang, j) => (
											<motion.span className="tag" key={j} variants={tagItem}>
												{lang}
											</motion.span>
										))}
									</motion.div>
								</div>
								<span className="yr">{year}</span>
							</motion.div>
						);
					})
				)}
			</motion.section>
		</>
	);
}
