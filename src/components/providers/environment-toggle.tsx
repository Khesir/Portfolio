'use client';

import { Code2, Globe } from 'lucide-react';
import { Button } from '../ui/Button';
import { useEnvironment } from '@/hooks/use-environment-store';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

export function EnvironmentToggle() {
	const { mode, toggleMode } = useEnvironment();

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						className="rounded-full w-20 h-20 bg-background border-none dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent"
						variant="outline"
						size="icon"
						onClick={toggleMode}
					>
						<Globe
							className={`w-[1.5rem] h-[1.5rem] transition-all ease-in-out duration-500 ${
								mode === 'production'
									? 'rotate-0 scale-100'
									: 'rotate-90 scale-0'
							}`}
						/>
						<Code2
							className={`absolute w-[1.5rem] h-[1.5rem] transition-all ease-in-out duration-500 ${
								mode === 'development'
									? 'rotate-0 scale-100'
									: '-rotate-90 scale-0'
							}`}
						/>
						<span className="sr-only">
							Switch Environment Mode (Current: {mode})
						</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent side="left">
					<p className="font-semibold">
						{mode === 'production' ? 'Production Mode' : 'Development Mode'}
					</p>
					<p className="text-xs text-slate-400">
						{mode === 'production'
							? 'Using real API'
							: 'Using mock data'}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
