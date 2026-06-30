import {useEffect, useState} from 'react';
import {Icon} from '@iconify/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

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
		<div style={{display: 'flex', alignItems: 'center', gap: 8}}>
			<div style={{
				width: 36, height: 36, flexShrink: 0,
				borderRadius: 9, border: '1px solid var(--line-2)',
				background: 'rgba(255,255,255,.03)',
				display: 'flex', alignItems: 'center', justifyContent: 'center',
			}}>
				{value
					? <Icon icon={value} style={{width: 20, height: 20, color: 'var(--ink)'}} />
					: <span style={{fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-4)'}}>?</span>
				}
			</div>

			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				style={{flex: 1, fontFamily: 'var(--mono)', fontSize: 13}}
			/>

			<button type="button" className="btn-ol" onClick={() => setOpen(true)}>
				Browse
			</button>

			<DialogPrimitive.Root open={open} onOpenChange={setOpen}>
				<DialogPrimitive.Portal>
					<DialogPrimitive.Overlay style={{
						position: 'fixed', inset: 0, zIndex: 50,
						background: 'rgba(0,0,0,0.7)',
					}} />
					<DialogPrimitive.Content style={{
						position: 'fixed', left: '50%', top: '50%', zIndex: 51,
						transform: 'translate(-50%, -50%)',
						width: 480, maxWidth: '94vw',
						background: 'var(--panel)',
						border: '1px solid var(--line-2)',
						borderRadius: 'var(--radius-sm)',
						padding: 24,
						display: 'flex', flexDirection: 'column', gap: 16,
						boxShadow: 'var(--shadow-lg)',
					}}>
						<DialogPrimitive.Title style={{
							fontFamily: 'var(--mono)', fontSize: 11,
							letterSpacing: '.14em', textTransform: 'uppercase',
							color: 'var(--accent)', marginBottom: 0,
						}}>
							Select Icon
						</DialogPrimitive.Title>

						<input
							autoFocus
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search — e.g. server, react, gamepad"
							style={{
								background: 'rgba(255,255,255,.03)',
								border: '1px solid var(--line)',
								borderRadius: 9, padding: '10px 13px',
								fontFamily: 'var(--mono)', fontSize: 13,
								color: 'var(--ink)', outline: 'none', width: '100%',
							}}
							onFocus={(e) => (e.target.style.borderColor = 'rgba(var(--accent-rgb),.45)')}
							onBlur={(e) => (e.target.style.borderColor = 'var(--line)')}
						/>

						{searching && (
							<p style={{fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-4)', textAlign: 'center', padding: '16px 0'}}>
								Searching...
							</p>
						)}

						{!searching && !query && (
							<p style={{fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-4)', textAlign: 'center', padding: '16px 0'}}>
								Type to search the Iconify library (500k+ icons).
							</p>
						)}

						{!searching && query && results.length === 0 && (
							<p style={{fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-4)', textAlign: 'center', padding: '16px 0'}}>
								No results for &ldquo;{query}&rdquo;
							</p>
						)}

						{results.length > 0 && (
							<div style={{
								display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
								gap: 6, maxHeight: 300, overflowY: 'auto',
							}}>
								{results.map((icon) => (
									<button
										key={icon}
										type="button"
										onClick={() => select(icon)}
										title={icon}
										style={{
											padding: '10px 0',
											borderRadius: 9,
											border: value === icon
												? '1px solid rgba(var(--accent-rgb),.5)'
												: '1px solid transparent',
											background: value === icon
												? 'rgba(var(--accent-rgb),.1)'
												: 'rgba(255,255,255,.02)',
											cursor: 'pointer',
											display: 'flex', alignItems: 'center', justifyContent: 'center',
											transition: 'background .12s, border-color .12s',
										}}
										onMouseEnter={(e) => {
											if (value !== icon) {
												(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.06)';
											}
										}}
										onMouseLeave={(e) => {
											if (value !== icon) {
												(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.02)';
											}
										}}
									>
										<Icon icon={icon} style={{width: 24, height: 24, color: 'var(--ink-2)'}} />
									</button>
								))}
							</div>
						)}

						{value && (
							<div style={{
								display: 'flex', alignItems: 'center', gap: 8,
								paddingTop: 12, borderTop: '1px solid var(--line)',
								fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-4)',
							}}>
								<Icon icon={value} style={{width: 16, height: 16}} />
								<span>{value}</span>
							</div>
						)}

						<DialogPrimitive.Close style={{
							position: 'absolute', top: 14, right: 14,
							background: 'none', border: 'none', cursor: 'pointer',
							color: 'var(--ink-4)', padding: 4, borderRadius: 6,
							fontFamily: 'var(--mono)', fontSize: 16, lineHeight: 1,
						}}>
							✕
						</DialogPrimitive.Close>
					</DialogPrimitive.Content>
				</DialogPrimitive.Portal>
			</DialogPrimitive.Root>
		</div>
	);
}
