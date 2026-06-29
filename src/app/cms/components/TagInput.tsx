import {useState, KeyboardEvent} from 'react';

interface TagInputProps {
	value: string[];
	onChange: (tags: string[]) => void;
	placeholder?: string;
}

export default function TagInput({value, onChange, placeholder = 'Add tag, press Enter'}: TagInputProps) {
	const [input, setInput] = useState('');

	const add = () => {
		const trimmed = input.trim();
		if (trimmed && !value.includes(trimmed)) {
			onChange([...value, trimmed]);
		}
		setInput('');
	};

	const remove = (tag: string) => {
		onChange(value.filter((t) => t !== tag));
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			add();
		} else if (e.key === 'Backspace' && input === '' && value.length > 0) {
			onChange(value.slice(0, -1));
		}
	};

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
			<input
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={add}
				placeholder={placeholder}
				style={{
					background: 'rgba(255,255,255,.03)',
					border: '1px solid var(--line)',
					borderRadius: 9, padding: '10px 13px',
					fontFamily: 'var(--sans)', fontSize: 14,
					color: 'var(--ink)', outline: 'none', width: '100%',
				}}
			/>
			{value.length > 0 && (
				<div className="chips">
					{value.map((tag) => (
						<span key={tag} style={{
							display: 'inline-flex', alignItems: 'center', gap: 5,
							fontFamily: 'var(--mono)', fontSize: 11,
							color: 'var(--accent)',
							border: '1px solid rgba(var(--accent-rgb),.3)',
							borderRadius: 999, padding: '3px 10px',
						}}>
							{tag}
							<button
								type="button"
								onClick={() => remove(tag)}
								style={{
									background: 'none', border: 'none', cursor: 'pointer',
									color: 'var(--ink-4)', fontSize: 13, lineHeight: 1,
									padding: 0, marginLeft: 2,
								}}
								onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#f87171')}
								onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-4)')}
							>
								×
							</button>
						</span>
					))}
				</div>
			)}
		</div>
	);
}
