import {usePathname} from '@/hooks/use-pathname-store';
import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {motion} from 'framer-motion';
import {Server, Bot, Gamepad2} from 'lucide-react';

const services = [
	{
		icon: Server,
		title: 'Web Development',
		tagline: 'Backend & Systems',
		description:
			'Designing and building scalable server-side systems, REST and WebSocket APIs, microservices, and infrastructure. Focus on performance, reliability, and clean architecture — not the pixels.',
		stack: ['C#', 'NestJS', 'PostgreSQL', 'MySQL', 'MongoDB', 'Docker', 'Redis'],
	},
	{
		icon: Bot,
		title: 'Bot Development',
		tagline: 'Automation & Integrations',
		description:
			'Building bots and automation systems for Discord, Telegram, and custom platforms. From game economy bots and moderation systems to workflow automation and third-party integrations.',
		stack: ['Discord.js', 'C#', 'TypeScript', 'Webhooks', 'REST APIs'],
	},
	{
		icon: Gamepad2,
		title: 'Game Development',
		tagline: 'Gameplay & Systems Architecture',
		description:
			'Focused on gameplay programming, simulation systems, and designing scalable game codebases that can grow without breaking. From core mechanics and physics-driven simulations to architecting systems that keep complexity manageable at scale.',
		stack: ['C#', 'C++', 'Unity', 'WebSockets', 'TCP/UDP'],
	},
];

const cardVariants = {
	initial: {opacity: 0, y: 30},
	animate: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {duration: 0.4, delay: i * 0.1},
	}),
};

export function ServicePage() {
	const {setPathname} = usePathname();
	const location = useLocation();

	useEffect(() => {
		setPathname(location.pathname);
	}, [location.pathname, setPathname]);

	return (
		<div className="flex flex-col gap-8 mt-5 dark:text-white">
			{/* Header */}
			<motion.div
				initial={{opacity: 0, y: -20}}
				animate={{opacity: 1, y: 0}}
				transition={{duration: 0.4}}
			>
				<h1 className="text-3xl font-bold text-slate-900 dark:text-white">Services</h1>
				<p className="text-slate-600 dark:text-slate-400 mt-1">
					Systems-focused engineering — built to scale, built to last.
				</p>
			</motion.div>

			{/* Service Cards */}
			<div className="flex flex-col gap-4">
				{services.map((service, i) => (
					<motion.div
						key={service.title}
						custom={i}
						variants={cardVariants}
						initial="initial"
						animate="animate"
						className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col sm:flex-row gap-5"
					>
						{/* Icon */}
						<div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center">
							<service.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
						</div>

						{/* Content */}
						<div className="flex flex-col gap-3 flex-1">
							<div>
								<div className="flex items-center gap-2 flex-wrap">
									<h2 className="font-bold text-lg text-slate-900 dark:text-white">
										{service.title}
									</h2>
									<span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
										{service.tagline}
									</span>
								</div>
								<p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
									{service.description}
								</p>
							</div>

							{/* Stack */}
							<div className="flex flex-wrap gap-1.5">
								{service.stack.map((tech) => (
									<span
										key={tech}
										className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
									>
										{tech}
									</span>
								))}
							</div>
						</div>
					</motion.div>
				))}
			</div>

			{/* CTA */}
			<motion.div
				initial={{opacity: 0, y: 20}}
				animate={{opacity: 1, y: 0}}
				transition={{duration: 0.4, delay: 0.4}}
				className="bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4"
			>
				<div className="text-center sm:text-left">
					<p className="font-bold text-lg text-slate-900 dark:text-white">
						Have a project in mind?
					</p>
					<p className="text-sm text-slate-600 dark:text-slate-400">
						Let's talk about what you need built.
					</p>
				</div>
				<a
					href="mailto:contact@khesir.com"
					className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
				>
					contact@khesir.com
				</a>
			</motion.div>
		</div>
	);
}
