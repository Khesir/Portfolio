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
						<Link to="/projects" className="btn btn-blue">View work →</Link>
						<Link to="/about" className="btn btn-ghost">$ cat about.me</Link>
					</div>
					<div className="hmeta">
						<span className="tag">
							<span className="dot" style={{background: 'var(--accent)'}} /> Philippines · UTC+8
						</span>
						<span className="tag">agentic AI</span>
						<span className="tag">APIs &amp; tooling</span>
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
								<div className="r"><span className="k">Role</span><span className="v">{config.role || 'Full-Stack · Toolmaker'}</span></div>
								<div className="r"><span className="k">Uptime</span><span className="v">building since 2020</span></div>
								<div className="r"><span className="k">Editor</span><span className="v">VS Code · Cursor</span></div>
								<div className="r"><span className="k">Lang</span><span className="v">TypeScript · C# · Py</span></div>
								<div className="r"><span className="k">Stack</span><span className="v">React · Flutter · Node</span></div>
								<div className="r"><span className="k">Locale</span><span className="v">PH · UTC+8</span></div>
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
			<TerminalProjectsSection />
			<TerminalWritingSection />
			<TerminalContactSection />
		</TerminalLayout>
	);
}
