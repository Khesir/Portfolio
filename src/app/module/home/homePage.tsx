import {useLocation, useNavigate} from 'react-router-dom';
import {usePathname} from '@/hooks/use-pathname-store';
import {useEffect} from 'react';

import {TopProjects} from '@/app/module/home/topProjects';
import {Button} from '@/components/ui/Button';
import {Icon} from '@iconify/react';
import {motion} from 'framer-motion';

// Iconify icon names for the respective languages
const csharpIcon = 'devicon:csharp';
const cplusplusIcon = 'devicon:cplusplus';
const typescriptIcon = 'devicon:typescript';
// const flutterIcon = 'devicon:flutter';
export default function Homepage() {
	const {setPathname} = usePathname();
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		setPathname(location.pathname);
	}, [location.pathname, setPathname]);
	return (
		<div className="dark:text-white flex flex-col gap-8 mt-5">
			{/* About Me Section */}
			<motion.div
				className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden"
				initial={{y: -50, opacity: 0}}
				whileInView={{y: 0, opacity: 1}}
				viewport={{once: true, amount: 0.3}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
					{/* Profile Image */}
					<div className="flex-shrink-0">
						<div className="w-48 h-48 md:w-56 md:h-56 mx-auto md:mx-0">
							<img
								src={'/img/profile2.jpg'}
								alt="Khesir Profile"
								className="w-full h-full object-cover rounded-2xl border-4 border-slate-200 dark:border-slate-700 shadow-md"
							/>
						</div>
					</div>

					{/* Content */}
					<div className="flex-1 flex flex-col justify-center space-y-4">
						<div>
							<h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
								Khesir (AJ)
							</h2>
							<p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">
								Software Engineer
							</p>
						</div>

						<div className="space-y-3 text-slate-700 dark:text-slate-300">
							<p className="leading-relaxed">
								👋 Hey there! I&apos;m AJ (also known as Khesir), a Software
								Engineer with a passion for backend development and game
								engineering.
							</p>
							<p className="leading-relaxed">
								🚀 I specialize in gameplay programming, simulation systems, and
								scalable backend architecture — turning complex technical problems
								into clean, maintainable solutions.
							</p>
						</div>

						{/* Tech Stack */}
						<div>
							<p className="text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium">
								Languages
							</p>
							<div className="flex gap-3 flex-wrap">
								<div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
									<Icon icon={csharpIcon} className="w-6 h-6" />
									<span className="text-sm font-medium">C#</span>
								</div>
								<div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
									<Icon icon={cplusplusIcon} className="w-6 h-6" />
									<span className="text-sm font-medium">C++</span>
								</div>
								<div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
									<Icon icon={typescriptIcon} className="w-6 h-6" />
									<span className="text-sm font-medium">TypeScript</span>
								</div>
								<div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
									<Icon icon="devicon:python" className="w-6 h-6" />
									<span className="text-sm font-medium">Python</span>
								</div>
								{/* <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
									<Icon icon={flutterIcon} className="w-6 h-6" />
									<span className="text-sm font-medium">Flutter</span>
								</div> */}
							</div>
						</div>
					</div>
				</div>
			</motion.div>
			{/* <iframe
				frameBorder="0"
				className="w-full h-[180px] 3xl:h-[180px] rounded-3xl"
				src="https://git-graph.vercel.app/embed/khesir?showColorLegend=false&showWeekdayLabels=false&showMonthLabels=true&showTotalCount=false&blockMargin=2&blockRadius=5&blockSize=17&fontSize=15&weekStart=6&year=2025"
			></iframe> */}
			{/* CTA Section */}
			<motion.div
				className="bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4"
				initial={{y: 50, opacity: 0}}
				whileInView={{y: 0, opacity: 1}}
				viewport={{once: true, amount: 0.3}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<div className="text-center sm:text-left">
					<p className="font-bold text-lg text-slate-900 dark:text-white">
						Want to know more about me?
					</p>
					<p className="text-sm text-slate-600 dark:text-slate-400">
						Check out my full story, skills, and journey
					</p>
				</div>
				<Button
					size="lg"
					onClick={() => navigate('about')}
					className="whitespace-nowrap"
				>
					View Full Profile →
				</Button>
			</motion.div>
			<TopProjects />
			{/* Contact Section */}
			<motion.div
				id="contact"
				className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg"
				initial={{y: 100, opacity: 0}}
				whileInView={{y: 0, opacity: 1}}
				viewport={{once: true, amount: 0.3}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<div className="p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="text-center sm:text-left">
						<h2 className="text-2xl font-bold text-slate-900 dark:text-white">
							Get in Touch
						</h2>
						<p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
							Have a project in mind or just want to say hello?
						</p>
					</div>
					<a
						href="mailto:contact@khesir.com"
						className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
					>
						contact@khesir.com
					</a>
				</div>
			</motion.div>
		</div>
	);
}
