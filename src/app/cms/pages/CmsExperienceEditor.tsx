import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {fetchProjectsByID as fetchExperienceByID} from '@/app/api/experience';
import {
	cmsCreateExperience,
	cmsUpdateExperience,
	cmsDeleteExperience,
	CreateExperienceDto,
} from '@/app/api/cms';
import {toast} from 'sonner';
import TagInput from '../components/TagInput';
import MarkdownEditor from '../components/MarkdownEditor';
import DraftToggle from '../components/DraftToggle';
import EngagementToggles from '../components/EngagementToggles';
import ImageUpload from '../components/ImageUpload';
import ConfirmDialog from '../components/ConfirmDialog';

const JOB_TYPES: CreateExperienceDto['jobType'][] = [
	'Remote',
	'Hybrid',
	'Onsite',
];
const EMPLOYMENT_TYPES: CreateExperienceDto['employmentType'][] = [
	'Full-time',
	'Part-time',
	'Contract',
	'Freelance',
	'Internship',
];

function relativeTime(date: Date): string {
	const diff = Math.floor((Date.now() - date.getTime()) / 1000);
	if (diff < 60) return 'just now';
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	return `${Math.floor(diff / 3600)}h ago`;
}

export default function CmsExperienceEditor() {
	const {id} = useParams();
	const isEdit = Boolean(id);
	const navigate = useNavigate();

	const [position, setPosition] = useState('');
	const [companyName, setCompanyName] = useState('');
	const [jobType, setJobType] = useState<CreateExperienceDto['jobType']>('Remote');
	const [employmentType, setEmploymentType] = useState<CreateExperienceDto['employmentType']>('Full-time');
	const [durationStart, setDurationStart] = useState('');
	const [durationEnd, setDurationEnd] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [pageMd, setPageMd] = useState('');
	const [highlightSkills, setHighlightSkills] = useState<string[]>([]);
	const [draft, setDraft] = useState(true);
	const [hideViews, setHideViews] = useState(false);
	const [hideHearts, setHideHearts] = useState(false);
	const [saving, setSaving] = useState(false);
	const [loadingData, setLoadingData] = useState(isEdit);
	const [savedAt, setSavedAt] = useState<Date | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);

	useEffect(() => {
		if (!isEdit || !id) return;
		fetchExperienceByID(id)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.then((res: any) => {
				setPosition(res?.position ?? '');
				setCompanyName(res?.companyName ?? '');
				setJobType(res?.jobType ?? 'Remote');
				setEmploymentType(res?.employmentType ?? 'Full-time');
				setDurationStart(res?.durationStart ?? '');
				setDurationEnd(res?.durationEnd ?? '');
				setImageUrl(res?.imageUrl ?? '');
				setPageMd(res?.pageMd ?? '');
				setHighlightSkills(res?.highlightSkills ?? []);
				setDraft(res?.draft ?? false);
				setHideViews(res?.hideViews ?? false);
				setHideHearts(res?.hideHearts ?? false);
			})
			.finally(() => setLoadingData(false));
	}, [id, isEdit]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			const payload = {
				position,
				companyName,
				jobType,
				employmentType,
				durationStart,
				durationEnd: durationEnd || undefined,
				imageUrl: imageUrl || undefined,
				pageMd: pageMd || undefined,
				highlightSkills,
				draft,
				hideViews,
				hideHearts,
			};
			if (isEdit && id) {
				await cmsUpdateExperience(id, payload);
				toast.success(draft ? 'Experience saved as draft' : 'Experience published');
			} else {
				await cmsCreateExperience(payload);
				toast.success(draft ? 'Experience saved as draft' : 'Experience published');
			}
			setSavedAt(new Date());
			navigate('/cms/experiences');
		} catch {
			toast.error('Failed to save experience');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!id) return;
		try {
			await cmsDeleteExperience(id);
			toast.success('Experience deleted');
			navigate('/cms/experiences');
		} catch {
			toast.error('Failed to delete experience');
		}
	};

	if (loadingData) {
		return <p className="hint">Loading...</p>;
	}

	const slug = position ? position.toLowerCase().replace(/\s+/g, '-') : 'untitled';

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">{isEdit ? 'Edit' : 'New'} Experience</h1>
					<div className="sub">aj@khesir:~$ {isEdit ? 'vim' : 'touch'} ./experiences/{slug}</div>
				</div>
				{isEdit && (
					<button className="btn-ol" type="button" onClick={() => setConfirmOpen(true)}>Delete</button>
				)}
			</div>
			<form className="cms-form" onSubmit={handleSubmit}>
				<div className="fsection">
					<h2>Role</h2>
					<div className="frow">
						<div className="field">
							<label>Position</label>
							<input value={position} onChange={(e) => setPosition(e.target.value)} required />
						</div>
						<div className="field">
							<label>Company Name</label>
							<input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
						</div>
					</div>
					<div className="frow">
						<div className="field">
							<label>Job Type</label>
							<select value={jobType} onChange={(e) => setJobType(e.target.value as CreateExperienceDto['jobType'])}>
								{JOB_TYPES.map((t) => (
									<option key={t} value={t}>{t}</option>
								))}
							</select>
						</div>
						<div className="field">
							<label>Employment Type</label>
							<select value={employmentType} onChange={(e) => setEmploymentType(e.target.value as CreateExperienceDto['employmentType'])}>
								{EMPLOYMENT_TYPES.map((t) => (
									<option key={t} value={t}>{t}</option>
								))}
							</select>
						</div>
					</div>
				</div>

				<div className="fsection">
					<h2>Duration</h2>
					<div className="frow">
						<div className="field">
							<label>Start Date</label>
							<input type="date" value={durationStart} onChange={(e) => setDurationStart(e.target.value)} required />
						</div>
						<div className="field">
							<label>End Date <span className="opt">empty = current</span></label>
							<input type="date" value={durationEnd} onChange={(e) => setDurationEnd(e.target.value)} />
						</div>
					</div>
				</div>

				<div className="fsection">
					<h2>Image</h2>
					<div className="field">
						<label>Company logo <span className="opt">optional</span></label>
						<ImageUpload value={imageUrl} onChange={setImageUrl} />
					</div>
				</div>

				<div className="fsection">
					<h2>Skills</h2>
					<div className="field">
						<TagInput value={highlightSkills} onChange={setHighlightSkills} />
					</div>
				</div>

				<div className="fsection">
					<h2>Content</h2>
					<div className="field">
						<MarkdownEditor value={pageMd} onChange={setPageMd} />
					</div>
				</div>

				<div className="fsection">
					<h2>Settings</h2>
					<DraftToggle draft={draft} onChange={setDraft} />
					<EngagementToggles hideViews={hideViews} hideHearts={hideHearts} onChangeViews={setHideViews} onChangeHearts={setHideHearts} />
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
				itemName={position}
				onConfirm={handleDelete}
				onCancel={() => setConfirmOpen(false)}
			/>
		</>
	);
}
