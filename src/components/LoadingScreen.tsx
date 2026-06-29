import {useEffect, useRef, useState, type ReactNode} from 'react';
import {prefetchAll} from '@/hooks/use-home-config';
import {fetchProjects} from '@/app/api/projects';
import {fetchBlogs} from '@/app/api/blogs';
import '../css/terminal-mock.css';
import '../css/terminal-cms-gate.css';

type Phase = 'booting' | 'exiting' | 'done';

const STEPS = [
	{label: 'Profile & config',   stat: 'config'},
	{label: 'Featured projects',  stat: 'projects'},
	{label: 'Content & writing',  stat: 'blogs'},
	{label: 'Mounting routes',    stat: 'routes'},
] as const;

const LOG_LINES = [
	'loading profile config…',
	'fetching featured projects…',
	'loading content & writing…',
	'mounting routes…',
];

const PROGRESS = [30, 55, 80, 100];

function CheckIcon() {
	return (
		<svg viewBox="0 0 24 24">
			<polyline points="20 6 9 17 4 12" />
		</svg>
	);
}

function stepClass(index: number, active: number, done: number): string {
	if (index < active) return 'bstep done';
	if (index === active) return 'bstep active';
	return 'bstep pending';
}

export function LoadingScreen({children}: {children: ReactNode}) {
	const [phase, setPhase] = useState<Phase>('booting');
	const [active, setActive] = useState(0);
	const [doneTo, setDoneTo] = useState(-1);
	const [progress, setProgress] = useState(0);
	const [log, setLog] = useState(LOG_LINES[0]);
	const ranRef = useRef(false);

	useEffect(() => {
		if (ranRef.current) return;
		ranRef.current = true;

		const run = async () => {
			setActive(0);
			setLog(LOG_LINES[0]);
			await prefetchAll();
			setDoneTo(0);
			setProgress(PROGRESS[0]);

			setActive(1);
			setLog(LOG_LINES[1]);
			await fetchProjects();
			setDoneTo(1);
			setProgress(PROGRESS[1]);

			setActive(2);
			setLog(LOG_LINES[2]);
			await fetchBlogs();
			setDoneTo(2);
			setProgress(PROGRESS[2]);

			setActive(3);
			setLog(LOG_LINES[3]);
			await new Promise(r => setTimeout(r, 300));
			setDoneTo(3);
			setProgress(PROGRESS[3]);
			setLog('ready.');

			await new Promise(r => setTimeout(r, 500));
			setPhase('exiting');
		};

		run();
	}, []);

	if (phase === 'done') return <>{children}</>;

	return (
		<div style={{position: 'fixed', inset: 0, zIndex: 100, background: 'var(--bg)'}}>
			{phase === 'exiting' && (
				<div
					className="boot-exit"
					onAnimationEnd={() => setPhase('done')}
				/>
			)}

			<div className="boot-stage">
				<div className="tcard">
					<div className="tc-bar">
						<div className="dots">
							<i style={{background: '#ff5f57'}} />
							<i style={{background: '#febc2e'}} />
							<i style={{background: '#28c840'}} />
						</div>
						<span className="ttl">khesir — boot</span>
					</div>

					<div className="tc-body">
						<div className="boot-head">
							<div className="mk">
								<img src="/img/Mee.png" alt="avatar" />
							</div>
							<div>
								<div className="bh-t">khesir</div>
								<div className="bh-s">initializing content layer</div>
							</div>
						</div>

						<div className="boot-cmd">
							<b>$</b> ./boot --env=production --preload=all
						</div>

						<div className="boot-steps">
							{STEPS.map((s, i) => (
								<div key={s.stat} className={stepClass(i, active, doneTo)}>
									<div className="ic">
										{doneTo >= i && <CheckIcon />}
									</div>
									<span className="label">{s.label}</span>
									<span className="stat">
										{doneTo >= i ? 'done' : i === active ? 'running' : 'pending'}
									</span>
								</div>
							))}
						</div>

						<div className="boot-prog">
							<div className="boot-track">
								<div className="boot-fill" style={{width: progress + '%'}} />
							</div>
							<div className="boot-foot">
								<span>{log}<span className="cursor" /></span>
								<span className="pct">{progress}%</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
