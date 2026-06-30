import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {fetchCertifications} from '@/app/api/certifications';
import {TerminalLayout} from '../terminal/TerminalLayout';
import {TerminalContactSection} from '../home/terminalContactSection';
import {Icon} from '@iconify/react';
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
	show: {transition: {staggerChildren: 0.08}},
};
const listItem = {
	hidden: {opacity: 0, y: 16},
	show: {opacity: 1, y: 0, transition: {type: 'spring' as const, stiffness: 80, damping: 18}},
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function groupByCategory(certs: any[]): Record<string, any[]> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return certs.reduce((acc: Record<string, any[]>, cert: any) => {
		const cat = cert.category ?? 'Other';
		if (!acc[cat]) acc[cat] = [];
		acc[cat].push(cert);
		return acc;
	}, {});
}

function slugCategory(cat: string): string {
	return cat.toLowerCase().replace(/\s+\/\s+/g, '_').replace(/\s+/g, '_');
}

export default function CertificationPage() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [certs, setCerts] = useState<any[]>([]);

	useEffect(() => {
		fetchCertifications(100).then(setCerts).catch(() => setCerts([]));
	}, []);

	const grouped = groupByCategory(certs);
	const categories = Object.keys(grouped);

	return (
		<TerminalLayout>
			<motion.section
				className="phead"
				variants={headContainer}
				initial="hidden"
				animate="show"
			>
				<motion.div variants={headItem} className="crumb">
					<b>aj@khesir</b>:~$ ls ./certifications
				</motion.div>
				<motion.h1 variants={headItem} className="ptitle">The <em>credentials</em>.</motion.h1>
				<motion.p variants={headItem} className="plede">
					Certifications I've earned along the way — grouped by craft. Each one links to a verifiable credential or proof.
				</motion.p>
			</motion.section>

			{categories.map((cat, idx) => (
				<div key={cat}>
					<div className="sl">
						<span className="n">{String(idx + 1).padStart(2, '0')}</span>
						<h2>{slugCategory(cat)}</h2>
						<span className="rule" />
						<span className="more">{grouped[cat].length}</span>
					</div>

					<motion.section
						className="certs"
						variants={listContainer}
						initial="hidden"
						whileInView="show"
						viewport={{once: true, amount: 0.1}}
					>
						{grouped[cat].map((cert) => (
							<motion.div className="cert" key={cert.id ?? cert._id} variants={listItem}>
								<div className="ci">
									{cert.icon ? (
										<Icon icon={cert.icon} width={22} height={22} />
									) : (
										<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.7}>
											<circle cx="12" cy="8" r="6" />
											<path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
										</svg>
									)}
								</div>
								<div>
									<div className="ccat">{cert.issuer}</div>
									<h4>{cert.title}</h4>
									<div className="cmeta">
										{cert.issuedDate && <span>Issued {cert.issuedDate}</span>}
										{cert.credentialId && <span>Credential ID · {cert.credentialId}</span>}
									</div>
									{cert.description && <p>{cert.description}</p>}
									{cert.proofUrl && (
										<a className="cproof" href={cert.proofUrl} target="_blank" rel="noreferrer">
											{cert.proofType === 'image' ? (
												<>View certificate{' '}<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.7}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></>
											) : (
												<>View credential{' '}<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.7}><path d="M7 17 17 7M7 7h10v10" /></svg></>
											)}
										</a>
									)}
								</div>
							</motion.div>
						))}
					</motion.section>
				</div>
			))}

			{certs.length === 0 && (
				<p style={{fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink-3)'}}>No certifications yet.</p>
			)}

			<section className="cta">
				<div className="glow" />
				<div className="cta-l">
					<div className="eyebrow"><span className="tick">//</span> the short version</div>
					<h2>Credentials are nice.<br />Shipped work is better.</h2>
					<p>See what these actually add up to.</p>
				</div>
				<div className="cta-r">
					<Link className="btn btn-blue" to="/work">View work →</Link>
				</div>
			</section>

			<TerminalContactSection />
		</TerminalLayout>
	);
}
