/* eslint-disable react/prop-types */
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {fetchBlogsByID} from '@/app/api/blogs';
import {cmsCreateBlog, cmsUpdateBlog} from '@/app/api/cms';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {toast} from 'sonner';
import TagInput from '../components/TagInput';
import MarkdownEditor from '../components/MarkdownEditor';
import DraftToggle from '../components/DraftToggle';
import EngagementToggles from '../components/EngagementToggles';
import ImageUpload from '../components/ImageUpload';

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
			navigate('/cms/blogs');
		} catch {
			toast.error('Failed to save blog');
		} finally {
			setSaving(false);
		}
	};

	if (loadingData) {
		return <p className="text-slate-400 text-sm">Loading...</p>;
	}

	return (
		<div className="w-full">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">
					{isEdit ? 'Edit Blog' : 'New Blog'}
				</h1>
				<div className="flex items-center gap-2">
					<EngagementToggles hideViews={hideViews} hideHearts={hideHearts} onChangeViews={setHideViews} onChangeHearts={setHideHearts} />
					<DraftToggle draft={draft} onChange={setDraft} />
				</div>
			</div>
			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="max-w-3xl space-y-5">
					<div className="space-y-1.5">
						<Label>Title</Label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<Label>Released Date</Label>
							<Input
								type="date"
								value={releasedDate}
								onChange={(e) => setReleasedDate(e.target.value)}
							/>
						</div>
						<div className="space-y-1.5">
							<Label>Min Read</Label>
							<Input
								type="number"
								min={1}
								value={minRead}
								onChange={(e) => setMinRead(Number(e.target.value))}
							/>
						</div>
					</div>
					<div className="space-y-1.5">
						<Label>Cover Image</Label>
						<ImageUpload value={imageUrl} onChange={setImageUrl} />
					</div>
					<div className="space-y-1.5">
						<Label>Tags</Label>
						<TagInput value={tags} onChange={setTags} />
					</div>
				</div>
				<div className="space-y-1.5">
					<Label>Content</Label>
					<MarkdownEditor value={markdown} onChange={setMarkdown} />
				</div>
				<div className="flex gap-3 pt-2">
					<Button type="submit" disabled={saving}>
						{saving ? 'Saving...' : draft ? 'Save Draft' : 'Publish'}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => navigate('/cms/blogs')}
					>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
}
