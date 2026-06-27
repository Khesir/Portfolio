import {useAboutConfig} from '@/hooks/use-home-config';

export function TerminalStackSection() {
	const {config} = useAboutConfig();

	return (
		<>
			<div className="sl">
				<span className="n">01</span>
				<h2>tech_stack</h2>
				<span className="rule" />
				<span className="more">// what I build with</span>
			</div>
			<section className="stack">
				{config.technicalSkills.map((cat, i) => (
					<div className="stack-row" key={i}>
						<div className="stack-cat">{cat.category}</div>
						<div className="chips">
							{cat.items.map((item, j) => (
								<span className="chip2" key={j}>{item}</span>
							))}
						</div>
					</div>
				))}
			</section>
		</>
	);
}
