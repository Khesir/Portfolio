import {Heart} from 'lucide-react';
import {useEngagement} from '@/hooks/use-engagement';
import {useCmsAuth} from '@/hooks/use-cms-auth-store';
import type {EngagementType} from '@/app/api/cms';

interface StickyHeartProps {
	type: EngagementType;
	id: string;
	hideHearts?: boolean;
}

export function StickyHeart({type, id, hideHearts = false}: StickyHeartProps) {
	const {hearts, hearted, loading, toggling, heart} = useEngagement(type, id);
	const isAdmin = useCmsAuth((s) => s.authenticated);

	if (loading || !id) return null;
	if (hideHearts && !isAdmin) return null;

	return (
		<div className="flex flex-col items-center gap-2">
			<button
				type="button"
				onClick={heart}
				disabled={toggling}
				title={hearted ? 'Remove heart' : 'Heart this'}
				className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shadow-md transition-all duration-200 ${
					hearted
						? 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-500 scale-110'
						: 'border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-400 hover:border-red-300 dark:hover:border-red-700 hover:text-red-400 hover:scale-105'
				}`}
			>
				<Heart
					className={`w-5 h-5 transition-all duration-200 ${hearted ? 'fill-current' : ''} ${toggling ? 'opacity-50' : ''}`}
				/>
			</button>
			{isAdmin && (
				<span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
					{hearts.toLocaleString()}
				</span>
			)}
		</div>
	);
}
