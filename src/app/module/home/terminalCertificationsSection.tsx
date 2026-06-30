import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {fetchCertifications} from '@/app/api/certifications';
import {Icon} from '@iconify/react';
import {motion} from 'framer-motion';

const listContainer = {
	hidden: {},
	show: {transition: {staggerChildren: 0.08}},
};
const listItem = {
	hidden: {opacity: 0, y: 16},
	show: {opacity: 1, y: 0, transition: {type: 'spring' as const, stiffness: 80, damping: 18}},
};

export function TerminalCertificationsSection({count = 4}: {count?: number}) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [certs, setCerts] = useState<any[]>([]);

	useEffect(() => {
		fetchCertifications(count)
			.then((data) => setCerts(Array.isArray(data) ? data.slice(0, count) : []))
			.catch(() => setCerts([]));
	}, [count]);

	if (certs.length === 0) return null;

	return (
		<>
			<div className="sl">
				<span className="n">04</span>
				<h2>certifications</h2>
				<span className="rule" />
				<Link to="/certifications" className="more">all certifications →</Link>
			</div>

			<motion.section
				className="certs"
				key={certs.length}
				variants={listContainer}
				initial="hidden"
				whileInView="show"
				viewport={{once: true, amount: 0.1}}
			>
				{certs.map((cert) => (
					<motion.div className="cert" key={cert.id ?? cert._id} variants={listItem}>
						<div className="ci">
							{cert.icon ? (
								<Icon icon={cert.icon} width={20} height={20} />
							) : (
								<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.7}>
									<circle cx="12" cy="8" r="6" />
									<path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
								</svg>
							)}
						</div>
						<div>
							<div className="ccat">{cert.category}</div>
							<h4>{cert.title}</h4>
							<div className="cmeta">
								{cert.issuer && <span>{cert.issuer}</span>}
								{cert.issuedDate && <span>{cert.issuedDate}</span>}
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
		</>
	);
}
