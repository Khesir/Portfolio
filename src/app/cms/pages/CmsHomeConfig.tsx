import {useEffect, useState} from 'react';
import {
	fetchHomeConfig,
	cmsUpdateHomeConfig,
	StatusType,
	StatusConfig,
	BannerButton,
	LanguageEntry,
} from '@/app/api/cms';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Separator} from '@/components/ui/separator';
import {Icon} from '@iconify/react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {toast} from 'sonner';
import IconSelector from '../components/IconSelector';
import ImageUpload from '../components/ImageUpload';
import BannerButtonEditor from '../components/BannerButtonEditor';
import {iconLabel, getStatusStyle} from '@/hooks/use-home-config';

// --- Status selector ---

const STATUS_OPTIONS: {type: StatusType; label: string; dot: string}[] = [
	{type: 'online', label: 'Online', dot: 'bg-green-500'},
	{type: 'idle', label: 'Idle', dot: 'bg-yellow-400'},
	{type: 'dnd', label: 'Do Not Disturb', dot: 'bg-red-500'},
	{type: 'custom', label: 'Custom', dot: 'bg-slate-400'},
];

function StatusSelector({
	value,
	onChange,
}: {
	value: StatusConfig;
	onChange: (s: StatusConfig) => void;
}) {
	return (
		<div className="space-y-3">
			<div className="flex gap-2 flex-wrap">
				{STATUS_OPTIONS.map(({type, label, dot}) => (
					<button
						key={type}
						type="button"
						onClick={() => onChange({...value, type})}
						className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
							value.type === type
								? 'border-slate-900 dark:border-slate-100 bg-slate-100 dark:bg-slate-800 font-medium'
								: 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
						}`}
					>
						<span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
						{label}
					</button>
				))}
			</div>

			{value.type === 'custom' && (
				<div className="grid grid-cols-2 gap-3 pl-1">
					<div className="space-y-1.5">
						<Label className="text-xs">Emoji</Label>
						<Input
							value={value.emoji ?? ''}
							onChange={(e) => onChange({...value, emoji: e.target.value})}
							placeholder="💬"
							className="text-sm"
						/>
					</div>
					<div className="space-y-1.5">
						<Label className="text-xs">Message</Label>
						<Input
							value={value.message ?? ''}
							onChange={(e) => onChange({...value, message: e.target.value})}
							placeholder="Working on something cool..."
							className="text-sm"
						/>
					</div>
				</div>
			)}

			{value.type !== 'custom' && (
				<div className="pl-1 space-y-1.5">
					<Label className="text-xs">
						Custom message{' '}
						<span className="text-slate-400 font-normal">optional</span>
					</Label>
					<Input
						value={value.message ?? ''}
						onChange={(e) => onChange({...value, message: e.target.value})}
						placeholder="Available for work..."
						className="text-sm"
					/>
				</div>
			)}
		</div>
	);
}

// --- Preview ---

function HomePreview({
	name,
	role,
	description,
	status,
	languages,
	profileImageUrl,
	bannerImageUrl,
	bannerTitle,
	bannerSubtitle,
	bannerButtons,
}: {
	name: string;
	role: string;
	description: string;
	status: StatusConfig;
	languages: LanguageEntry[];
	profileImageUrl: string;
	bannerImageUrl: string;
	bannerTitle: string;
	bannerSubtitle: string;
	bannerButtons: BannerButton[];
}) {
	const style = getStatusStyle(status.type);

	return (
		<div className="space-y-4 p-1">
			{/* Profile card */}
			<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden space-y-3">
				{bannerImageUrl && (
					<div className="h-16 w-full overflow-hidden">
						<img
							src={bannerImageUrl}
							alt="Banner"
							className="w-full h-full object-cover"
						/>
					</div>
				)}
				<div className="px-4 pb-4 space-y-2">
					<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-2">
						Profile Card
					</p>
					<div className="flex items-center gap-2">
						<img
							src={profileImageUrl || '/img/profile2.jpg'}
							alt="Profile"
							className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
						/>
						<p className="font-bold text-base text-slate-900 dark:text-white">
							{name || 'Your Name'}
						</p>
					</div>
					{role && (
						<p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
							{role}
						</p>
					)}
					{description && (
						<p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
							{description}
						</p>
					)}
					{languages.length > 0 && (
						<div className="flex flex-wrap gap-1.5 pt-1">
							{languages.map((entry, i) => (
								<div
									key={i}
									className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md"
								>
									{entry.icon && (
										<Icon icon={entry.icon} className="w-3.5 h-3.5" />
									)}
									<span className="text-xs">
										{entry.label || iconLabel(entry.icon)}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Availabanner */}
			<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
				<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
					Availabanner
				</p>

				{/* Status badge */}
				<div
					className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium ${style.pill}`}
				>
					{status.type === 'custom' && status.emoji ? (
						<span>{status.emoji}</span>
					) : (
						<span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
					)}
					<span>
						{status.type === 'custom'
							? status.message || 'Custom Status'
							: status.message || style.text}
					</span>
				</div>

				{bannerTitle && (
					<p className="font-bold text-sm text-slate-900 dark:text-white">
						{bannerTitle}
					</p>
				)}
				{bannerSubtitle && (
					<p className="text-xs text-slate-500">{bannerSubtitle}</p>
				)}

				{bannerButtons.length > 0 && (
					<div className="flex flex-wrap gap-2 pt-1">
						{bannerButtons.map((btn, i) => (
							<div
								key={i}
								className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
									(btn.variant ?? 'primary') === 'secondary'
										? 'bg-transparent border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
										: 'bg-slate-900 dark:bg-white border-transparent text-white dark:text-slate-900'
								}`}
							>
								{btn.icon && <Icon icon={btn.icon} className="w-3 h-3" />}
								{btn.label}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

// --- Page ---

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
	const [previewOpen, setPreviewOpen] = useState(false);

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

	if (loading) return <p className="text-slate-400 text-sm">Loading...</p>;

	return (
		<>
			<div>
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-semibold">Home Config</h1>
					<Button
						type="button"
						variant="outline"
						onClick={() => setPreviewOpen(true)}
					>
						Preview
					</Button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-8">
					{/* Availabanner */}
					<section className="space-y-4">
						<h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
							Availabanner
						</h2>
						<div className="space-y-1.5">
							<Label>
								Banner Image{' '}
								<span className="text-slate-400 font-normal text-xs">
									optional — falls back to default
								</span>
							</Label>
							<ImageUpload
								value={bannerImageUrl}
								onChange={setBannerImageUrl}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<Label>Title</Label>
								<Input
									value={bannerTitle}
									onChange={(e) => setBannerTitle(e.target.value)}
									placeholder="Open for Freelance & Collaborations"
								/>
							</div>
							<div className="space-y-1.5">
								<Label>Subtitle</Label>
								<Input
									value={bannerSubtitle}
									onChange={(e) => setBannerSubtitle(e.target.value)}
									placeholder="Let's work together..."
								/>
							</div>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label>Buttons</Label>
								<Button type="button" variant="outline" onClick={addBtn}>
									Add Button
								</Button>
							</div>
							{bannerButtons.length === 0 && (
								<p className="text-sm text-slate-400">No buttons yet.</p>
							)}
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
					</section>

					<Separator />

					{/* Status */}
					<section className="space-y-4">
						<h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
							Status
						</h2>
						<StatusSelector value={status} onChange={setStatus} />
					</section>

					<Separator />

					{/* Profile */}
					<section className="space-y-4">
						<h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
							Profile
						</h2>
						<div className="space-y-1.5">
							<Label>
								Profile Image{' '}
								<span className="text-slate-400 font-normal text-xs">
									optional — falls back to default
								</span>
							</Label>
							<ImageUpload
								value={profileImageUrl}
								onChange={setProfileImageUrl}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<Label>Name</Label>
								<Input
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Khesir (AJ)"
								/>
							</div>
							<div className="space-y-1.5">
								<Label>Role</Label>
								<Input
									value={role}
									onChange={(e) => setRole(e.target.value)}
									placeholder="Software Engineer"
								/>
							</div>
						</div>
						<div className="space-y-1.5">
							<Label>Contact Email</Label>
							<Input
								type="email"
								value={contactEmail}
								onChange={(e) => setContactEmail(e.target.value)}
								placeholder="contact@example.com"
							/>
						</div>
						<div className="space-y-1.5">
							<Label>
								Short Description{' '}
								<span className="text-slate-400 font-normal text-xs">
									line breaks are preserved
								</span>
							</Label>
							<Textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="min-h-28 resize-y"
								placeholder={
									'I build scalable systems...\n\nPassionate about clean architecture.'
								}
							/>
						</div>
					</section>

					<Separator />

					{/* Languages */}
					<section className="space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
								Languages / Tech Stack
							</h2>
							<Button type="button" variant="outline" onClick={addLang}>
								Add Language
							</Button>
						</div>
						{languages.length === 0 && (
							<p className="text-sm text-slate-400">No languages yet.</p>
						)}
						<div className="space-y-2">
							{languages.map((entry, i) => (
								<div key={i} className="flex items-center gap-2">
									<div className="flex-1">
										<IconSelector
											value={entry.icon}
											onChange={(icon) => updateLang(i, {icon})}
										/>
									</div>
									<Input
										value={entry.label ?? ''}
										onChange={(e) => updateLang(i, {label: e.target.value})}
										placeholder={iconLabel(entry.icon) || 'Display name'}
										className="w-36 text-sm shrink-0"
									/>
									<button
										type="button"
										onClick={() => removeLang(i)}
										className="text-xs text-red-400 hover:text-red-600 shrink-0"
									>
										Remove
									</button>
								</div>
							))}
						</div>
					</section>

					<div className="pt-2">
						<Button type="submit" disabled={saving}>
							{saving ? 'Saving...' : 'Save Home Config'}
						</Button>
					</div>
				</form>
			</div>

			{/* Preview Dialog */}
			<Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
				<DialogContent
					className="overflow-auto resize max-w-none max-h-[90vh]"
					style={{width: 540, minWidth: 400, minHeight: 340}}
				>
					<DialogHeader>
						<DialogTitle>Home Page Preview</DialogTitle>
					</DialogHeader>
					<HomePreview
						name={name}
						role={role}
						description={description}
						status={status}
						languages={languages}
						profileImageUrl={profileImageUrl}
						bannerImageUrl={bannerImageUrl}
						bannerTitle={bannerTitle}
						bannerSubtitle={bannerSubtitle}
						bannerButtons={bannerButtons}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}
