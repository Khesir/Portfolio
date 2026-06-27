import {useHomeConfig} from '@/hooks/use-home-config';

export function TerminalContactSection() {
	const {config} = useHomeConfig();

	return (
		<section className="cta">
			<div className="glow" />
			<div className="cta-l">
				<div className="eyebrow"><span className="tick">//</span> get in touch</div>
				<h2>Let's build something<br />&amp; make it faster.</h2>
				<p>Open for engineering work and collaborations.</p>
			</div>
			<div className="cta-r">
				{config.contactEmail && (
					<a className="btn btn-blue" href={`mailto:${config.contactEmail}`}>
						{config.contactEmail}
					</a>
				)}
				<div className="soc">
					<a href="#" aria-label="GitHub">⌥</a>
					<a href="#" aria-label="LinkedIn">◆</a>
					<a href="#" aria-label="Twitter">✕</a>
					<a href="#" aria-label="Email">✉</a>
				</div>
			</div>
		</section>
	);
}
