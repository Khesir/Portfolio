import {useState} from 'react';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {BannerButton} from '@/app/api/cms';
import IconSelector from './IconSelector';

type BtnAction = 'contact' | 'internal' | 'external';

function getBtnAction(btn: BannerButton): BtnAction {
	if (btn.action === 'contact') return 'contact';
	if ('to' in btn) return 'internal';
	return 'external';
}

export const PUBLIC_ROUTES = [
	{path: '/', label: 'Home (/)'},
	{path: '/about', label: 'About'},
	{path: '/services', label: 'Services'},
	{path: '/blogs', label: 'Blogs'},
	{path: '/projects', label: 'Projects'},
	{path: '/experiences', label: 'Experiences'},
	{path: '/progress-report', label: 'Progress Report'},
	{path: '/guest-book', label: 'Guest Book'},
];

interface BannerButtonEditorProps {
	btn: BannerButton;
	index: number;
	onChange: (i: number, b: BannerButton) => void;
	onRemove: (i: number) => void;
}

export default function BannerButtonEditor({
	btn,
	index,
	onChange,
	onRemove,
}: BannerButtonEditorProps) {
	const [actionType, setActionType] = useState<BtnAction>(() => getBtnAction(btn));
	const set = (patch: Partial<BannerButton>) => onChange(index, {...btn, ...patch});

	const handleActionChange = (a: BtnAction) => {
		setActionType(a);
		if (a === 'contact')
			onChange(index, {label: btn.label, icon: btn.icon, action: 'contact'});
		else if (a === 'internal')
			onChange(index, {label: btn.label, icon: btn.icon, to: btn.to ?? '/'});
		else
			onChange(index, {label: btn.label, icon: btn.icon, href: btn.href ?? ''});
	};

	return (
		<div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-3">
			<div className="flex items-center justify-between">
				<span className="text-xs font-medium text-slate-500">Button {index + 1}</span>
				<button
					type="button"
					onClick={() => onRemove(index)}
					className="text-xs text-red-400 hover:text-red-600 transition-colors"
				>
					Remove
				</button>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<div className="space-y-1.5">
					<Label className="text-xs">Label</Label>
					<Input
						value={btn.label}
						onChange={(e) => set({label: e.target.value})}
						placeholder="Contact Me"
						className="text-sm"
					/>
				</div>
				<div className="space-y-1.5">
					<Label className="text-xs">Icon</Label>
					<IconSelector
						value={btn.icon ?? ''}
						onChange={(icon) => set({icon})}
						placeholder="mdi:email"
					/>
				</div>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs">Action</Label>
				<div className="flex gap-2 flex-wrap">
					{(['contact', 'internal', 'external'] as BtnAction[]).map((a) => (
						<button
							key={a}
							type="button"
							onClick={() => handleActionChange(a)}
							className={`px-2.5 py-1 rounded text-xs border transition-colors ${
								actionType === a
									? 'border-slate-900 dark:border-slate-100 bg-slate-100 dark:bg-slate-800 font-medium'
									: 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
							}`}
						>
							{a === 'contact'
								? 'Scroll to Contact'
								: a === 'internal'
								? 'Internal Route'
								: 'External URL'}
						</button>
					))}
				</div>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs">Style</Label>
				<div className="flex gap-3 items-center">
					<button
						type="button"
						onClick={() => set({variant: 'primary'})}
						className={`px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-all ${
							(btn.variant ?? 'primary') === 'primary'
								? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white'
								: 'opacity-50 hover:opacity-80'
						}`}
					>
						Primary
					</button>
					<button
						type="button"
						onClick={() => set({variant: 'secondary'})}
						className={`px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-transparent transition-all ${
							btn.variant === 'secondary'
								? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500'
								: 'opacity-50 hover:opacity-80'
						}`}
					>
						Secondary
					</button>
				</div>
			</div>

			{actionType === 'internal' && (
				<div className="space-y-1.5">
					<Label className="text-xs">Route</Label>
					<select
						value={btn.to ?? '/'}
						onChange={(e) => set({to: e.target.value})}
						className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
					>
						{PUBLIC_ROUTES.map(({path, label}) => (
							<option key={path} value={path}>
								{label}
							</option>
						))}
					</select>
				</div>
			)}
			{actionType === 'external' && (
				<div className="space-y-1.5">
					<Label className="text-xs">URL</Label>
					<Input
						value={btn.href ?? ''}
						onChange={(e) => set({href: e.target.value})}
						placeholder="https://github.com/..."
						className="text-sm"
					/>
				</div>
			)}
		</div>
	);
}
