function FullscreenIcon({active}: {active: boolean}) {
	return active ? (
		<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M8 3v3a2 2 0 0 1-2 2H3" />
			<path d="M21 8h-3a2 2 0 0 1-2-2V3" />
			<path d="M3 16h3a2 2 0 0 1 2 2v3" />
			<path d="M16 21v-3a2 2 0 0 1 2-2h3" />
		</svg>
	) : (
		<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M8 3H5a2 2 0 0 0-2 2v3" />
			<path d="M16 3h3a2 2 0 0 1 2 2v3" />
			<path d="M3 16v3a2 2 0 0 0 2 2h3" />
			<path d="M21 16v3a2 2 0 0 1-2 2h-3" />
		</svg>
	);
}

interface FullscreenToggleProps {
	isFullscreen: boolean;
	onToggle: () => void;
}

export function FullscreenToggle({isFullscreen, onToggle}: FullscreenToggleProps) {
	return (
		<button
			type="button"
			className="dashboard-fullscreen-toggle"
			onClick={onToggle}
			aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
		>
			<FullscreenIcon active={isFullscreen} />
		</button>
	);
}
