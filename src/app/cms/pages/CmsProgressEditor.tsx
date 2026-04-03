import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {cmsCreateProgress} from '@/app/api/cms';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {toast} from 'sonner';
import DraftToggle from '../components/DraftToggle';
import ImageUpload from '../components/ImageUpload';

export default function CmsProgressEditor() {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [draft, setDraft] = useState(false);
	const [saving, setSaving] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			await cmsCreateProgress({name, imageUrl: imageUrl || undefined, draft});
			toast.success(
				draft ? 'Progress entry saved as draft' : 'Progress entry created',
			);
			navigate('/cms/progress');
		} catch {
			toast.error('Failed to create entry');
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="max-w-xl">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">New Progress Entry</h1>
				<DraftToggle draft={draft} onChange={setDraft} />
			</div>
			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="space-y-1.5">
					<Label>Title</Label>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className="space-y-1.5">
					<Label>Image</Label>
					<ImageUpload value={imageUrl} onChange={setImageUrl} />
				</div>
				<div className="flex gap-3 pt-2">
					<Button type="submit" disabled={saving}>
						{saving ? 'Saving...' : draft ? 'Save Draft' : 'Publish'}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => navigate('/cms/progress')}
					>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
}
