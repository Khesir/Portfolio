import {useEffect, useState} from 'react';
import {
	fetchHomeConfig,
	cmsUpdateHomeConfig,
	StatusType,
	StatusConfig,
	BannerButton,
	LanguageEntry,
} from '@/app/api/cms';
import {toast} from 'sonner';
import IconSelector from '../components/IconSelector';
import ImageUpload from '../components/ImageUpload';
import BannerButtonEditor from '../components/BannerButtonEditor';
import {iconLabel} from '@/hooks/use-home-config';

const STATUS_OPTIONS: {type: StatusType; label: string; color: string}[] = [
	{type: 'online', label: 'Online', color: '#4ade80'},
	{type: 'idle', label: 'Idle', color: '#facc15'},
	{type: 'dnd', label: 'Do Not Disturb', color: '#f87171'},
	{type: 'custom', label: 'Custom', color: '#94a3b8'},
];

function relativeTime(date: Date): string {
	const secs = Math.floor((Date.now() - date.getTime()) / 1000);
	if (secs < 60) return 'just now';
	if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
	return `${Math.floor(secs / 3600)}h ago`;
}

export default function CmsHomeConfig() {
	const [name, setName] = useState('');
	const [role, setRole] = useState('');
	const [contactEmail, setContactEmail] = useState('');
	const [description, setDescription] = useState('');
	const [status, setStatus] = useState<StatusConfig>({type: 'online'});
	const [languages, setLanguages] = useState<LanguageEntry[]>([]);
	const [profileImageUrl, setProfileImageUrl] = useState('');
	const [bannerImageUrl, setBannerImageUrl] = useState('');
	const [bannerTitle, setBannerTitle] = useState('');
	const [bannerSubtitle, setBannerSubtitle] = useState('');
	const [bannerButtons, setBannerButtons] = useState<BannerButton[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [savedAt, setSavedAt] = useState<Date | null>(null);

	useEffect(() => {
		fetchHomeConfig()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.then((data: any) => {
				setName(data?.name ?? '');
				setRole(data?.role ?? '');
				setContactEmail(data?.contactEmail ?? '');
				setDescription(data?.description ?? '');
				setStatus(data?.status ?? {type: 'online'});
				setLanguages(data?.languages ?? []);
				setProfileImageUrl(data?.profileImageUrl ?? '');
				setBannerImageUrl(data?.bannerImageUrl ?? '');
				setBannerTitle(data?.bannerTitle ?? '');
				setBannerSubtitle(data?.bannerSubtitle ?? '');
				setBannerButtons(data?.bannerButtons ?? []);
			})
			.catch(() => toast.error('Failed to load config'))
			.finally(() => setLoading(false));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			await cmsUpdateHomeConfig({
				name,
				role,
				contactEmail,
				description,
				status,
				languages,
				profileImageUrl,
				bannerImageUrl,
				bannerTitle,
				bannerSubtitle,
				bannerButtons,
			});
			setSavedAt(new Date());
			toast.success('Home config saved');
		} catch {
			toast.error('Failed to save config');
		} finally {
			setSaving(false);
		}
	};

	const updateBtn = (i: number, b: BannerButton) =>
		setBannerButtons((prev) => prev.map((x, j) => (j === i ? b : x)));
	const removeBtn = (i: number) =>
		setBannerButtons((prev) => prev.filter((_, j) => j !== i));
	const addBtn = () =>
		setBannerButtons((prev) => [...prev, {label: '', action: 'contact'}]);

	const updateLang = (i: number, patch: Partial<LanguageEntry>) =>
		setLanguages((prev) =>
			prev.map((x, j) => (j === i ? {...x, ...patch} : x)),
		);
	const removeLang = (i: number) =>
		setLanguages((prev) => prev.filter((_, j) => j !== i));
	const addLang = () =>
		setLanguages((prev) => [...prev, {icon: '', label: ''}]);

	if (loading) return <p>Loading...</p>;

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">Home Config</h1>
					<div className="sub">aj@khesir:~$ vim ./pages/home.json</div>
				</div>
				<a className="btn-ol" href="/" target="_blank" rel="noreferrer">
					Preview ↗
				</a>
			</div>

			<form className="cms-form" onSubmit={handleSubmit}>
				<div className="fsection">
					<h2>Availability Banner</h2>
					<div className="field">
						<label>
							Banner image <span className="opt">optional</span>
						</label>
						<ImageUpload value={bannerImageUrl} onChange={setBannerImageUrl} />
					</div>
					<div className="frow">
						<div className="field">
							<label>Title</label>
							<input
								type="text"
								value={bannerTitle}
								onChange={(e) => setBannerTitle(e.target.value)}
								placeholder="Open for Freelance & Collaborations"
							/>
						</div>
						<div className="field">
							<label>Subtitle</label>
							<input
								type="text"
								value={bannerSubtitle}
								onChange={(e) => setBannerSubtitle(e.target.value)}
								placeholder="Let's work together..."
							/>
						</div>
					</div>
					<div className="fhead">
						<label>Buttons</label>
						<button type="button" className="btn-ol" onClick={addBtn}>
							Add button
						</button>
					</div>
					<div className="rep">
						{bannerButtons.map((btn, i) => (
							<BannerButtonEditor
								key={i}
								btn={btn}
								index={i}
								onChange={updateBtn}
								onRemove={removeBtn}
							/>
						))}
					</div>
				</div>

				<div className="fsection">
					<h2>Status</h2>
					<div className="status-pills">
						{STATUS_OPTIONS.map(({type, label, color}) => (
							<button
								key={type}
								type="button"
								className={status.type === type ? 'sp on' : 'sp'}
								onClick={() => setStatus({...status, type})}
							>
								<span className="d" style={{background: color}} />
								{label}
							</button>
						))}
					</div>
					<div className="field" style={{marginTop: 16}}>
						<label>
							Custom message <span className="opt">optional</span>
						</label>
						<input
							type="text"
							value={status.message ?? ''}
							onChange={(e) => setStatus({...status, message: e.target.value})}
							placeholder="Available for work..."
						/>
					</div>
				</div>

				<div className="fsection">
					<h2>Profile</h2>
					<div className="field">
						<label>Profile image</label>
						<ImageUpload value={profileImageUrl} onChange={setProfileImageUrl} />
					</div>
					<div className="frow">
						<div className="field">
							<label>Name</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Khesir (AJ)"
							/>
						</div>
						<div className="field">
							<label>Role</label>
							<input
								type="text"
								value={role}
								onChange={(e) => setRole(e.target.value)}
								placeholder="Software Engineer"
							/>
						</div>
					</div>
					<div className="field">
						<label>Contact email</label>
						<input
							type="email"
							value={contactEmail}
							onChange={(e) => setContactEmail(e.target.value)}
							placeholder="contact@example.com"
						/>
					</div>
					<div className="field">
						<label>Short description</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder={
								'I build scalable systems...\n\nPassionate about clean architecture.'
							}
						/>
					</div>
				</div>

				<div className="fsection">
					<div className="fhead">
						<h2>Languages / Tech Stack</h2>
						<button type="button" className="btn-ol" onClick={addLang}>
							Add language
						</button>
					</div>
					<div className="rep">
						{languages.map((entry, i) => (
							<div key={i} className="rep-row">
								<span className="grip">⠿</span>
								<div className="ico">
									{entry.label ||
										iconLabel(entry.icon) ||
										entry.icon.split(':').pop()?.slice(0, 3) ||
										'?'}
								</div>
								<div className="rmain">
									<div className="field">
										<IconSelector
											value={entry.icon}
											onChange={(icon) => updateLang(i, {icon})}
										/>
									</div>
									<div className="field">
										<input
											type="text"
											value={entry.label ?? ''}
											onChange={(e) =>
												updateLang(i, {label: e.target.value})
											}
											placeholder={iconLabel(entry.icon) || 'Display name'}
										/>
									</div>
								</div>
								<button
									type="button"
									className="rm"
									onClick={() => removeLang(i)}
								>
									Remove
								</button>
							</div>
						))}
					</div>
				</div>

				<div className="save-bar">
					<button className="btn-new" type="submit" disabled={saving}>
						{saving ? 'Saving...' : 'Save home config'}
					</button>
					{savedAt && (
						<span className="hint">last saved {relativeTime(savedAt)}</span>
					)}
				</div>
			</form>
		</>
	);
}
