import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProjectsByID } from '@/app/api/projects';
import { cmsCreateProject, cmsUpdateProject } from '@/app/api/cms';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import TagInput from '../components/TagInput';
import MarkdownEditor from '../components/MarkdownEditor';
import DraftToggle from '../components/DraftToggle';

export default function CmsProjectEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [releasedDate, setReleasedDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [url, setUrl] = useState('');
  const [deployment, setDeployment] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [draft, setDraft] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (!isEdit || !id) return;
    fetchProjectsByID(id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        const props = res?.data?.properties ?? res?.properties ?? {};
        setName(props?.Name?.title?.[0]?.plain_text ?? '');
        setReleasedDate(props?.['Released Date']?.date?.start ?? '');
        setImageUrl(props?.Image?.files?.[0]?.file?.url ?? '');
        setLanguages(props?.Languages?.multi_select?.map((l: { name: string }) => l.name) ?? []);
        setUrl(props?.URL?.url ?? '');
        setDeployment(props?.Deployment?.url ?? '');
        setMarkdown(res?.markdown ?? '');
        setDraft(props?.Draft?.checkbox ?? false);
      })
      .finally(() => setLoadingData(false));
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name, releasedDate, imageUrl, languages, url, deployment, markdown, draft };
      if (isEdit && id) {
        await cmsUpdateProject(id, payload);
        toast.success(draft ? 'Project saved as draft' : 'Project published');
      } else {
        await cmsCreateProject(payload);
        toast.success(draft ? 'Project saved as draft' : 'Project published');
      }
      navigate('/cms/projects');
    } catch {
      toast.error('Failed to save project');
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
        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Project' : 'New Project'}</h1>
        <DraftToggle draft={draft} onChange={setDraft} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="max-w-3xl space-y-5">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Released Date</Label>
            <Input type="date" value={releasedDate} onChange={(e) => setReleasedDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Cover Image URL</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-1.5">
            <Label>Languages / Tech Stack</Label>
            <TagInput value={languages} onChange={setLanguages} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>GitHub URL</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div className="space-y-1.5">
              <Label>Deployment URL</Label>
              <Input value={deployment} onChange={(e) => setDeployment(e.target.value)} placeholder="https://..." />
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Content</Label>
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : draft ? 'Save Draft' : 'Publish'}</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/cms/projects')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
