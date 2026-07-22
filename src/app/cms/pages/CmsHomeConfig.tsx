import {useEffect, useState} from 'react';
import type {Profile, SocialLink} from '@/data/profile';
import {
	fetchLocalSection,
	saveLocalSection,
	uploadLocalImage,
} from '@/app/api/cms-local';
import {toast} from 'sonner';
import ImageUpload from '../components/ImageUpload';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

const IS_DEV = import.meta.env.DEV;
const STATUS_OPTIONS = ['online', 'idle', 'dnd', 'custom'] as const;

function relativeTime(date: Date): string {
	const secs = Math.floor((Date.now() - date.getTime()) / 1000);
	if (secs < 60) return 'just now';
	if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
	return `${Math.floor(secs / 3600)}h ago`;
}

export default function CmsHomeConfig() {
	const [role, setRole] = useState('');
	const [bio, setBio] = useState('');
	const [location, setLocation] = useState('');
	const [contactEmail, setContactEmail] = useState('');
	const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
	const [status, setStatus] = useState('online');
	const [avatarSrc, setAvatarSrc] = useState('');
	const [saving, setSaving] = useState(false);
	const [savedAt, setSavedAt] = useState<Date | null>(null);

	useEffect(() => {
		fetchLocalSection<Profile>('profile').then((profile) => {
			setRole(profile.role);
			setBio(profile.bio);
			setLocation(profile.location);
			setContactEmail(profile.contactEmail);
			setSocialLinks(profile.socialLinks);
			setStatus(profile.status);
			setAvatarSrc(profile.avatarSrc);
		});
	}, []);

	const uploadImage = (file: File) =>
		uploadLocalImage('profile', 'profile', file);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			const data: Profile = {
				role,
				bio,
				location,
				contactEmail,
				socialLinks,
				status,
				avatarSrc,
			};
			await saveLocalSection('profile', data);
			setSavedAt(new Date());
			toast.success('Home config saved');
		} catch {
			toast.error('Failed to save home config');
		} finally {
			setSaving(false);
		}
	};

	const updateLink = (i: number, patch: Partial<SocialLink>) =>
		setSocialLinks((prev) =>
			prev.map((l, idx) => (idx === i ? {...l, ...patch} : l)),
		);
	const removeLink = (i: number) =>
		setSocialLinks((prev) => prev.filter((_, idx) => idx !== i));
	const addLink = () =>
		setSocialLinks((prev) => [...prev, {label: '', href: ''}]);

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">Home Config</h1>
					<div className="sub">aj@khesir:~$ vim ./data/profile.json</div>
				</div>
				<a className="btn-ol" href="/" target="_blank" rel="noreferrer">
					Preview ↗
				</a>
			</div>
			<LocalOnlyNotice />

			<form className="cms-form" onSubmit={handleSubmit}>
				<fieldset
					disabled={!IS_DEV}
					style={{border: 'none', padding: 0, margin: 0}}
				>
					<div className="fsection">
						<h2>Profile</h2>
						<div className="field">
							<label>Avatar</label>
							<ImageUpload
								value={avatarSrc}
								onChange={setAvatarSrc}
								uploadImage={uploadImage}
							/>
						</div>
						<div className="field">
							<label>Role</label>
							<input
								value={role}
								onChange={(e) => setRole(e.target.value)}
								placeholder="Software Developer | ..."
							/>
						</div>
						<div className="field">
							<label>Bio</label>
							<textarea value={bio} onChange={(e) => setBio(e.target.value)} />
						</div>
						<div className="field">
							<label>Location</label>
							<input
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								placeholder="Philippines · UTC+8"
							/>
						</div>
						<div className="field">
							<label htmlFor="home-status">Status</label>
							<select
								id="home-status"
								value={status}
								onChange={(e) => setStatus(e.target.value)}
							>
								{STATUS_OPTIONS.map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="fsection">
						<h2>Contact</h2>
						<div className="field">
							<label>Contact email</label>
							<input
								value={contactEmail}
								onChange={(e) => setContactEmail(e.target.value)}
								placeholder="you@example.com"
							/>
						</div>
						<div className="fhead" style={{marginTop: 16}}>
							<h3>Social links</h3>
							<button type="button" className="btn-ol" onClick={addLink}>
								Add link
							</button>
						</div>
						<div className="rep">
							{socialLinks.map((link, i) => (
								<div
									key={i}
									className="rep-row"
									style={{alignItems: 'flex-start'}}
								>
									<div className="rmain">
										<div className="frow">
											<div className="field">
												<label>Label</label>
												<input
													value={link.label}
													onChange={(e) =>
														updateLink(i, {label: e.target.value})
													}
													placeholder="GitHub"
												/>
											</div>
											<div className="field">
												<label>URL</label>
												<input
													value={link.href}
													onChange={(e) =>
														updateLink(i, {href: e.target.value})
													}
													placeholder="https://github.com/you"
												/>
											</div>
										</div>
									</div>
									<button
										type="button"
										className="rm"
										onClick={() => removeLink(i)}
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
				</fieldset>
			</form>
		</>
	);
}
