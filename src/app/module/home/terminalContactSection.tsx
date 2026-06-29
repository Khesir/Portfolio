import {useHomeConfig} from '@/hooks/use-home-config';

export function TerminalContactSection() {
	const {config} = useHomeConfig();

	return (
		<section className="cta">
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
							<a key={i} href={link.href} aria-label={link.label}>{link.label}</a>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
