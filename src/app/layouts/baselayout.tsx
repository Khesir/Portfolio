import {Navbar} from '@/components/navbar';
import {useHomeConfig} from '@/hooks/use-home-config';

interface ContentLayoutProps {
	children: React.ReactNode;
}
export function Layout({children}: ContentLayoutProps) {
	const {config} = useHomeConfig();

	return (
		<div className="min-h-screen flex flex-col bg-white dark:bg-slate-800">
			<Navbar />
			<div className="flex-grow mb-5">
				<div className="h-full flex justify-center pt-10">{children}</div>
			</div>
			<footer className="border-t border-slate-200 dark:border-slate-700 mt-20">
				<div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
					<p>© {new Date().getFullYear()} {config.name || 'Khesir (Aj)'}</p>
					<div className="flex gap-5">
						<a href="https://github.com/khesir" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">GitHub</a>
						<a href="https://x.com/khesirr" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">Twitter</a>
						<a href="https://www.twitch.tv/khesir" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">Twitch</a>
						<a href="/#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
