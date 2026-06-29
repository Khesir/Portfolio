import {Link} from 'react-router-dom';
import {useHomeConfig} from '@/hooks/use-home-config';
import {TerminalLayout} from '../terminal/TerminalLayout';
import {TerminalStackSection} from './terminalStackSection';
import {TerminalProjectsSection} from './terminalProjectsSection';
import {TerminalWritingSection} from './terminalWritingSection';
import {TerminalContactSection} from './terminalContactSection';

export default function TerminalHomePage() {
	const {config} = useHomeConfig();

	return (
		<TerminalLayout>
			<section className="hero">
				<div>
					<div className="prompt"><b>aj@khesir</b>:~$ whoami</div>
					<h1 className="hname">
						{config.name} <span style={{color: 'var(--accent)'}}>/</span> Khesir
					</h1>
					<div className="hrole">{config.role}</div>
					<p className="hblurb">{config.description}</p>
					<div className="hacts">
						{(config.heroButtons ?? []).map((btn, i) => {
							if (btn.to) return <Link key={i} to={btn.to} className={`btn ${i === 0 ? 'btn-blue' : 'btn-ghost'}`}>{btn.label}</Link>
							if (btn.href) return <a key={i} href={btn.href} className={`btn ${i === 0 ? 'btn-blue' : 'btn-ghost'}`} target="_blank" rel="noreferrer">{btn.label}</a>
							if (btn.action === 'contact') return <button key={i} className={`btn ${i === 0 ? 'btn-blue' : 'btn-ghost'}`} onClick={() => document.getElementById('contact')?.scrollIntoView()}>{btn.label}</button>
							return null
						})}
					</div>
					<div className="hmeta">
						{config.location && (
							<span className="tag">
								<span className="dot" style={{background: 'var(--accent)'}} /> {config.location}
							</span>
						)}
						{(config.tags ?? []).map((tag, i) => (
							<span className="tag" key={i}>{tag}</span>
						))}
					</div>
				</div>

				<div className="term-win">
					<div className="term-bar">
						<div className="dots">
							<i style={{background: '#ff5f57'}} />
							<i style={{background: '#febc2e'}} />
							<i style={{background: '#28c840'}} />
						</div>
						<span className="ttl">aj@khesir: ~</span>
					</div>
					<div className="term-body">
						<div className="term-cmd">
							<b>aj@khesir</b>:~$ neofetch<span className="cur">▋</span>
						</div>
						<div className="neofetch">
							<div className="ava2">
								<img src={config.profileImageUrl || '/img/Mee.png'} alt="Khesir" />
							</div>
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
					</div>
				</div>
			</section>

			<TerminalStackSection />
			<TerminalProjectsSection count={config.selectedWorkCount} />
			<TerminalWritingSection count={config.writingCount} />
			<TerminalContactSection />
		</TerminalLayout>
	);
}
