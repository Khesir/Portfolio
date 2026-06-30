import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {fetchCertificationByID} from '@/app/api/certifications';
import {
	cmsCreateCertification,
	cmsUpdateCertification,
	cmsDeleteCertification,
	CreateCertificationDto,
} from '@/app/api/cms';
import {toast} from 'sonner';
import DraftToggle from '../components/DraftToggle';
import ConfirmDialog from '../components/ConfirmDialog';
import IconSelector from '../components/IconSelector';

const CATEGORY_SUGGESTIONS = ['Cloud', 'AI / ML', 'Engineering', 'DevOps', 'Backend', 'Game'];

const PROOF_TYPES: Array<{value: CreateCertificationDto['proofType']; label: string}> = [
	{value: 'link', label: 'External link (credential URL)'},
	{value: 'image', label: 'Image (certificate scan)'},
];

function relativeTime(date: Date): string {
	const diff = Math.floor((Date.now() - date.getTime()) / 1000);
	if (diff < 60) return 'just now';
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	return `${Math.floor(diff / 3600)}h ago`;
}

export default function CmsCertificationEditor() {
	const {id} = useParams();
	const isEdit = Boolean(id);
	const navigate = useNavigate();

	const [title, setTitle] = useState('');
	const [issuer, setIssuer] = useState('');
	const [category, setCategory] = useState('Cloud');
	const [issuedDate, setIssuedDate] = useState('');
	const [credentialId, setCredentialId] = useState('');
	const [description, setDescription] = useState('');
	const [proofUrl, setProofUrl] = useState('');
	const [proofType, setProofType] = useState<CreateCertificationDto['proofType']>('link');
	const [icon, setIcon] = useState('mdi:certificate');
	const [draft, setDraft] = useState(true);
	const [saving, setSaving] = useState(false);
	const [loadingData, setLoadingData] = useState(isEdit);
	const [savedAt, setSavedAt] = useState<Date | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);

	useEffect(() => {
		if (!isEdit || !id) return;
		fetchCertificationByID(id)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.then((res: any) => {
				setTitle(res?.title ?? '');
				setIssuer(res?.issuer ?? '');
				setCategory(res?.category ?? 'Cloud');
				setIssuedDate(res?.issuedDate ?? '');
				setCredentialId(res?.credentialId ?? '');
				setDescription(res?.description ?? '');
				setProofUrl(res?.proofUrl ?? '');
				setProofType(res?.proofType ?? 'link');
				setIcon(res?.icon ?? 'mdi:certificate');
				setDraft(res?.draft ?? false);
			})
			.finally(() => setLoadingData(false));
	}, [id, isEdit]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			const payload: CreateCertificationDto = {
				title,
				issuer,
				category,
				issuedDate,
				credentialId: credentialId || undefined,
				description: description || undefined,
				proofUrl: proofUrl || undefined,
				proofType,
				icon: icon || undefined,
				draft,
			};
			if (isEdit && id) {
				await cmsUpdateCertification(id, payload);
			} else {
				await cmsCreateCertification(payload);
			}
			toast.success(draft ? 'Certification saved as draft' : 'Certification published');
			setSavedAt(new Date());
			navigate('/cms/certifications');
		} catch {
			toast.error('Failed to save certification');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!id) return;
		try {
			await cmsDeleteCertification(id);
			toast.success('Certification deleted');
			navigate('/cms/certifications');
		} catch {
			toast.error('Failed to delete certification');
		}
	};

	if (loadingData) return <p className="hint">Loading...</p>;

	const slug = title ? title.toLowerCase().replace(/\s+/g, '-') : 'untitled';

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">{isEdit ? 'Edit' : 'New'} Certification</h1>
					<div className="sub">aj@khesir:~$ {isEdit ? 'vim' : 'touch'} ./certifications/{slug}</div>
				</div>
				{isEdit && (
					<button className="btn-ol" type="button" onClick={() => setConfirmOpen(true)}>Delete</button>
				)}
			</div>

			<form className="cms-form" onSubmit={handleSubmit}>
				<div className="fsection">
					<h2>Certification</h2>
					<div className="frow">
						<div className="field">
							<label>Title</label>
							<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="AWS Solutions Architect — Associate" required />
						</div>
						<div className="field">
							<label>Issuer</label>
							<input value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="Amazon Web Services" required />
						</div>
					</div>
					<div className="frow">
						<div className="field">
							<label>Category</label>
							<input
								list="cert-categories"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								placeholder="e.g. Cloud"
							/>
							<datalist id="cert-categories">
								{CATEGORY_SUGGESTIONS.map((c) => <option key={c} value={c} />)}
							</datalist>
						</div>
						<div className="field">
							<label>Issued Date</label>
							<input value={issuedDate} onChange={(e) => setIssuedDate(e.target.value)} placeholder="2025" required />
						</div>
					</div>
					<div className="frow">
						<div className="field">
							<label>Credential ID <span className="opt">optional</span></label>
							<input value={credentialId} onChange={(e) => setCredentialId(e.target.value)} placeholder="AWS-SAA-26" />
						</div>
					</div>
				</div>

				<div className="fsection">
					<h2>Icon</h2>
					<div className="field">
						<label>Iconify icon ID</label>
						<IconSelector value={icon} onChange={setIcon} />
					</div>
				</div>

				<div className="fsection">
					<h2>Description</h2>
					<div className="field">
						<label>Short description <span className="opt">optional</span></label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
							placeholder="Brief description of what this certification covers…"
						/>
					</div>
				</div>

				<div className="fsection">
					<h2>Proof</h2>
					<div className="frow">
						<div className="field">
							<label>Proof URL <span className="opt">optional</span></label>
							<input value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} placeholder="https://..." />
						</div>
						<div className="field">
							<label>Proof Type</label>
							<select value={proofType} onChange={(e) => setProofType(e.target.value as CreateCertificationDto['proofType'])}>
								{PROOF_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
							</select>
						</div>
					</div>
				</div>

				<div className="fsection">
					<h2>Settings</h2>
					<DraftToggle draft={draft} onChange={setDraft} />
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
				itemName={title}
				onConfirm={handleDelete}
				onCancel={() => setConfirmOpen(false)}
			/>
		</>
	);
}
