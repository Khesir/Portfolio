import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {fetchProjectsByID} from '@/app/api/projects';
import {cmsCreateProject, cmsUpdateProject, cmsDeleteProject} from '@/app/api/cms';
import {toast} from 'sonner';
import TagInput from '../components/TagInput';
import MarkdownEditor from '../components/MarkdownEditor';
import DraftToggle from '../components/DraftToggle';
import EngagementToggles from '../components/EngagementToggles';
import ImageUpload from '../components/ImageUpload';
import ConfirmDialog from '../components/ConfirmDialog';

function relativeTime(date: Date): string {
	const diff = Math.floor((Date.now() - date.getTime()) / 1000);
	if (diff < 60) return 'just now';
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	return `${Math.floor(diff / 3600)}h ago`;
}

export default function CmsProjectEditor() {
	const {id} = useParams();
	const isEdit = Boolean(id);
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [releasedDate, setReleasedDate] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [languages, setLanguages] = useState<string[]>([]);
	const [url, setUrl] = useState('');
	const [deployment, setDeployment] = useState('');
	const [category, setCategory] = useState('');
	const [markdown, setMarkdown] = useState('');
	const [draft, setDraft] = useState(true);
	const [hideViews, setHideViews] = useState(false);
	const [hideHearts, setHideHearts] = useState(false);
	const [pinned, setPinned] = useState(false);
	const [saving, setSaving] = useState(false);
	const [loadingData, setLoadingData] = useState(isEdit);
	const [savedAt, setSavedAt] = useState<Date | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);

	useEffect(() => {
		if (!isEdit || !id) return;
		fetchProjectsByID(id)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.then((res: any) => {
				setName(res?.name ?? '');
				setReleasedDate(res?.releasedDate ?? '');
				setImageUrl(res?.imageUrl ?? '');
				setLanguages(res?.languages ?? []);
				setUrl(res?.url ?? '');
				setDeployment(res?.deployment ?? '');
				setCategory(res?.category ?? '');
				setMarkdown(res?.markdown ?? '');
				setDraft(res?.draft ?? false);
				setHideViews(res?.hideViews ?? false);
				setHideHearts(res?.hideHearts ?? false);
				setPinned(res?.pinned ?? false);
			})
			.finally(() => setLoadingData(false));
	}, [id, isEdit]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			const payload = {name, releasedDate, imageUrl, languages, url, deployment, category, markdown, draft, hideViews, hideHearts, pinned};
			if (isEdit && id) {
				await cmsUpdateProject(id, payload);
				toast.success(draft ? 'Project saved as draft' : 'Project published');
			} else {
				await cmsCreateProject(payload);
				toast.success(draft ? 'Project saved as draft' : 'Project published');
			}
			setSavedAt(new Date());
			navigate('/cms/projects');
		} catch {
			toast.error('Failed to save project');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!id) return;
		try {
			await cmsDeleteProject(id);
			toast.success('Project deleted');
			navigate('/cms/projects');
		} catch {
			toast.error('Failed to delete project');
		}
	};

	if (loadingData) {
		return <p className="hint">Loading...</p>;
	}

	const slug = name ? name.toLowerCase().replace(/\s+/g, '-') : 'untitled';

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">{isEdit ? 'Edit' : 'New'} Project</h1>
					<div className="sub">aj@khesir:~$ {isEdit ? 'vim' : 'touch'} ./projects/{slug}</div>
				</div>
				{isEdit && (
					<button className="btn-ol" type="button" onClick={() => setConfirmOpen(true)}>Delete</button>
				)}
			</div>
			<form className="cms-form" onSubmit={handleSubmit}>
				<div className="fsection">
					<h2>Metadata</h2>
					<div className="field">
						<label>Title</label>
						<input value={name} onChange={(e) => setName(e.target.value)} required />
					</div>
					<div className="field">
						<label>Release Date</label>
						<input type="date" value={releasedDate} onChange={(e) => setReleasedDate(e.target.value)} />
					</div>
					<div className="field">
						<label htmlFor="project-category">Category <span className="opt">optional</span></label>
						<select id="project-category" value={category} onChange={(e) => setCategory(e.target.value)}>
							<option value="">Select category</option>
							<option value="dev">Dev</option>
							<option value="illustration">Illustration</option>
							<option value="tech-art">Tech Art</option>
						</select>
					</div>
					<div className="field">
						<label>Cover image <span className="opt">optional</span></label>
						<ImageUpload value={imageUrl} onChange={setImageUrl} />
					</div>
				</div>

				<div className="fsection">
					<h2>Links</h2>
					<div className="field">
						<label>GitHub repo</label>
						<input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://github.com/..." />
					</div>
					<div className="field">
						<label>Live demo</label>
						<input value={deployment} onChange={(e) => setDeployment(e.target.value)} placeholder="https://..." />
					</div>
				</div>

				<div className="fsection">
					<h2>Languages</h2>
					<div className="field">
						<TagInput value={languages} onChange={setLanguages} />
					</div>
				</div>

				<div className="fsection">
					<h2>Content</h2>
					<div className="field">
						<MarkdownEditor value={markdown} onChange={setMarkdown} />
					</div>
				</div>

				<div className="fsection">
					<h2>Settings</h2>
					<DraftToggle draft={draft} onChange={setDraft} />
					<div className="field">
						<label>Featured project</label>
						<button
							type="button"
							className={`feat${pinned ? ' on' : ''}`}
							onClick={() => setPinned((p) => !p)}
						>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="12" height="12">
								<path d="M12 17v5M9 3h6l-1 7 3 3H7l3-3z" />
							</svg>
							{pinned ? 'Featured' : 'Mark as featured'}
						</button>
					</div>
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
				itemName={name}
				onConfirm={handleDelete}
				onCancel={() => setConfirmOpen(false)}
			/>
		</>
	);
}
