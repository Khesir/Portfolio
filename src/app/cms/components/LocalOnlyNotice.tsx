const IS_DEV = import.meta.env.DEV;

export default function LocalOnlyNotice() {
	if (IS_DEV) return null;
	return (
		<div
			style={{
				border: '1px solid var(--line)',
				borderRadius: 'var(--radius-sm)',
				background: 'rgba(255,180,0,.06)',
				color: 'var(--ink-3)',
				fontFamily: 'var(--mono)',
				fontSize: 12,
				padding: '10px 14px',
				marginBottom: 16,
			}}
		>
			Read-only here — this content is edited by writing straight to the JSON
			file on disk, which only works while running the site locally with{' '}
			<code>npm run dev</code>.
		</div>
	);
}
