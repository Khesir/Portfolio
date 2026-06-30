import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {fetchRecommendationByID} from '@/app/api/recommendations';
import {
	cmsCreateRecommendation,
	cmsUpdateRecommendation,
	cmsDeleteRecommendation,
	CreateRecommendationDto,
} from '@/app/api/cms';
import {toast} from 'sonner';
import ConfirmDialog from '../components/ConfirmDialog';

const SOURCE_TYPES: Array<{value: CreateRecommendationDto['sourceType']; label: string}> = [
	{value: 'linkedin', label: 'LinkedIn'},
	{value: 'email', label: 'Email'},
	{value: 'other', label: 'Other'},
];

function relativeTime(date: Date): string {
	const diff = Math.floor((Date.now() - date.getTime()) / 1000);
	if (diff < 60) return 'just now';
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	return `${Math.floor(diff / 3600)}h ago`;
}

export default function CmsRecommendationEditor() {
	const {id} = useParams();
	const isEdit = Boolean(id);
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [role, setRole] = useState('');
	const [company, setCompany] = useState('');
	const [quote, setQuote] = useState('');
	const [sourceType, setSourceType] = useState<CreateRecommendationDto['sourceType']>('linkedin');
	const [sourceUrl, setSourceUrl] = useState('');
	const [featured, setFeatured] = useState(false);
	const [hidden, setHidden] = useState(false);
	const [saving, setSaving] = useState(false);
	const [loadingData, setLoadingData] = useState(isEdit);
	const [savedAt, setSavedAt] = useState<Date | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);

	useEffect(() => {
		if (!isEdit || !id) return;
		fetchRecommendationByID(id)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.then((res: any) => {
				setName(res?.name ?? '');
				setRole(res?.role ?? '');
				setCompany(res?.company ?? '');
				setQuote(res?.quote ?? '');
				setSourceType(res?.sourceType ?? 'linkedin');
				setSourceUrl(res?.sourceUrl ?? '');
				setFeatured(res?.featured ?? false);
				setHidden(res?.hidden ?? false);
			})
			.finally(() => setLoadingData(false));
	}, [id, isEdit]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			const payload: CreateRecommendationDto = {
				name,
				role,
				company,
				quote,
				sourceType,
				sourceUrl: sourceUrl || undefined,
				featured,
				hidden,
			};
			if (isEdit && id) {
				await cmsUpdateRecommendation(id, payload);
			} else {
				await cmsCreateRecommendation(payload);
			}
			toast.success(hidden ? 'Recommendation saved as hidden' : 'Recommendation saved');
			setSavedAt(new Date());
			navigate('/cms/recommendations');
		} catch {
			toast.error('Failed to save recommendation');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!id) return;
		try {
			await cmsDeleteRecommendation(id);
			toast.success('Recommendation deleted');
			navigate('/cms/recommendations');
		} catch {
			toast.error('Failed to delete recommendation');
		}
	};

	if (loadingData) return <p className="hint">Loading...</p>;

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">{isEdit ? 'Edit' : 'New'} Recommendation</h1>
					<div className="sub">aj@khesir:~$ {isEdit ? 'vim' : 'touch'} ./recommendations/{name ? name.toLowerCase().replace(/\s+/g, '-') : 'untitled'}</div>
				</div>
				{isEdit && (
					<button className="btn-ol" type="button" onClick={() => setConfirmOpen(true)}>Delete</button>
				)}
			</div>

			<form className="cms-form" onSubmit={handleSubmit}>
				<div className="fsection">
					<h2>Person</h2>
					<div className="frow">
						<div className="field">
							<label>Name</label>
							<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Maria Santos" required />
						</div>
						<div className="field">
							<label>Role</label>
							<input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Engineering Manager" required />
						</div>
					</div>
					<div className="frow">
						<div className="field">
							<label>Company</label>
							<input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Northwind" required />
						</div>
					</div>
				</div>

				<div className="fsection">
					<h2>Recommendation</h2>
					<div className="field">
						<label>Quote</label>
						<textarea
							value={quote}
							onChange={(e) => setQuote(e.target.value)}
							rows={5}
							placeholder="In their own words…"
							required
						/>
					</div>
				</div>

				<div className="fsection">
					<h2>Source</h2>
					<div className="frow">
						<div className="field">
							<label>Source Type</label>
							<select value={sourceType} onChange={(e) => setSourceType(e.target.value as CreateRecommendationDto['sourceType'])}>
								{SOURCE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
							</select>
						</div>
						<div className="field">
							<label>Source URL <span className="opt">optional</span></label>
							<input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
						</div>
					</div>
				</div>

				<div className="fsection">
					<h2>Visibility</h2>
					<div className="frow">
						<div className="field">
							<label style={{display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer'}}>
								<input
									type="checkbox"
									checked={featured}
									onChange={(e) => setFeatured(e.target.checked)}
									style={{width: 'auto'}}
								/>
								Featured — show on home page
							</label>
						</div>
						<div className="field">
							<label style={{display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer'}}>
								<input
									type="checkbox"
									checked={hidden}
									onChange={(e) => setHidden(e.target.checked)}
									style={{width: 'auto'}}
								/>
								Hidden — exclude from public page
							</label>
						</div>
					</div>
				</div>

				<div className="save-bar">
					<button className="btn-new" type="submit" disabled={saving}>
						{isEdit ? 'Save changes' : 'Create'}
					</button>
					{savedAt && <span className="hint">last saved {relativeTime(savedAt)}</span>}
				</div>
			</form>

			<ConfirmDialog
				open={confirmOpen}
				itemName={name}
				onConfirm={handleDelete}
				onCancel={() => setConfirmOpen(false)}
			/>
		</>
	);
}
