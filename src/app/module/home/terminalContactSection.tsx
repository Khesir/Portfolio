import {useHomeConfig} from '@/hooks/use-home-config';
import {Icon} from '@iconify/react';
import {motion} from 'framer-motion';

export function TerminalContactSection() {
	const {config} = useHomeConfig();

	return (
		<motion.section
			className="cta"
			id="contact"
			initial={{opacity: 0, y: 44}}
			whileInView={{opacity: 1, y: 0}}
			viewport={{once: true, amount: 0.2}}
			transition={{type: 'spring', stiffness: 70, damping: 18}}
		>
			<div className="glow" />
			<div className="cta-l">
				<div className="eyebrow"><span className="tick">//</span> get in touch</div>
				<h2>{config.contactHeading}</h2>
				<p>{config.contactSubtext}</p>
			</div>
			<div className="cta-r">
				{config.contactEmail && (
					<a className="btn btn-blue" href={`mailto:${config.contactEmail}`}>
						{config.contactEmail}
					</a>
				)}
				{(config.socialLinks ?? []).length > 0 && (
					<div className="soc">
						{(config.socialLinks ?? []).map((link, i) => (
							<a key={i} href={link.href} title={link.label} aria-label={link.label} target={link.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">
								{link.icon ? <Icon icon={link.icon} style={{width: 20, height: 20}} /> : link.label}
							</a>
						))}
					</div>
				)}
			</div>
		</motion.section>
	);
}
