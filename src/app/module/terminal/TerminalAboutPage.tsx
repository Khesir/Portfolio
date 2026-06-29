import {useEffect, useState} from 'react';
import {TerminalLayout} from './TerminalLayout';
import {useAboutConfig} from '@/hooks/use-home-config';
import {TerminalContactSection} from '../home/terminalContactSection';
import {fetchExperiences} from '@/app/api/experience';
import {MarkDownComponent} from '@/app/_components/readPage/readingPage';

export default function TerminalAboutPage() {
	const {config: about} = useAboutConfig();
	const [experiences, setExperiences] = useState<any[]>([]);
	const [showingAll, setShowingAll] = useState(false);
	const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

	useEffect(() => {
		fetchExperiences(5).then(setExperiences);
	}, []);

	return (
		<TerminalLayout>
			<section className="phead">
				<div className="crumb"><b>aj@khesir</b>:~$ cat about.me</div>
				<h1 className="ptitle">Hey, I'm <em>AJ</em>.</h1>
				<p className="plede">{about.professionalSummary || 'Full-stack engineer and toolmaker.'}</p>
			</section>

			<section className="about-grid">
				<div className="portrait">
					<img src={about.profileImageUrl || '/img/profile2.jpg'} alt="AJ" />
				</div>
				<div className="prose">
					{about.bioTagline && <p className="lead">{about.bioTagline}</p>}
					{about.bioBody && <MarkDownComponent markdown={about.bioBody} />}
				</div>
			</section>

			<div className="sl"><span className="n">01</span><h2>off_the_clock</h2><span className="rule" /></div>
			<section className="hobbies">
				<div className="hobby">
					<div className="hi">
						<svg className="ic" style={{fontSize: '20px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
							<path d="M7 12h4M9 10v4M15.5 11.5h.01M18 13.5h.01M7 7h10a4 4 0 014 4l-1 6a3 3 0 01-5 1l-1-1H9l-1 1a3 3 0 01-5-1l-1-6a4 4 0 014-4z" />
						</svg>
					</div>
					<h4>Games</h4>
					<p>RPGs for the worlds, osu! for the rhythm and that obsessive drive to keep improving.</p>
				</div>

				<div className="hobby">
					<div className="hi">
						<svg className="ic" style={{fontSize: '20px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
							<path d="M6.5 6.5l11 11M4 9l2-2M9 4l-2 2M20 15l-2 2M15 20l2-2M3 12l1.5 1.5M21 12l-1.5-1.5" />
						</svg>
					</div>
					<h4>The gym</h4>
					<p>Lifting keeps me disciplined — same loop as shipping: show up, add a little, repeat.</p>
				</div>

				<div className="hobby">
					<div className="hi">
						<svg className="ic" style={{fontSize: '20px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
							<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 5v14M19 19v2" />
						</svg>
					</div>
					<h4>Reading &amp; collecting</h4>
					<p>Always mid-book. I collect physical copies — fantasy, craft and tech books.</p>
				</div>

				<div className="hobby">
					<div className="hi">
						<svg className="ic" style={{fontSize: '20px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
							<path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
						</svg>
					</div>
					<h4>Tinkering</h4>
					<p>Small side projects and tools — building something just to see how it works is half the fun.</p>
				</div>
			</section>

			<div className="sl"><span className="n">02</span><h2>skills</h2><span className="rule" /><a className="more" href="/work">see it applied →</a></div>
			<section className="stack">
				{(about.technicalSkills ?? []).map((cat: any, i: number) => (
					<div className="stack-row" key={i}>
						<div className="stack-cat">{cat.category}</div>
						<div className="chips">
							{cat.items.map((item: string, j: number) => (
								<span className="chip2" key={j}>{item}</span>
							))}
						</div>
					</div>
				))}
			</section>

			<div className="sl"><span className="n">03</span><h2>journey</h2><span className="rule" /></div>
			<section className="exp">
				{experiences.map((e: any, i: number) => {
					const startYr = e.durationStart ? new Date(e.durationStart).getFullYear() : '';
					const endYr = e.durationEnd ? String(new Date(e.durationEnd).getFullYear()).slice(-2) : null;
					const yr = endYr ? `${startYr} — ${endYr}` : `${startYr} —`;
					const isExpanded = expandedIdx === i;
					return (
						<div key={i}>
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
							{isExpanded && (
								<div className="exp-detail">
									{e.pageMd
										? <MarkDownComponent markdown={e.pageMd} />
										: <p style={{fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--ink-3)'}}>No details available.</p>
									}
								</div>
							)}
						</div>
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
			</section>

			<TerminalContactSection />
		</TerminalLayout>
	);
}
