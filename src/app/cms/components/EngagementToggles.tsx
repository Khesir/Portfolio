interface EngagementTogglesProps {
	hideViews: boolean;
	hideHearts: boolean;
	onChangeViews: (v: boolean) => void;
	onChangeHearts: (v: boolean) => void;
}

function ToggleSwitch({
	label,
	checked,
	onChange,
}: {
	label: string;
	checked: boolean;
	onChange: (v: boolean) => void;
}) {
	return (
		<label className="flex items-center gap-2 cursor-pointer select-none">
			<span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
			<button
				type="button"
				role="switch"
				aria-checked={checked}
				onClick={() => onChange(!checked)}
				className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
					checked ? 'bg-slate-800 dark:bg-slate-300' : 'bg-slate-200 dark:bg-slate-700'
				}`}
			>
				<span
					className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 shadow transition-transform duration-200 ${
						checked ? 'translate-x-4' : 'translate-x-0'
					}`}
				/>
			</button>
		</label>
	);
}

export default function EngagementToggles({
	hideViews,
	hideHearts,
	onChangeViews,
	onChangeHearts,
}: EngagementTogglesProps) {
	return (
		<div className="flex items-center gap-4">
			<ToggleSwitch label="Hide views" checked={hideViews} onChange={onChangeViews} />
			<ToggleSwitch label="Hide hearts" checked={hideHearts} onChange={onChangeHearts} />
		</div>
	);
}
