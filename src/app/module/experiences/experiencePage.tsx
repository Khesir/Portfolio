import {usePathname} from '@/hooks/use-pathname-store';
import {useEffect} from 'react';
import {Button} from '@/components/ui/Button';
import {useNavigate} from 'react-router-dom';
import {ExperienceSection} from '../home/experienceSection';
import {motion} from 'framer-motion';
import {ArrowLeft, Briefcase} from 'lucide-react';

export function ExperiencePage() {
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
					<Briefcase className="w-8 h-8 text-purple-600 dark:text-purple-400" />
					<h1 className="font-bold text-4xl text-slate-900 dark:text-white">
						Work Experience
					</h1>
				</div>
				<p className="text-slate-600 dark:text-slate-400 text-lg">
					A comprehensive timeline of my professional journey and contributions
				</p>
			</div>

			{/* Experience Timeline */}
			<ExperienceSection pageSize={20} displayHeader={false} />

			{/* Footer CTA */}
			<div className="bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
				<div className="text-center sm:text-left">
					<p className="font-bold text-lg text-slate-900 dark:text-white">
						Want to work together?
					</p>
					<p className="text-sm text-slate-600 dark:text-slate-400">
						I'm always open to new opportunities and collaborations
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
