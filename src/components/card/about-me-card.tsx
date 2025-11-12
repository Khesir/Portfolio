import {motion} from 'framer-motion';
import {Button} from '../ui/Button';
import {useNavigate} from 'react-router-dom';
import {Mail, FileText} from 'lucide-react';

export function AboutMeCard() {
	const navigate = useNavigate();
	return (
		<motion.div
			className="absolute w-[90%] sm:w-[80%] md:w-[550px] bottom-8 right-4 md:right-8 bg-white dark:bg-slate-900 z-20 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
			initial={{x: '100%', opacity: 0}}
			animate={{x: 0, opacity: 1}}
			exit={{x: '100%', opacity: 0}}
			transition={{type: 'spring', stiffness: 100, damping: 15}}
		>
			<div className="p-6 space-y-4">
				{/* Status Badge */}
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full">
						<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
						<span className="text-sm font-medium text-green-700 dark:text-green-400">
							Available for Work
						</span>
					</div>
				</div>

				{/* Title */}
				<div className="space-y-2">
					<h3 className="text-xl font-bold text-slate-900 dark:text-white">
						Open for Freelance & Collaborations
					</h3>
					<p className="text-sm text-slate-600 dark:text-slate-400">
						Let's work together to bring your ideas to life
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-wrap gap-3">
					<Button
						className="flex items-center gap-2"
						onClick={() => {
							const el = document.getElementById('contact');
							if (el) el.scrollIntoView({behavior: 'smooth'});
						}}
					>
						<Mail className="w-4 h-4" />
						Contact Me
					</Button>
					<Button
						variant="outline"
						className="flex items-center gap-2"
						onClick={() => navigate('blogs')}
					>
						<FileText className="w-4 h-4" />
						Read Blogs
					</Button>
				</div>
			</div>
		</motion.div>
	);
}
