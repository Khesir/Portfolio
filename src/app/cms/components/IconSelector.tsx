import {useEffect, useState} from 'react';
import {Icon} from '@iconify/react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/Button';

interface IconSelectorProps {
	value: string;
	onChange: (icon: string) => void;
	placeholder?: string;
}

export default function IconSelector({
	value,
	onChange,
	placeholder = 'mdi:code-braces',
}: IconSelectorProps) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<string[]>([]);
	const [searching, setSearching] = useState(false);

	useEffect(() => {
		if (!open) return;
		if (!query.trim()) {
			setResults([]);
			return;
		}
		const timer = setTimeout(async () => {
			setSearching(true);
			try {
				const res = await fetch(
					`https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=48`,
				);
				const data = await res.json();
				setResults(data.icons ?? []);
			} catch {
				setResults([]);
			} finally {
				setSearching(false);
			}
		}, 350);
		return () => clearTimeout(timer);
	}, [query, open]);

	const select = (icon: string) => {
		onChange(icon);
		setOpen(false);
		setQuery('');
		setResults([]);
	};

	return (
		<div className="flex items-center gap-2">
			{/* Preview box */}
			<div className="w-9 h-9 shrink-0 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800">
				{value ? (
					<Icon icon={value} className="w-5 h-5" />
				) : (
					<span className="text-slate-300 text-xs select-none">?</span>
				)}
			</div>

			{/* Direct text input */}
			<Input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="flex-1 text-sm font-mono"
			/>

			{/* Browse button */}
			<Button type="button" variant="outline" onClick={() => setOpen(true)}>
				Browse
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Select Icon</DialogTitle>
					</DialogHeader>

					<Input
						autoFocus
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search Iconify — e.g. server, react, gamepad"
					/>

					{searching && (
						<p className="text-sm text-slate-400 text-center py-4">
							Searching...
						</p>
					)}

					{!searching && !query && (
						<p className="text-sm text-slate-400 text-center py-4">
							Type to search the Iconify library (500k+ icons).
						</p>
					)}

					{!searching && query && results.length === 0 && (
						<p className="text-sm text-slate-400 text-center py-4">
							No results for &quot;{query}&quot;
						</p>
					)}

					{results.length > 0 && (
						<div className="grid grid-cols-8 gap-1 max-h-72 overflow-y-auto pr-1">
							{results.map((icon) => (
								<button
									key={icon}
									type="button"
									onClick={() => select(icon)}
									title={icon}
									className={`p-2 rounded-md flex items-center justify-center transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
										value === icon
											? 'bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500'
											: ''
									}`}
								>
									<Icon icon={icon} className="w-5 h-5" />
								</button>
							))}
						</div>
					)}

					{/* Selected display */}
					{value && (
						<div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
							<Icon icon={value} className="w-4 h-4" />
							<span className="font-mono">{value}</span>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
