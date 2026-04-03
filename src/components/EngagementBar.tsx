import {Eye, Heart} from 'lucide-react';
import {useEngagement} from '@/hooks/use-engagement';
import {useCmsAuth} from '@/hooks/use-cms-auth-store';
import type {EngagementType} from '@/app/api/cms';

interface EngagementBarProps {
	type: EngagementType;
	id: string;
	trackOnMount?: boolean;
	hideViews?: boolean;
	hideHearts?: boolean;
	className?: string;
}

export function EngagementBar({type, id, trackOnMount = false, hideViews = false, hideHearts = false, className = ''}: EngagementBarProps) {
	const {views, hearts, hearted, loading, toggling, heart} = useEngagement(type, id, trackOnMount);
	const isAdmin = useCmsAuth((s) => s.authenticated);

	if (loading) {
		return (
			<div className={`flex items-center gap-4 ${className}`}>
				<div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
				<div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
			</div>
		);
	}

	if (hideViews && hideHearts && !isAdmin) return null;

	return (
		<div className={`flex items-center gap-4 ${className}`}>
			{(!hideViews || isAdmin) && (
				<div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
					<Eye className="w-4 h-4" />
					<span className="text-sm tabular-nums">{views.toLocaleString()}</span>
				</div>
			)}
			{(!hideHearts || isAdmin) && (
				<button
					type="button"
					onClick={heart}
					disabled={toggling}
					className={`flex items-center gap-1.5 text-sm transition-colors ${
						hearted
							? 'text-red-500 dark:text-red-400'
							: 'text-slate-500 dark:text-slate-400 hover:text-red-400'
					}`}
				>
					<Heart
						className={`w-4 h-4 transition-all ${hearted ? 'fill-current scale-110' : ''}`}
					/>
					{isAdmin && (
						<span className="tabular-nums">{hearts.toLocaleString()}</span>
					)}
				</button>
			)}
		</div>
	);
}
