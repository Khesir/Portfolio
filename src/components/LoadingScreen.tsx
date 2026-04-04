import {useEffect, useRef, useState, type ReactNode} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {prefetchAll} from '@/hooks/use-home-config';
import {fetchProjects} from '@/app/api/projects';

const STEPS = [
	{key: 'config',   label: 'Profile & config'},
	{key: 'projects', label: 'Featured projects'},
	{key: 'wire',     label: 'Connections'},
	{key: 'ready',    label: 'Ready'},
] as const;

type StepKey = (typeof STEPS)[number]['key'];
type Phase = 'booting' | 'exiting' | 'done';

const ease = [0.76, 0, 0.24, 1] as const;

export function LoadingScreen({children}: {children: ReactNode}) {
	const [phase, setPhase] = useState<Phase>('booting');
	const [done, setDone] = useState<Set<StepKey>>(new Set());
	const [progress, setProgress] = useState(0);
	const [visibleSteps, setVisibleSteps] = useState<StepKey[]>(['config']);
	const ranRef = useRef(false);

	useEffect(() => {
		if (ranRef.current) return;
		ranRef.current = true;

		const run = async () => {
			await prefetchAll();
			setDone(p => new Set([...p, 'config']));
			setProgress(30);
			setVisibleSteps(p => [...p, 'projects']);

			await fetchProjects();
			setDone(p => new Set([...p, 'projects']));
			setProgress(65);
			setVisibleSteps(p => [...p, 'wire']);

			await new Promise(r => setTimeout(r, 220));
			setDone(p => new Set([...p, 'wire']));
			setProgress(85);
			setVisibleSteps(p => [...p, 'ready']);

			await new Promise(r => setTimeout(r, 300));
			setDone(p => new Set([...p, 'ready']));
			setProgress(100);

			await new Promise(r => setTimeout(r, 500));
			setPhase('exiting');
		};

		run();
	}, []);

	return (
		<>
			{children}

			<AnimatePresence>
				{phase === 'booting' && (
					<motion.div
						key="loader"
						className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-950 flex items-center justify-center"
						exit={{opacity: 0, transition: {duration: 0.15}}}
					>
						<div className="flex flex-col items-center gap-8 w-full max-w-xs px-6">
							<motion.h1
								className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight"
								initial={{opacity: 0, y: 12}}
								animate={{opacity: 1, y: 0}}
								transition={{duration: 0.5, ease: 'easeOut'}}
							>
								Khesir
							</motion.h1>

	
							{/* Card */}
							<motion.div
								className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-5 space-y-4"
								initial={{opacity: 0, y: 12}}
								animate={{opacity: 1, y: 0}}
								transition={{duration: 0.5, delay: 0.15, ease: 'easeOut'}}
							>
								{/* Steps */}
								<div className="space-y-2.5">
									{STEPS.map(({key, label}) =>
										visibleSteps.includes(key) ? (
											<motion.div
												key={key}
												initial={{opacity: 0, x: -8}}
												animate={{opacity: 1, x: 0}}
												transition={{duration: 0.3, ease: 'easeOut'}}
												className="flex items-center gap-3"
											>
												<div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300 ${
													done.has(key)
														? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500'
														: 'border-slate-300 dark:border-slate-600'
												}`}>
													{done.has(key) && (
														<motion.svg
															initial={{opacity: 0, scale: 0.5}}
															animate={{opacity: 1, scale: 1}}
															transition={{duration: 0.2}}
															className="w-2.5 h-2.5 text-white"
															viewBox="0 0 10 10"
															fill="none"
														>
															<path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</motion.svg>
													)}
													{!done.has(key) && (
														<motion.div
															className="w-1.5 h-1.5 rounded-full bg-blue-500"
															animate={{opacity: [1, 0.3, 1]}}
															transition={{duration: 0.9, repeat: Infinity}}
														/>
													)}
												</div>
												<span className={`text-sm transition-colors duration-300 ${
													done.has(key)
														? 'text-slate-900 dark:text-slate-100'
														: 'text-slate-400 dark:text-slate-500'
												}`}>
													{label}
												</span>
											</motion.div>
										) : null
									)}
								</div>

								{/* Progress bar */}
								<div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
									<motion.div
										className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
										initial={{width: '0%'}}
										animate={{width: `${progress}%`}}
										transition={{duration: 0.45, ease: 'easeOut'}}
									/>
								</div>
							</motion.div>
					</div>
					</motion.div>
				)}

				{phase === 'exiting' && (
					<>
						<motion.div
							key="top-panel"
							className="fixed top-0 left-0 right-0 z-[100] bg-slate-50 dark:bg-slate-950"
							style={{height: '50vh'}}
							initial={{y: 0}}
							animate={{y: '-100%'}}
							transition={{duration: 0.6, ease}}
							onAnimationComplete={() => setPhase('done')}
						/>
						<motion.div
							key="bot-panel"
							className="fixed bottom-0 left-0 right-0 z-[100] bg-slate-50 dark:bg-slate-950"
							style={{height: '50vh'}}
							initial={{y: 0}}
							animate={{y: '100%'}}
							transition={{duration: 0.6, ease}}
						/>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
