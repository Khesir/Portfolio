import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {fetchFeaturedRecommendations} from '@/app/api/recommendations';
import {motion} from 'framer-motion';

const listContainer = {
	hidden: {},
	show: {transition: {staggerChildren: 0.1}},
};
const listItem = {
	hidden: {opacity: 0, y: 20},
	show: {opacity: 1, y: 0, transition: {type: 'spring' as const, stiffness: 80, damping: 18}},
};

function initials(name: string): string {
	return name
		.split(' ')
		.map((w) => w[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

export function TerminalRecommendationsSection() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [recos, setRecos] = useState<any[]>([]);

	useEffect(() => {
		fetchFeaturedRecommendations()
			.then((data) => setRecos(Array.isArray(data) ? data : []))
			.catch(() => setRecos([]));
	}, []);

	if (recos.length === 0) return null;

	return (
		<>
			<div className="sl">
				<span className="n">05</span>
				<h2>recommendations</h2>
				<span className="rule" />
				<Link to="/recommendations" className="more">all recommendations →</Link>
			</div>

			<motion.section
				className="recos"
				key={recos.length}
				variants={listContainer}
				initial="hidden"
				whileInView="show"
				viewport={{once: true, amount: 0.1}}
			>
				{recos.map((reco) => (
					<motion.div className="reco" key={reco.id ?? reco._id} variants={listItem}>
						<div className="quo">"</div>
						<blockquote>{reco.quote}</blockquote>
						<div className="who">
							<div className="av">{initials(reco.name)}</div>
							<div>
								<div className="nm2">{reco.name}</div>
								<div className="rl">{reco.role} · {reco.company}</div>
							</div>
							{reco.sourceUrl && (
								<a className="lk" href={reco.sourceUrl} target="_blank" rel="noreferrer">
									<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.7}>
										<path d="M7 17 17 7M7 7h10v10" />
									</svg>
									source
								</a>
							)}
						</div>
					</motion.div>
				))}
			</motion.section>
		</>
	);
}
