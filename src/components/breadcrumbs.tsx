import {useLocation, Link} from 'react-router-dom';
import {capitalizeFirstLetter} from '@/lib/utils';
import {ChevronRight, Home} from 'lucide-react';

export const Breadcrumbs = () => {
	const location = useLocation();
	const pathSegments = location.pathname.split('/').filter(Boolean);

	const breadcrumbItems = pathSegments.slice(0, -1).map((segment, index) => {
		const title = capitalizeFirstLetter(segment.replace(/-/g, ' '));
		const link = '/' + pathSegments.slice(0, index + 1).join('/');
		return {title, link};
	});

	const breadcrumbs = [{title: 'Home', link: '/', icon: true}, ...breadcrumbItems];
	const current = capitalizeFirstLetter(
		pathSegments[pathSegments.length - 1]?.replace(/-/g, ' ') ?? '',
	);

	return (
		<nav className="flex items-center gap-1 text-sm flex-wrap">
			{breadcrumbs.map((item, index) => (
				<span key={index} className="flex items-center gap-1">
					<Link
						to={item.link}
						className="flex items-center gap-1 px-2 py-0.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
					>
						{index === 0 && <Home className="w-3.5 h-3.5" />}
						{item.title}
					</Link>
					<ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
				</span>
			))}
			<span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium truncate max-w-[200px]">
				{current}
			</span>
		</nav>
	);
};
