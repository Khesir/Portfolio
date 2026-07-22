import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import type {Project, ProjectCategory} from '@/data/projects';
import {
	fetchLocalSection,
	saveLocalSection,
	uploadLocalImage,
	uniqueSlug,
} from '@/app/api/cms-local';
import {toast} from 'sonner';
import TagInput from '../components/TagInput';
import MarkdownEditor from '../components/MarkdownEditor';
import ImageGallery from '../components/ImageGallery';
import ConfirmDialog from '../components/ConfirmDialog';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

const IS_DEV = import.meta.env.DEV;

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
	const [category, setCategory] = useState<ProjectCategory | ''>('');
	const [role, setRole] = useState('');
	const [description, setDescription] = useState('');
	const [year, setYear] = useState<number>(new Date().getFullYear());
	const [releasedDate, setReleasedDate] = useState('');
	const [tags, setTags] = useState<string[]>([]);
	const [images, setImages] = useState<string[]>([]);
	const [url, setUrl] = useState('');
	const [deployment, setDeployment] = useState('');
	const [markdown, setMarkdown] = useState('');
	const [pinned, setPinned] = useState(false);
	const [draft, setDraft] = useState(true);
	const [saving, setSaving] = useState(false);
	const [savedAt, setSavedAt] = useState<Date | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [existingIds, setExistingIds] = useState<string[]>([]);

	useEffect(() => {
		fetchLocalSection<Project[]>('projects').then((all) => {
			setExistingIds(all.map((p) => p.id));
			if (!isEdit || !id) return;
			const existing = all.find((p) => p.id === id);
			if (!existing) return;
			setName(existing.name);
			setCategory(existing.category);
			setRole(existing.role);
			setDescription(existing.description);
			setYear(existing.year);
			setReleasedDate(existing.releasedDate ?? '');
			setTags(existing.tags);
			setImages(existing.images);
			setUrl(existing.url ?? '');
			setDeployment(existing.deployment ?? '');
			setMarkdown(existing.markdown);
			setPinned(existing.pinned);
			setDraft(existing.draft);
		});
	}, [id, isEdit]);

	const slug = id ?? (name ? uniqueSlug(name, existingIds) : 'untitled');
	const uploadImage = (file: File) => uploadLocalImage('projects', slug, file);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			const all = await fetchLocalSection<Project[]>('projects');
			const project: Project = {
				id: isEdit && id ? id : slug,
				name,
				category: (category || 'dev') as ProjectCategory,
				role,
				description,
				year,
				releasedDate: releasedDate || undefined,
				tags,
				images,
				url: url || undefined,
				deployment: deployment || undefined,
				markdown,
				pinned,
				draft,
			};
			const next = isEdit
				? all.map((p) => (p.id === id ? project : p))
				: [...all, project];
			await saveLocalSection('projects', next);
			toast.success(draft ? 'Project saved as draft' : 'Project published');
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
			const all = await fetchLocalSection<Project[]>('projects');
			const next = all.filter((p) => p.id !== id);
			await saveLocalSection('projects', next);
			toast.success('Project deleted');
			navigate('/cms/projects');
		} catch {
			toast.error('Failed to delete project');
		}
	};

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">{isEdit ? 'Edit' : 'New'} Project</h1>
					<div className="sub">
						aj@khesir:~$ {isEdit ? 'vim' : 'touch'} ./projects/{slug}
					</div>
				</div>
				{isEdit && (
					<button
						className="btn-ol"
						type="button"
						onClick={() => setConfirmOpen(true)}
					>
						Delete
					</button>
				)}
			</div>
			<LocalOnlyNotice />
			<form className="cms-form" onSubmit={handleSubmit}>
				<fieldset
					disabled={!IS_DEV}
					style={{border: 'none', padding: 0, margin: 0}}
				>
					<div className="fsection">
						<h2>Metadata</h2>
						<div className="field">
							<label>Title</label>
							<input
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						<div className="frow">
							<div className="field">
								<label htmlFor="project-category">Category</label>
								<select
									id="project-category"
									value={category}
									onChange={(e) =>
										setCategory(e.target.value as ProjectCategory)
									}
								>
									<option value="">Select category</option>
									<option value="dev">Dev</option>
									<option value="illustration">Illustration</option>
									<option value="tech-art">Tech Art</option>
								</select>
							</div>
							<div className="field">
								<label>Year</label>
								<input
									type="number"
									value={year}
									onChange={(e) => setYear(Number(e.target.value))}
								/>
							</div>
							<div className="field">
								<label>
									Release date{' '}
									<span className="opt">optional · used for sorting</span>
								</label>
								<input
									type="date"
									value={releasedDate}
									onChange={(e) => setReleasedDate(e.target.value)}
								/>
							</div>
						</div>
						<div className="field">
							<label>Role</label>
							<input
								value={role}
								onChange={(e) => setRole(e.target.value)}
								placeholder="full-stack"
							/>
						</div>
						<div className="field">
							<label>Short description</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
						<div className="field">
							<label>
								Gallery images <span className="opt">optional</span>
							</label>
							<ImageGallery
								value={images}
								onChange={setImages}
								uploadImage={uploadImage}
							/>
						</div>
					</div>

					<div className="fsection">
						<h2>Links</h2>
						<div className="field">
							<label>GitHub repo</label>
							<input
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								placeholder="https://github.com/..."
							/>
						</div>
						<div className="field">
							<label>Live demo</label>
							<input
								value={deployment}
								onChange={(e) => setDeployment(e.target.value)}
								placeholder="https://..."
							/>
						</div>
					</div>

					<div className="fsection">
						<h2>Tags</h2>
						<div className="field">
							<TagInput value={tags} onChange={setTags} />
						</div>
					</div>

					<div className="fsection">
						<h2>Content</h2>
						<div className="field">
							<MarkdownEditor
								value={markdown}
								onChange={setMarkdown}
								uploadImage={uploadImage}
							/>
						</div>
					</div>

					<div className="fsection">
						<h2>Settings</h2>
						<div className="field">
							<label>Draft</label>
							<button
								type="button"
								className={`feat${draft ? ' on' : ''}`}
								onClick={() => setDraft((d) => !d)}
							>
								{draft ? 'Draft — hidden from site' : 'Published'}
							</button>
						</div>
						<div className="field">
							<label>Featured project</label>
							<button
								type="button"
								className={`feat${pinned ? ' on' : ''}`}
								onClick={() => setPinned((p) => !p)}
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.6"
									width="12"
									height="12"
								>
									<path d="M12 17v5M9 3h6l-1 7 3 3H7l3-3z" />
								</svg>
								{pinned ? 'Featured' : 'Mark as featured'}
							</button>
						</div>
					</div>

					<div className="save-bar">
						<button className="btn-new" type="submit" disabled={saving}>
							{isEdit ? 'Save changes' : 'Create'}
						</button>
						{savedAt && (
							<span className="hint">last saved {relativeTime(savedAt)}</span>
						)}
					</div>
				</fieldset>
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
