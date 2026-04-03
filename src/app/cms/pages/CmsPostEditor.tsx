import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {fetchPosts, cmsCreatePost, cmsUpdatePost} from '@/app/api/cms';
import {Button} from '@/components/ui/Button';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {toast} from 'sonner';
import TagInput from '../components/TagInput';
import DraftToggle from '../components/DraftToggle';
import EngagementToggles from '../components/EngagementToggles';
import ImageUpload from '../components/ImageUpload';

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
	const [saving, setSaving] = useState(false);
	const [loadingData, setLoadingData] = useState(isEdit);

	useEffect(() => {
		if (!isEdit || !id) return;
		fetchPosts()
			.then((posts) => {
				const post = posts.find((p) => p.id === id);
				if (!post) return;
				setContent(post.content);
				setImageUrl(post.imageUrl ?? '');
				setTags(post.tags);
				setDraft(post.draft);
				setHideViews(post.hideViews);
				setHideHearts(post.hideHearts);
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
			const payload = {content, imageUrl, tags, draft, hideViews, hideHearts};
			if (isEdit && id) {
				await cmsUpdatePost(id, payload);
				toast.success(draft ? 'Post saved as draft' : 'Post published');
			} else {
				await cmsCreatePost(payload);
				toast.success(draft ? 'Post saved as draft' : 'Post published');
			}
			navigate('/cms/posts');
		} catch {
			toast.error('Failed to save post');
		} finally {
			setSaving(false);
		}
	};

	const charCount = content.length;

	if (loadingData) return <p className="text-slate-400 text-sm">Loading...</p>;

	return (
		<div className="w-full max-w-2xl">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">{isEdit ? 'Edit Post' : 'New Post'}</h1>
				<div className="flex items-center gap-2">
					<EngagementToggles
						hideViews={hideViews}
						hideHearts={hideHearts}
						onChangeViews={setHideViews}
						onChangeHearts={setHideHearts}
					/>
					<DraftToggle draft={draft} onChange={setDraft} />
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="space-y-1.5">
					<div className="flex items-center justify-between">
						<Label>Content</Label>
						<span className={`text-xs tabular-nums ${charCount > 500 ? 'text-amber-500' : 'text-slate-400'}`}>
							{charCount} chars
						</span>
					</div>
					<Textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="What's on your mind?"
						className="min-h-36 resize-y text-base leading-relaxed"
						required
					/>
				</div>

				<div className="space-y-1.5">
					<Label>Image <span className="text-slate-400 font-normal text-xs">optional</span></Label>
					<ImageUpload value={imageUrl} onChange={setImageUrl} />
				</div>

				<div className="space-y-1.5">
					<Label>Tags</Label>
					<TagInput value={tags} onChange={setTags} placeholder="gamedev, update — press Enter" />
				</div>

				<div className="flex gap-3 pt-2">
					<Button type="submit" disabled={saving}>
						{saving ? 'Saving...' : draft ? 'Save Draft' : 'Post'}
					</Button>
					<Button type="button" variant="outline" onClick={() => navigate('/cms/posts')}>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
}
