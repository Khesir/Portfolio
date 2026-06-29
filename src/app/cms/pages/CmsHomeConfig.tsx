import {useEffect, useState} from 'react';
import {
	fetchHomeConfig,
	cmsUpdateHomeConfig,
	StatusType,
	StatusConfig,
	BannerButton,
	NeofetchRow,
	SocialLink,
} from '@/app/api/cms';
import {toast} from 'sonner';
import ImageUpload from '../components/ImageUpload';
import BannerButtonEditor from '../components/BannerButtonEditor';
import TagInput from '../components/TagInput';
import IconSelector from '../components/IconSelector';

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
	const [profileImageUrl, setProfileImageUrl] = useState('');
	const [bannerImageUrl, setBannerImageUrl] = useState('');
	const [heroButtons, setHeroButtons] = useState<BannerButton[]>([]);
	const [neofetchRows, setNeofetchRows] = useState<NeofetchRow[]>([]);
	const [location, setLocation] = useState('');
	const [tags, setTags] = useState<string[]>([]);
	const [selectedWorkCount, setSelectedWorkCount] = useState(3);
	const [writingCount, setWritingCount] = useState(3);
	const [contactHeading, setContactHeading] = useState('');
	const [contactSubtext, setContactSubtext] = useState('');
	const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
	const [footerCopyright, setFooterCopyright] = useState('');
	const [footerTagline, setFooterTagline] = useState('');
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
				setProfileImageUrl(data?.profileImageUrl ?? '');
				setBannerImageUrl(data?.bannerImageUrl ?? '');
				setHeroButtons(data?.heroButtons ?? []);
				setNeofetchRows(data?.neofetchRows ?? []);
				setLocation(data?.location ?? '');
				setTags(data?.tags ?? []);
				setSelectedWorkCount(data?.selectedWorkCount ?? 3);
				setWritingCount(data?.writingCount ?? 3);
				setContactHeading(data?.contactHeading ?? '');
				setContactSubtext(data?.contactSubtext ?? '');
				setSocialLinks(data?.socialLinks ?? []);
				setFooterCopyright(data?.footerCopyright ?? '');
				setFooterTagline(data?.footerTagline ?? '');
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
				profileImageUrl,
				bannerImageUrl,
				heroButtons,
				neofetchRows,
				location,
				tags,
				selectedWorkCount,
				writingCount,
				contactHeading,
				contactSubtext,
				socialLinks,
				footerCopyright,
				footerTagline,
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
		setHeroButtons((prev) => prev.map((x, j) => (j === i ? b : x)));
	const removeBtn = (i: number) =>
		setHeroButtons((prev) => prev.filter((_, j) => j !== i));
	const addBtn = () =>
		setHeroButtons((prev) => [...prev, {label: '', action: 'contact'}]);

	const updateRow = (i: number, patch: Partial<NeofetchRow>) =>
		setNeofetchRows((prev) => prev.map((x, j) => (j === i ? {...x, ...patch} : x)));
	const removeRow = (i: number) =>
		setNeofetchRows((prev) => prev.filter((_, j) => j !== i));
	const addRow = () =>
		setNeofetchRows((prev) => [...prev, {key: '', value: ''}]);

	const updateLink = (i: number, patch: Partial<SocialLink>) =>
		setSocialLinks((prev) => prev.map((x, j) => (j === i ? {...x, ...patch} : x)));
	const removeLink = (i: number) =>
		setSocialLinks((prev) => prev.filter((_, j) => j !== i));
	const addLink = () =>
		setSocialLinks((prev) => [...prev, {label: '', href: '', icon: ''}]);

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
					<div className="fhead">
						<h2>Hero Buttons</h2>
						<button type="button" className="btn-ol" onClick={addBtn}>
							Add button
						</button>
					</div>
					<div className="rep">
						{heroButtons.map((btn, i) => (
							<BannerButtonEditor
								key={i}
								btn={btn}
								index={i}
								onChange={updateBtn}
								onRemove={removeBtn}
							/>
						))}
					</div>
					<div className="frow" style={{marginTop: 16}}>
						<div className="field">
							<label>Location</label>
							<input
								type="text"
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								placeholder="Philippines · UTC+8"
							/>
						</div>
					</div>
					<div className="field" style={{marginTop: 8}}>
						<label>Tags</label>
						<TagInput
							value={tags}
							onChange={setTags}
							placeholder="Add tag, press Enter"
						/>
					</div>
					<div className="frow" style={{marginTop: 8}}>
						<div className="field">
							<label>Selected work preview count</label>
							<input
								type="number"
								min={1}
								value={selectedWorkCount}
								onChange={(e) => setSelectedWorkCount(Number(e.target.value))}
							/>
						</div>
						<div className="field">
							<label>Writing preview count</label>
							<input
								type="number"
								min={1}
								value={writingCount}
								onChange={(e) => setWritingCount(Number(e.target.value))}
							/>
						</div>
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
					<div className="field">
						<label>
							Banner image <span className="opt">optional</span>
						</label>
						<ImageUpload value={bannerImageUrl} onChange={setBannerImageUrl} />
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
						<h2>Neofetch</h2>
						<button type="button" className="btn-ol" onClick={addRow}>
							Add row
						</button>
					</div>
					<div className="rep">
						{neofetchRows.map((row, i) => (
							<div key={i} className="rep-row">
								<span className="grip">⠿</span>
								<div className="rmain">
									<div className="frow">
										<div className="field">
											<input
												type="text"
												value={row.key}
												onChange={(e) => updateRow(i, {key: e.target.value})}
												placeholder="Key (e.g. Role)"
											/>
										</div>
										<div className="field">
											<input
												type="text"
												value={row.value}
												onChange={(e) => updateRow(i, {value: e.target.value})}
												placeholder="Value (e.g. Full-Stack · Toolmaker)"
											/>
										</div>
									</div>
								</div>
								<button type="button" className="rm" onClick={() => removeRow(i)}>
									Remove
								</button>
							</div>
						))}
					</div>
				</div>

				<div className="fsection">
					<div className="fhead">
						<h2>Footer &amp; Contact</h2>
						<button type="button" className="btn-ol" onClick={addLink}>
							Add social link
						</button>
					</div>
					<div className="frow">
						<div className="field">
							<label>Contact heading</label>
							<input
								type="text"
								value={contactHeading}
								onChange={(e) => setContactHeading(e.target.value)}
								placeholder="Let's build something..."
							/>
						</div>
					</div>
					<div className="field">
						<label>Contact subtext</label>
						<input
							type="text"
							value={contactSubtext}
							onChange={(e) => setContactSubtext(e.target.value)}
							placeholder="Open for engineering work..."
						/>
					</div>
					<div className="rep" style={{marginTop: 8}}>
						{socialLinks.map((link, i) => (
							<div key={i} className="rep-row">
								<span className="grip">⠿</span>
								<div className="rmain">
									<div className="frow">
										<div className="field">
											<input
												type="text"
												value={link.label}
												onChange={(e) => updateLink(i, {label: e.target.value})}
												placeholder="Label (e.g. GitHub)"
											/>
										</div>
										<div className="field">
											<input
												type="text"
												value={link.href}
												onChange={(e) => updateLink(i, {href: e.target.value})}
												placeholder="https://..."
											/>
										</div>
										<div className="field">
											<IconSelector
												value={link.icon}
												onChange={(icon) => updateLink(i, {icon})}
											/>
										</div>
									</div>
								</div>
								<button type="button" className="rm" onClick={() => removeLink(i)}>
									Remove
								</button>
							</div>
						))}
					</div>
					<div className="frow" style={{marginTop: 16}}>
						<div className="field">
							<label>Footer copyright</label>
							<input
								type="text"
								value={footerCopyright}
								onChange={(e) => setFooterCopyright(e.target.value)}
								placeholder="© 2026 AJ — Khesir"
							/>
						</div>
						<div className="field">
							<label>Footer tagline</label>
							<input
								type="text"
								value={footerTagline}
								onChange={(e) => setFooterTagline(e.target.value)}
								placeholder='direction B — "Terminal" · tech-first'
							/>
						</div>
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
