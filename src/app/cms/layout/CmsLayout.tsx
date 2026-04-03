import {NavLink, Outlet} from 'react-router-dom';
import {useCmsAuth} from '@/hooks/use-cms-auth-store';
import {Button} from '@/components/ui/Button';
import {useEnvironment} from '@/hooks/use-environment-store';
import {Globe, Code2} from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

const navSections = [
	{
		label: null,
		items: [{to: '/cms', label: 'Dashboard', end: true}],
	},
	{
		label: 'Data',
		items: [
			{to: '/cms/blogs', label: 'Blogs'},
			{to: '/cms/projects', label: 'Projects'},
			{to: '/cms/experiences', label: 'Experiences'},
			{to: '/cms/posts', label: 'Posts'},
		],
	},
	{
		label: 'Pages',
		items: [
			{to: '/cms/home-config', label: 'Home'},
			{to: '/cms/about-config', label: 'About'},
			{to: '/cms/service-config', label: 'Services'},
		],
	},
];

const linkClass = (isActive: boolean) =>
	`block px-3 py-2 rounded-lg text-sm transition-colors ${
		isActive
			? 'bg-slate-100 dark:bg-slate-800 font-medium text-slate-900 dark:text-slate-100'
			: 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
	}`;

export default function CmsLayout() {
	const {logout} = useCmsAuth();
	const {mode, toggleMode} = useEnvironment();

	return (
		<div className="h-screen overflow-hidden flex bg-slate-50 dark:bg-slate-950">
			<aside className="h-screen w-56 shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900">
				<div className="p-4 border-b border-slate-200 dark:border-slate-800">
					<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
						CMS
					</p>
				</div>

				<nav className="flex-1 p-3 space-y-4 overflow-y-auto">
					{navSections.map((section, i) => (
						<div key={i}>
							{section.label && (
								<p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
									{section.label}
								</p>
							)}
							<div className="space-y-0.5">
								{section.items.map(({to, label, end}) => (
									<NavLink
										key={to}
										to={to}
										end={end}
										className={({isActive}) => linkClass(isActive)}
									>
										{label}
									</NavLink>
								))}
							</div>
						</div>
					))}
				</nav>

				<div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									type="button"
									onClick={toggleMode}
									className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
										mode === 'development'
											? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
											: 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
									}`}
								>
									{mode === 'development' ? (
										<Code2 size={14} />
									) : (
										<Globe size={14} />
									)}
									{mode === 'development' ? 'Dev mode' : 'Production'}
								</button>
							</TooltipTrigger>
							<TooltipContent side="right">
								{mode === 'development'
									? 'Using mock data — click to switch to production'
									: 'Using real API — click to switch to dev mode'}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<a
						href="/"
						className="block px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
					>
						← Back to Site
					</a>
					<Button
						variant="ghost"
						size="sm"
						className="w-full justify-start text-slate-500 hover:text-red-500"
						onClick={logout}
					>
						Logout
					</Button>
				</div>
			</aside>

			<main className="flex-1 p-8 overflow-y-auto">
				<Outlet />
			</main>
		</div>
	);
}
