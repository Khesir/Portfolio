import {usePathname} from '@/hooks/use-pathname-store';
import {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/Button';
import {Icon} from '@iconify/react';
import {motion} from 'framer-motion';
import {Mail, Github, FileText, MapPin, Briefcase, GraduationCap} from 'lucide-react';
import {ExperienceSection} from '@/app/module/home/experienceSection';

// Iconify icon names
const goIcon = 'devicon:go';
const csharpIcon = 'devicon:csharp';
const cplusplusIcon = 'devicon:cplusplus';
const typescriptIcon = 'devicon:typescript';
const reactIcon = 'devicon:react';
const nextjsIcon = 'devicon:nextjs';
const nodejsIcon = 'devicon:nodejs';
const dockerIcon = 'devicon:docker';
const postgresIcon = 'devicon:postgresql';
const mongoIcon = 'devicon:mongodb';
const luaIcon = 'devicon:lua';
const unityIcon = 'devicon:unity';

export default function AboutMe() {
	const {setPathname} = usePathname();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		setPathname(location.pathname);
	}, [location.pathname, setPathname]);

	return (
		<div className="flex w-full flex-col gap-6 dark:text-white">
			{/* Header Card */}
			<motion.div
				className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden"
				initial={{y: -50, opacity: 0}}
				whileInView={{y: 0, opacity: 1}}
				viewport={{once: true, amount: 0.3}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<div className="p-8">
					<div className="flex flex-col md:flex-row gap-8 items-start">
						{/* Profile Image */}
						<div className="flex-shrink-0">
							<div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-slate-200 dark:border-slate-700 shadow-md">
								<img
									src="/img/profile3.jpg"
									alt="Khesir (AJ)"
									className="w-full h-full object-cover"
								/>
							</div>
						</div>

						{/* Header Content */}
						<div className="flex-1 space-y-4">
							<div>
								<h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
									Khesir (AJ)
								</h1>
								<p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-3">
									Software Engineer
								</p>
								<div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
									<div className="flex items-center gap-1.5">
										<MapPin className="w-4 h-4" />
										<span>Remote / Flexible</span>
									</div>
									<div className="flex items-center gap-1.5">
										<Briefcase className="w-4 h-4" />
										<span>Full-Stack Developer</span>
									</div>
									<div className="flex items-center gap-1.5">
										<GraduationCap className="w-4 h-4" />
										<span>Backend & Game Engineering</span>
									</div>
								</div>
							</div>

							{/* Quick Actions */}
							<div className="flex flex-wrap gap-3">
								<Button
									className="flex items-center gap-2"
									onClick={() => {
										navigate('/');
										setTimeout(() => {
											const el = document.getElementById('contact');
											if (el) el.scrollIntoView({behavior: 'smooth'});
										}, 100);
									}}
								>
									<Mail className="w-4 h-4" />
									Contact Me
								</Button>
								<Button
									variant="outline"
									className="flex items-center gap-2"
									onClick={() => window.open('https://github.com/khesir', '_blank')}
								>
									<Github className="w-4 h-4" />
									GitHub
								</Button>
								<Button
									variant="outline"
									className="flex items-center gap-2"
									onClick={() => navigate('/blogs')}
								>
									<FileText className="w-4 h-4" />
									Blogs
								</Button>
							</div>

							{/* Status Badge */}
							<div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg w-fit">
								<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
								<span className="text-sm font-medium text-green-700 dark:text-green-400">
									Available for Opportunities
								</span>
							</div>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Professional Summary */}
			<motion.div
				className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8"
				initial={{y: 50, opacity: 0}}
				whileInView={{y: 0, opacity: 1}}
				viewport={{once: true, amount: 0.3}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
					Professional Summary
				</h2>
				<div className="space-y-4 text-slate-700 dark:text-slate-300">
					<p className="leading-relaxed">
						Software Engineer with a strong focus on <strong>backend development</strong> and{' '}
						<strong>game engineering</strong>. I specialize in building scalable architectures
						for both software platforms and games, with expertise in designing robust systems
						that handle complex logic and high performance requirements.
					</p>
					<p className="leading-relaxed">
						While I have full-stack capabilities, my passion lies in backend architecture,
						system design, and game development. I'm deeply invested in writing clean,
						maintainable code that emphasizes scalability, proper data structures, and sound
						engineering principles.
					</p>
					<p className="leading-relaxed">
						I approach every project by asking critical questions: "Is this scalable?", "Is
						this implementation logically sound?", and "Will this make sense long-term?" This
						mindset helps me deliver solutions that stand the test of time.
					</p>
				</div>
			</motion.div>

			{/* Tech Stack Section */}
			<motion.div
				className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8"
				initial={{y: 50, opacity: 0}}
				whileInView={{y: 0, opacity: 1}}
				viewport={{once: true, amount: 0.3}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
					Technical Skills
				</h2>

				<div className="space-y-6">
					{/* Core Languages */}
					<div>
						<h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
							Core Languages
						</h3>
						<div className="flex flex-wrap gap-3">
							<div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
								<Icon icon={goIcon} className="w-8 h-8" />
								<div>
									<p className="font-semibold text-sm">Go</p>
									<p className="text-xs text-slate-600 dark:text-slate-400">
										Backend Services
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
								<Icon icon={csharpIcon} className="w-8 h-8" />
								<div>
									<p className="font-semibold text-sm">C#</p>
									<p className="text-xs text-slate-600 dark:text-slate-400">
										Game Development
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
								<Icon icon={cplusplusIcon} className="w-8 h-8" />
								<div>
									<p className="font-semibold text-sm">C++</p>
									<p className="text-xs text-slate-600 dark:text-slate-400">
										Systems Programming
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
								<Icon icon={typescriptIcon} className="w-8 h-8" />
								<div>
									<p className="font-semibold text-sm">TypeScript</p>
									<p className="text-xs text-slate-600 dark:text-slate-400">
										Full-Stack Development
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Frontend & Backend */}
					<div>
						<h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
							Frameworks & Tools
						</h3>
						<div className="flex flex-wrap gap-3">
							<div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
								<Icon icon={reactIcon} className="w-6 h-6" />
								<span className="text-sm font-medium">React</span>
							</div>
							<div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
								<Icon icon={nextjsIcon} className="w-6 h-6" />
								<span className="text-sm font-medium">Next.js</span>
							</div>
							<div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
								<Icon icon={nodejsIcon} className="w-6 h-6" />
								<span className="text-sm font-medium">Node.js</span>
							</div>
							<div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
								<Icon icon={dockerIcon} className="w-6 h-6" />
								<span className="text-sm font-medium">Docker</span>
							</div>
							<div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
								<Icon icon={postgresIcon} className="w-6 h-6" />
								<span className="text-sm font-medium">PostgreSQL</span>
							</div>
							<div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
								<Icon icon={mongoIcon} className="w-6 h-6" />
								<span className="text-sm font-medium">MongoDB</span>
							</div>
						</div>
					</div>

					{/* Game Development */}
					<div>
						<h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
							Game Development
						</h3>
						<div className="flex flex-wrap gap-3">
							<div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
								<Icon icon={unityIcon} className="w-6 h-6" />
								<span className="text-sm font-medium">Unity</span>
							</div>
							<div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
								<Icon icon={luaIcon} className="w-6 h-6" />
								<span className="text-sm font-medium">Lua (Love2D, Modding)</span>
							</div>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Core Competencies */}
			<motion.div
				className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8"
				initial={{y: 50, opacity: 0}}
				whileInView={{y: 0, opacity: 1}}
				viewport={{once: true, amount: 0.3}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
					Core Competencies
				</h2>
				<div className="grid md:grid-cols-2 gap-6">
					<div className="space-y-3">
						<h3 className="font-semibold text-lg text-slate-900 dark:text-white">
							Backend Engineering
						</h3>
						<ul className="space-y-2 text-slate-700 dark:text-slate-300">
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>RESTful API design and microservices architecture</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>Database design, optimization, and scaling strategies</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>Authentication, authorization, and security best practices</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>Performance optimization and caching strategies</span>
							</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold text-lg text-slate-900 dark:text-white">
							Game Development
						</h3>
						<ul className="space-y-2 text-slate-700 dark:text-slate-300">
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>Game architecture and systems design</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>Gameplay mechanics and state management</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>Unity engine development and Lua scripting</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>Game modding and custom game engines</span>
							</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold text-lg text-slate-900 dark:text-white">
							Software Engineering
						</h3>
						<ul className="space-y-2 text-slate-700 dark:text-slate-300">
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>Data structures and algorithm implementation</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>Object-oriented and functional programming paradigms</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>Clean code principles and design patterns</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>Git version control and collaborative development</span>
							</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold text-lg text-slate-900 dark:text-white">
							DevOps & Deployment
						</h3>
						<ul className="space-y-2 text-slate-700 dark:text-slate-300">
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>Docker containerization and orchestration</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>CI/CD pipeline setup and automation</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>Cloud deployment and server management</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
								<span>Monitoring, logging, and error tracking</span>
							</li>
						</ul>
					</div>
				</div>
			</motion.div>

			{/* Work Experience */}
			<motion.div
				initial={{y: 50, opacity: 0}}
				whileInView={{y: 0, opacity: 1}}
				viewport={{once: true, amount: 0.3}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<ExperienceSection pageSize={10} displayHeader={true} />
			</motion.div>

			{/* Call to Action */}
			<motion.div
				className="bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4"
				initial={{y: 50, opacity: 0}}
				whileInView={{y: 0, opacity: 1}}
				viewport={{once: true, amount: 0.3}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<div className="text-center sm:text-left">
					<p className="font-bold text-lg text-slate-900 dark:text-white">
						Interested in working together?
					</p>
					<p className="text-sm text-slate-600 dark:text-slate-400">
						I'm always open to discussing new opportunities and collaborations
					</p>
				</div>
				<Button
					size="lg"
					onClick={() => {
						navigate('/');
						setTimeout(() => {
							const el = document.getElementById('contact');
							if (el) el.scrollIntoView({behavior: 'smooth'});
						}, 100);
					}}
					className="whitespace-nowrap"
				>
					Get in Touch →
				</Button>
			</motion.div>
		</div>
	);
}
