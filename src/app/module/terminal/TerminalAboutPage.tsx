import {useEffect, useState} from 'react';
import {TerminalLayout} from './TerminalLayout';
import {useAboutConfig} from '@/hooks/use-home-config';
import {TerminalContactSection} from '../home/terminalContactSection';
import {fetchExperiences} from '@/app/api/experience';
import {MarkDownComponent} from '@/app/_components/readPage/readingPage';
import {Icon} from '@iconify/react';
import {motion, AnimatePresence} from 'framer-motion';

const headContainer = {
	hidden: {},
	show: {transition: {staggerChildren: 0.1, delayChildren: 0.05}},
};
const headItem = {
	hidden: {opacity: 0, y: 18},
	show: {opacity: 1, y: 0, transition: {type: 'spring' as const, stiffness: 80, damping: 18}},
};

const rowContainer = {
	hidden: {},
	show: {transition: {staggerChildren: 0.09}},
};
const rowItem = {
	hidden: {opacity: 0, y: 20},
	show: {opacity: 1, y: 0, transition: {type: 'spring' as const, stiffness: 80, damping: 18}},
};

const chipContainer = {
	hidden: {},
	show: {transition: {staggerChildren: 0.05}},
};
const chipItem = {
	hidden: {opacity: 0, scale: 0.82, y: 8},
	show: {opacity: 1, scale: 1, y: 0, transition: {type: 'spring' as const, stiffness: 130, damping: 16}},
};

const stackRowContainer = {
	hidden: {},
	show: {transition: {staggerChildren: 0.1}},
};
const stackRowItem = {
	hidden: {opacity: 0, x: -14},
	show: {opacity: 1, x: 0, transition: {type: 'spring' as const, stiffness: 80, damping: 18}},
};

function isSingleHomeLayout(): boolean {
	return import.meta.env.VITE_HOME_LAYOUT === 'single';
}

export default function TerminalAboutPage() {
	const {config: about} = useAboutConfig();
	const [experiences, setExperiences] = useState<any[]>([]);
	const [showingAll, setShowingAll] = useState(false);
	const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
	const showJourney = !isSingleHomeLayout();

	useEffect(() => {
		if (!showJourney) return;
		fetchExperiences(5).then(setExperiences);
	}, [showJourney]);

	return (
		<TerminalLayout>
			<motion.section
				className="phead"
				variants={headContainer}
				initial="hidden"
				animate="show"
			>
				<motion.div variants={headItem} className="crumb"><b>aj@khesir</b>:~$ cat about.me</motion.div>
				<motion.h1 variants={headItem} className="ptitle">Hey, I'm <em>AJ</em>.</motion.h1>
				<motion.p variants={headItem} className="plede">{about.professionalSummary || 'Full-stack engineer and toolmaker.'}</motion.p>
			</motion.section>

			<section className="about-grid">
				<motion.div
					className="portrait"
					initial={{opacity: 0, x: -32}}
					whileInView={{opacity: 1, x: 0}}
					viewport={{once: true, amount: 0.3}}
					transition={{type: 'spring', stiffness: 70, damping: 18}}
				>
					<img src={about.profileImageUrl || '/img/profile2.jpg'} alt="AJ" />
				</motion.div>
				<motion.div
					className="prose"
					initial={{opacity: 0, x: 24}}
					whileInView={{opacity: 1, x: 0}}
					viewport={{once: true, amount: 0.2}}
					transition={{type: 'spring', stiffness: 70, damping: 18, delay: 0.1}}
				>
					{about.bioTagline && <p className="lead">{about.bioTagline}</p>}
					{about.bioBody && <MarkDownComponent markdown={about.bioBody} />}
				</motion.div>
			</section>

			{(about.offTheClock ?? []).length > 0 && (
				<>
					<div className="sl"><span className="n">01</span><h2>off_the_clock</h2><span className="rule" /></div>
					<motion.section
						className="hobbies"
						variants={rowContainer}
						initial="hidden"
						whileInView="show"
						viewport={{once: true, amount: 0.15}}
					>
						{(about.offTheClock ?? []).map((item, i) => (
							<motion.div className="hobby" key={i} variants={rowItem}>
								<div className="hi">
									{item.icon && <Icon icon={item.icon} className="ic" style={{fontSize: '20px'}} />}
								</div>
								<h4>{item.label}</h4>
								{item.description && <p>{item.description}</p>}
							</motion.div>
						))}
					</motion.section>
				</>
			)}

			<div className="sl"><span className="n">02</span><h2>skills</h2><span className="rule" /><a className="more" href="/work">see it applied →</a></div>
			<motion.section
				className="stack"
				key={about.technicalSkills.length}
				variants={stackRowContainer}
				initial="hidden"
				whileInView="show"
				viewport={{once: true, amount: 0.15}}
			>
				{(about.technicalSkills ?? []).map((cat: any, i: number) => (
					<motion.div className="stack-row" key={i} variants={stackRowItem}>
						<div className="stack-cat">{cat.category}</div>
						<motion.div className="chips" variants={chipContainer}>
							{cat.items.map((item: string, j: number) => (
								<motion.span className="chip2" key={j} variants={chipItem}>{item}</motion.span>
							))}
						</motion.div>
					</motion.div>
				))}
			</motion.section>

			{showJourney && (
				<>
					<div className="sl"><span className="n">03</span><h2>journey</h2><span className="rule" /></div>
					<motion.section
						className="exp"
						key={experiences.length}
						variants={rowContainer}
						initial="hidden"
						whileInView="show"
						viewport={{once: true, amount: 0.1}}
					>
						{experiences.map((e: any, i: number) => {
							const startYr = e.durationStart ? new Date(e.durationStart).getFullYear() : '';
							const endYr = e.durationEnd ? String(new Date(e.durationEnd).getFullYear()).slice(-2) : null;
							const yr = endYr ? `${startYr} — ${endYr}` : `${startYr} —`;
							const isExpanded = expandedIdx === i;
							return (
								<motion.div key={i} variants={rowItem}>
									<div
										className="exp-row"
										style={{cursor: 'pointer'}}
										onClick={() => setExpandedIdx(isExpanded ? null : i)}
									>
										<span className={`box${i === 0 ? ' now' : ''}`} />
										<div>
											<h4>{e.position}</h4>
											<div className="place">{e.companyName} · {e.jobType}</div>
										</div>
										<span className="eyr">{yr}</span>
									</div>
									<AnimatePresence initial={false}>
										{isExpanded && (
											<motion.div
												className="exp-detail"
												initial={{height: 0, opacity: 0}}
												animate={{height: 'auto', opacity: 1}}
												exit={{height: 0, opacity: 0}}
												transition={{duration: 0.28, ease: 'easeInOut'}}
												style={{overflow: 'hidden'}}
											>
												{e.pageMd
													? <MarkDownComponent markdown={e.pageMd} />
													: <p style={{fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--ink-3)'}}>No details available.</p>
												}
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							);
						})}
						{experiences.length === 0 && (
							<div className="exp-row">
								<span className="box now" />
								<div>
									<h4>Full-Stack Engineer &amp; Toolmaker</h4>
									<div className="place">Self-directed &amp; freelance</div>
								</div>
								<span className="eyr">2025 —</span>
							</div>
						)}
						{!showingAll && experiences.length === 5 && (
							<button
								className="show-more"
								style={{fontFamily: 'var(--mono)', fontSize: '13px', cursor: 'pointer', marginTop: '12px'}}
								onClick={() => {
									fetchExperiences(20).then((list: any) => {
										setExperiences(Array.isArray(list) ? list : []);
										setShowingAll(true);
									});
								}}
							>
								show more
							</button>
						)}
					</motion.section>
				</>
			)}

			<TerminalContactSection />
		</TerminalLayout>
	);
}
