/* eslint-disable react/prop-types */
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {fetchBlogsByID} from '@/app/api/blogs';
import {cmsCreateBlog, cmsUpdateBlog, cmsDeleteBlog} from '@/app/api/cms';
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

export default function CmsBlogEditor() {
	const {id} = useParams();
	const isEdit = Boolean(id);
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [releasedDate, setReleasedDate] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [tags, setTags] = useState<string[]>([]);
	const [minRead, setMinRead] = useState(5);
	const [markdown, setMarkdown] = useState('');
	const [draft, setDraft] = useState(true);
	const [hideViews, setHideViews] = useState(false);
	const [hideHearts, setHideHearts] = useState(false);
	const [saving, setSaving] = useState(false);
	const [loadingData, setLoadingData] = useState(isEdit);
	const [savedAt, setSavedAt] = useState<Date | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);

	useEffect(() => {
		if (!isEdit || !id) return;
		fetchBlogsByID(id)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.then((res: any) => {
				setName(res?.name ?? '');
				setReleasedDate(res?.releasedDate ?? '');
				setImageUrl(res?.imageUrl ?? '');
				setTags(res?.tags ?? []);
				setMinRead(res?.minRead ?? 5);
				setMarkdown(res?.markdown ?? '');
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
			const payload = {name, releasedDate, imageUrl, tags, minRead, markdown, draft, hideViews, hideHearts};
			if (isEdit && id) {
				await cmsUpdateBlog(id, payload);
				toast.success(draft ? 'Blog saved as draft' : 'Blog published');
			} else {
				await cmsCreateBlog(payload);
				toast.success(draft ? 'Blog saved as draft' : 'Blog published');
			}
			setSavedAt(new Date());
			navigate('/cms/blogs');
		} catch {
			toast.error('Failed to save blog');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!id) return;
		try {
			await cmsDeleteBlog(id);
			toast.success('Blog deleted');
			navigate('/cms/blogs');
		} catch {
			toast.error('Failed to delete blog');
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
					<h1 className="cms-h1">{isEdit ? 'Edit' : 'New'} Blog</h1>
					<div className="sub">aj@khesir:~$ {isEdit ? 'vim' : 'touch'} ./blogs/{slug}</div>
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
					<div className="frow">
						<div className="field">
							<label>Release Date</label>
							<input type="date" value={releasedDate} onChange={(e) => setReleasedDate(e.target.value)} />
						</div>
						<div className="field">
							<label>Min Read</label>
							<input type="number" min={1} value={minRead} onChange={(e) => setMinRead(Number(e.target.value))} />
						</div>
					</div>
					<div className="field">
						<label>Cover image <span className="opt">optional</span></label>
						<ImageUpload value={imageUrl} onChange={setImageUrl} />
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
						<MarkdownEditor value={markdown} onChange={setMarkdown} />
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
				itemName={name}
				onConfirm={handleDelete}
				onCancel={() => setConfirmOpen(false)}
			/>
		</>
	);
}
