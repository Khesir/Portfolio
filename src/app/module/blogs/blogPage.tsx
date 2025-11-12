import {usePathname} from '@/hooks/use-pathname-store';
import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import {BlogList} from '@/app/_components/blogList';
import {motion} from 'framer-motion';
import {ArrowLeft, BookOpen} from 'lucide-react';
import {Button} from '@/components/ui/Button';

export function BlogPage() {
	const {setPathname} = usePathname();
	const location = useLocation();
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
					<BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
					<h1 className="font-bold text-4xl text-slate-900 dark:text-white">
						Blog Posts
					</h1>
				</div>
				<p className="text-slate-600 dark:text-slate-400 text-lg">
					Articles, tutorials, and insights on software development
				</p>
			</div>

			{/* Blog List */}
			<BlogList />

			{/* Footer CTA */}
			<div className="bg-green-50 dark:bg-green-900/10 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
				<div className="text-center sm:text-left">
					<p className="font-bold text-lg text-slate-900 dark:text-white">
						Enjoy reading?
					</p>
					<p className="text-sm text-slate-600 dark:text-slate-400">
						Subscribe to stay updated with my latest posts and projects
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
