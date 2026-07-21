function FlipIcon() {
	return (
		<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M17 2.1l4 4-4 4" />
			<path d="M3 12.6v-2a4 4 0 0 1 4-4h14" />
			<path d="M7 21.9l-4-4 4-4" />
			<path d="M21 11.4v2a4 4 0 0 1-4 4H3" />
		</svg>
	);
}

interface FlipCardToggleProps {
	isFlipped: boolean;
	disabled: boolean;
	onToggle: () => void;
}

export function FlipCardToggle({isFlipped, disabled, onToggle}: FlipCardToggleProps) {
	return (
		<button
			type="button"
			className="dashboard-flip-toggle"
			onClick={onToggle}
			disabled={disabled}
			aria-label={isFlipped ? 'Show front of card' : 'Show back of card'}
		>
			<FlipIcon />
		</button>
	);
}
