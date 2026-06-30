import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useHomeConfig} from '@/hooks/use-home-config';
import {TerminalLayout} from '../terminal/TerminalLayout';
import {TerminalStackSection} from './terminalStackSection';
import {TerminalProjectsSection} from './terminalProjectsSection';
import {TerminalWritingSection} from './terminalWritingSection';
import {TerminalCertificationsSection} from './terminalCertificationsSection';
import {TerminalRecommendationsSection} from './terminalRecommendationsSection';
import {TerminalContactSection} from './terminalContactSection';
import {motion, AnimatePresence} from 'framer-motion';

const heroContainer = {
	hidden: {},
	show: {transition: {staggerChildren: 0.09, delayChildren: 0.05}},
};
const heroItem = {
	hidden: {opacity: 0, y: 20},
	show: {opacity: 1, y: 0, transition: {type: 'spring' as const, stiffness: 80, damping: 18}},
};

export default function TerminalHomePage() {
	const {config} = useHomeConfig();
	const [termOpen, setTermOpen] = useState(true);

	return (
		<TerminalLayout>
			<section className="hero">
				<motion.div variants={heroContainer} initial="hidden" animate="show">
					<motion.div variants={heroItem} className="prompt">
						<b>aj@khesir</b>:~$ whoami
					</motion.div>
					<motion.h1 variants={heroItem} className="hname">
						{config.name} <span style={{color: 'var(--accent)'}}>/</span> {config.secondName || 'Khesir'}
					</motion.h1>
					<motion.div variants={heroItem} className="hrole">{config.role}</motion.div>
					<motion.p variants={heroItem} className="hblurb">{config.description}</motion.p>
					<motion.div variants={heroItem} className="hacts">
						{(config.heroButtons ?? []).map((btn, i) => {
							if (btn.to) return <Link key={i} to={btn.to} className={`btn ${i === 0 ? 'btn-blue' : 'btn-ghost'}`}>{btn.label}</Link>
							if (btn.href) return <a key={i} href={btn.href} className={`btn ${i === 0 ? 'btn-blue' : 'btn-ghost'}`} target="_blank" rel="noreferrer">{btn.label}</a>
							if (btn.action === 'contact') return <button key={i} className={`btn ${i === 0 ? 'btn-blue' : 'btn-ghost'}`} onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})}>{btn.label}</button>
							return null
						})}
					</motion.div>
					<motion.div variants={heroItem} className="hmeta">
						{config.location && (
							<span className="tag">
								<span className="dot" style={{background: 'var(--accent)'}} /> {config.location}
							</span>
						)}
						{(config.tags ?? []).map((tag, i) => (
							<span className="tag" key={i}>{tag}</span>
						))}
					</motion.div>
				</motion.div>

				<motion.div
					className="term-win"
					initial={{opacity: 0, scale: 0.96, y: 14}}
					animate={{opacity: 1, scale: 1, y: 0}}
					transition={{type: 'spring', stiffness: 70, damping: 18, delay: 0.25}}
				>
					<div
						className="term-bar"
						style={{cursor: termOpen ? 'default' : 'pointer'}}
						onClick={() => !termOpen && setTermOpen(true)}
					>
						<div className="dots">
							<i
								style={{background: '#ff5f57', cursor: 'pointer', opacity: termOpen ? 1 : 0.35, transition: 'opacity .2s'}}
								onClick={(e) => { e.stopPropagation(); setTermOpen(v => !v); }}
							/>
							<i style={{background: '#febc2e'}} />
							<i style={{background: '#28c840'}} />
						</div>
						<span className="ttl">aj@khesir: ~</span>
					</div>

					<AnimatePresence initial={false}>
						{termOpen && (
							<motion.div
								className="term-body"
								initial={{height: 0, opacity: 0}}
								animate={{height: 'auto', opacity: 1}}
								exit={{height: 0, opacity: 0}}
								transition={{duration: 0.28, ease: 'easeInOut'}}
								style={{overflow: 'hidden'}}
							>
								<div className="term-cmd">
									<b>aj@khesir</b>:~$ neofetch<span className="cur">▋</span>
								</div>
								<div className="neofetch">
									<motion.div
										className="ava2"
										animate={{y: [0, -6, 0]}}
										transition={{duration: 3.6, repeat: Infinity, ease: 'easeInOut'}}
									>
										<img src={config.profileImageUrl || '/img/Mee.png'} alt="Khesir" />
									</motion.div>
									<div className="nf-rows">
										<div className="nf-head">
											<span className="u">aj</span>
											<span className="at">@</span>
											<span className="h">khesir</span>
										</div>
										<div className="nf-line">───────────────</div>
										{(config.neofetchRows ?? []).map((row, i) => (
											<div className="r" key={i}>
												<span className="k">{row.key}</span>
												<span className="v">{row.value}</span>
											</div>
										))}
										<div className="nf-colors">
											<i style={{background: 'oklch(0.80 0.145 70)'}} />
											<i style={{background: 'oklch(0.74 0.13 245)'}} />
											<i style={{background: 'oklch(0.72 0.13 330)'}} />
											<i style={{background: '#4ade80'}} />
											<i style={{background: 'var(--ink-3)'}} />
										</div>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</section>

			<TerminalStackSection />
			<TerminalProjectsSection count={config.selectedWorkCount} />
			<TerminalWritingSection count={config.writingCount} />
			<TerminalCertificationsSection />
			<TerminalRecommendationsSection />
			<TerminalContactSection />
		</TerminalLayout>
	);
}
