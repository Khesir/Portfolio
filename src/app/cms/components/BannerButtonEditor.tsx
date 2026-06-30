import {useState} from 'react';
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
	{path: '/work', label: 'Work'},
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
		<div className="rep-row" style={{alignItems: 'flex-start', flexDirection: 'column', gap: 12}}>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
				<span style={{fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-4)'}}>Button {index + 1}</span>
				<button type="button" className="rm" onClick={() => onRemove(index)}>Remove</button>
			</div>

			<div className="frow" style={{width: '100%'}}>
				<div className="field" style={{marginBottom: 0}}>
					<label>Label</label>
					<input
						type="text"
						value={btn.label}
						onChange={(e) => set({label: e.target.value})}
						placeholder="Contact Me"
					/>
				</div>
				<div className="field" style={{marginBottom: 0}}>
					<label>Icon</label>
					<IconSelector
						value={btn.icon ?? ''}
						onChange={(icon) => set({icon})}
						placeholder="mdi:email"
					/>
				</div>
			</div>

			<div className="field" style={{width: '100%', marginBottom: 0}}>
				<label>Action</label>
				<div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>
					{(['contact', 'internal', 'external'] as BtnAction[]).map((a) => (
						<button
							key={a}
							type="button"
							className={actionType === a ? 'btn-new' : 'btn-ol'}
							style={{padding: '6px 14px', fontSize: 12}}
							onClick={() => handleActionChange(a)}
						>
							{a === 'contact' ? 'Scroll to Contact' : a === 'internal' ? 'Internal Route' : 'External URL'}
						</button>
					))}
				</div>
			</div>

			<div className="field" style={{width: '100%', marginBottom: 0}}>
				<label>Style</label>
				<div style={{display: 'flex', gap: 6}}>
					<button
						type="button"
						className={(btn.variant ?? 'primary') === 'primary' ? 'btn-new' : 'btn-ol'}
						onClick={() => set({variant: 'primary'})}
					>
						Primary
					</button>
					<button
						type="button"
						className={btn.variant === 'secondary' ? 'btn-new' : 'btn-ol'}
						onClick={() => set({variant: 'secondary'})}
					>
						Secondary
					</button>
				</div>
			</div>

			{actionType === 'internal' && (
				<div className="field" style={{width: '100%', marginBottom: 0}}>
					<label>Route</label>
					<select
						value={btn.to ?? '/'}
						onChange={(e) => set({to: e.target.value})}
					>
						{PUBLIC_ROUTES.map(({path, label}) => (
							<option key={path} value={path}>{label}</option>
						))}
					</select>
				</div>
			)}

			{actionType === 'external' && (
				<div className="field" style={{width: '100%', marginBottom: 0}}>
					<label>URL</label>
					<input
						type="text"
						value={btn.href ?? ''}
						onChange={(e) => set({href: e.target.value})}
						placeholder="https://github.com/..."
					/>
				</div>
			)}
		</div>
	);
}
