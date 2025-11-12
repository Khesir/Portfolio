import {usePathname} from '@/hooks/use-pathname-store';
import {useEffect} from 'react';
import {ProjectList} from '@/app/_components/projectsList';
import {Button} from '@/components/ui/Button';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {ArrowLeft, FolderGit2} from 'lucide-react';

export function ProjectPage() {
	const {setPathname} = usePathname();
	const navigate = useNavigate();
	useEffect(() => {
		setPathname(location.pathname);
	}, [location.pathname, setPathname]);

	return (
		<motion.div
			className="space-y-6 dark:text-white"
			initial={{opacity: 0, y: 20}}
			animate={{opacity: 1, y: 0}}
			transition={{duration: 0.5}}
		>
			{/* Header Section */}
			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate('/')}
					className="mb-4 -ml-2"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Home
				</Button>

				<div className="flex items-center gap-3 mb-2">
					<FolderGit2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
					<h1 className="font-bold text-4xl text-slate-900 dark:text-white">
						Projects
					</h1>
				</div>
				<p className="text-slate-600 dark:text-slate-400 text-lg">
					Explore my portfolio of software and game development projects
				</p>
			</div>

			{/* Projects Grid */}
			<ProjectList />

			{/* Footer CTA */}
			<div className="bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
				<div className="text-center sm:text-left">
					<p className="font-bold text-lg text-slate-900 dark:text-white">
						Have a project idea?
					</p>
					<p className="text-sm text-slate-600 dark:text-slate-400">
						Let's collaborate and bring your vision to life
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
			</div>
		</motion.div>
	);
}
