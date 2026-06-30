import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {fetchPostsByID, cmsCreatePost, cmsUpdatePost, cmsDeletePost} from '@/app/api/cms';
import {toast} from 'sonner';
import TagInput from '../components/TagInput';
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

export default function CmsPostEditor() {
	const {id} = useParams();
	const isEdit = Boolean(id);
	const navigate = useNavigate();

	const [content, setContent] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [tags, setTags] = useState<string[]>([]);
	const [draft, setDraft] = useState(false);
	const [hideViews, setHideViews] = useState(false);
	const [hideHearts, setHideHearts] = useState(false);
	const [pinned, setPinned] = useState(false);
	const [saving, setSaving] = useState(false);
	const [loadingData, setLoadingData] = useState(isEdit);
	const [savedAt, setSavedAt] = useState<Date | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);

	useEffect(() => {
		if (!isEdit || !id) return;
		fetchPostsByID(id)
			.then((post) => {
				if (!post) return;
				setContent(post.content);
				setImageUrl(post.imageUrl ?? '');
				setTags(post.tags);
				setDraft(post.draft);
				setHideViews(post.hideViews);
				setHideHearts(post.hideHearts);
				setPinned(post.pinned);
			})
			.finally(() => setLoadingData(false));
	}, [id, isEdit]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim()) {
			toast.error('Post content is required');
			return;
		}
		setSaving(true);
		try {
			const payload = {content, imageUrl, tags, draft, hideViews, hideHearts, pinned};
			if (isEdit && id) {
				await cmsUpdatePost(id, payload);
				toast.success(draft ? 'Post saved as draft' : 'Post published');
			} else {
				await cmsCreatePost(payload);
				toast.success(draft ? 'Post saved as draft' : 'Post published');
			}
			setSavedAt(new Date());
			navigate('/cms/posts');
		} catch {
			toast.error('Failed to save post');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!id) return;
		try {
			await cmsDeletePost(id);
			toast.success('Post deleted');
			navigate('/cms/posts');
		} catch {
			toast.error('Failed to delete post');
		}
	};

	const charCount = content.length;

	if (loadingData) return <p className="hint">Loading...</p>;

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">{isEdit ? 'Edit' : 'New'} Post</h1>
					<div className="sub">aj@khesir:~$ {isEdit ? 'vim' : 'touch'} ./posts/{id ?? 'new'}</div>
				</div>
				{isEdit && (
					<button className="btn-ol" type="button" onClick={() => setConfirmOpen(true)}>Delete</button>
				)}
			</div>
			<form className="cms-form" onSubmit={handleSubmit}>
				<div className="fsection">
					<h2>Content</h2>
					<div className="field mono">
						<label>
							Post content
							<span className={`opt${charCount > 500 ? ' warn' : ''}`}> {charCount} chars</span>
						</label>
						<textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="What's on your mind?"
							required
						/>
					</div>
				</div>

				<div className="fsection">
					<h2>Image</h2>
					<div className="field">
						<label>Attachment <span className="opt">optional</span></label>
						<ImageUpload value={imageUrl} onChange={setImageUrl} />
					</div>
				</div>

				<div className="fsection">
					<h2>Tags</h2>
					<div className="field">
						<TagInput value={tags} onChange={setTags} placeholder="gamedev, update — press Enter" />
					</div>
				</div>

				<div className="fsection">
					<h2>Settings</h2>
					<DraftToggle draft={draft} onChange={setDraft} />
					<div className="field">
						<label>Featured post</label>
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
				itemName={content.slice(0, 40)}
				onConfirm={handleDelete}
				onCancel={() => setConfirmOpen(false)}
			/>
		</>
	);
}
