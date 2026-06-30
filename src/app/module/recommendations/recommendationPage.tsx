import {useState, useEffect} from 'react';
import {fetchRecommendations} from '@/app/api/recommendations';
import {TerminalLayout} from '../terminal/TerminalLayout';
import {TerminalContactSection} from '../home/TerminalContactSection';
import {motion} from 'framer-motion';

const headContainer = {
	hidden: {},
	show: {transition: {staggerChildren: 0.1, delayChildren: 0.05}},
};
const headItem = {
	hidden: {opacity: 0, y: 18},
	show: {opacity: 1, y: 0, transition: {type: 'spring' as const, stiffness: 80, damping: 18}},
};
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

export default function RecommendationPage() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [recos, setRecos] = useState<any[]>([]);

	useEffect(() => {
		fetchRecommendations().then(setRecos).catch(() => setRecos([]));
	}, []);

	return (
		<TerminalLayout>
			<motion.section
				className="phead"
				variants={headContainer}
				initial="hidden"
				animate="show"
			>
				<motion.div variants={headItem} className="crumb">
					<b>aj@khesir</b>:~$ cat ./recommendations
				</motion.div>
				<motion.h1 variants={headItem} className="ptitle">In their <em>words</em>.</motion.h1>
				<motion.p variants={headItem} className="plede">
					People I've built things with — managers, founders and fellow engineers — on what it's like to work together.
				</motion.p>
			</motion.section>

			<div className="sl">
				<span className="n">01</span>
				<h2>recommendations</h2>
				<span className="rule" />
				<span className="more">{recos.length} {recos.length === 1 ? 'person' : 'people'}</span>
			</div>

			<motion.section
				className="recos"
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

				{recos.length === 0 && (
					<p style={{fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink-3)'}}>No recommendations yet.</p>
				)}
			</motion.section>

			<section className="cta">
				<div className="glow" />
				<div className="cta-l">
					<div className="eyebrow"><span className="tick">//</span> let's work together</div>
					<h2>Want to be the<br />next one?</h2>
					<p>Open for engineering work and collaborations.</p>
				</div>
				<div className="cta-r">
					<a className="btn btn-blue" href="mailto:hello@khesir.com">hello@khesir.com</a>
				</div>
			</section>

			<TerminalContactSection />
		</TerminalLayout>
	);
}
