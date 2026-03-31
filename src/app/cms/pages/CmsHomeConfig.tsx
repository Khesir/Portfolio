import { useEffect, useState } from 'react';
import { fetchHomeConfig, cmsUpdateHomeConfig } from '@/app/api/cms';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import TagInput from '../components/TagInput';

export default function CmsHomeConfig() {
  const [available, setAvailable] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHomeConfig()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        setAvailable(data?.available ?? false);
        setLanguages(data?.languages ?? []);
        setDescription(data?.description ?? '');
      })
      .catch(() => toast.error('Failed to load config'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await cmsUpdateHomeConfig({ available, languages, description });
      toast.success('Config saved');
    } catch {
      toast.error('Failed to save config');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-400 text-sm">Loading...</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Home Config</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-3">
          <input
            id="available"
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-slate-900 dark:accent-slate-100"
          />
          <Label htmlFor="available">Available for work</Label>
        </div>
        <div className="space-y-1.5">
          <Label>
            Languages{' '}
            <span className="text-slate-400 font-normal text-xs">
              Iconify icon IDs — e.g. <code>devicon:typescript</code>
            </span>
          </Label>
          <TagInput
            value={languages}
            onChange={setLanguages}
            placeholder="devicon:typescript, press Enter"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Bio / Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-36 resize-y"
          />
        </div>
        <div className="pt-2">
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Config'}</Button>
        </div>
      </form>
    </div>
  );
}
