import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {Home, ArrowLeft} from 'lucide-react';

export function NotFoundPage() {
	return (
		<motion.div
			className="flex flex-col items-center justify-center py-24 gap-6 text-center"
			initial={{opacity: 0, y: 20}}
			animate={{opacity: 1, y: 0}}
			transition={{duration: 0.5}}
		>
			<p className="text-8xl font-black text-slate-200 dark:text-slate-800 select-none">
				404
			</p>
			<div className="space-y-2 -mt-4">
				<h1 className="text-2xl font-bold text-slate-900 dark:text-white">
					Page not found
				</h1>
				<p className="text-slate-500 dark:text-slate-400 text-sm">
					The page you're looking for doesn't exist or has been moved.
				</p>
			</div>
			<div className="flex items-center gap-3">
				<Link
					to="/"
					className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
				>
					<Home className="w-4 h-4" />
					Go home
				</Link>
				<button
					onClick={() => window.history.back()}
					className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
				>
					<ArrowLeft className="w-4 h-4" />
					Go back
				</button>
			</div>
		</motion.div>
	);
}
