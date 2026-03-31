import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProjectsByID as fetchExperienceByID } from '@/app/api/experience';
import { cmsCreateExperience, cmsUpdateExperience, CreateExperienceDto } from '@/app/api/cms';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import TagInput from '../components/TagInput';
import MarkdownEditor from '../components/MarkdownEditor';
import DraftToggle from '../components/DraftToggle';

const JOB_TYPES: CreateExperienceDto['jobType'][] = ['Remote', 'Hybrid', 'Onsite'];
const EMPLOYMENT_TYPES: CreateExperienceDto['employmentType'][] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
];

const selectClass =
  'flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:border-slate-800 dark:focus-visible:ring-slate-300';

export default function CmsExperienceEditor() {
  const { id } = useParams();
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
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (!isEdit || !id) return;
    fetchExperienceByID(id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        const props = res?.properties ?? {};
        setPosition(
          props?.Position?.title?.[0]?.plain_text ??
          props?.Position?.rich_text?.[0]?.plain_text ?? ''
        );
        setCompanyName(props?.CompanyName?.rich_text?.[0]?.plain_text ?? '');
        setJobType(props?.JobType?.select?.name ?? 'Remote');
        setEmploymentType(props?.EmploymentType?.select?.name ?? 'Full-time');
        setDurationStart(props?.Duration?.date?.start ?? '');
        setDurationEnd(props?.Duration?.date?.end ?? '');
        setImageUrl(props?.Image?.files?.[0]?.file?.url ?? '');
        setPageMd(props?.pageMd?.rich_text?.[0]?.plain_text ?? '');
        setHighlightSkills(
          (res?.highlightSkills ?? [])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((s: any) => s?.properties?.Name?.title?.[0]?.plain_text ?? '')
            .filter(Boolean)
        );
        setDraft(props?.Draft?.checkbox ?? false);
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
      };
      if (isEdit && id) {
        await cmsUpdateExperience(id, payload);
        toast.success(draft ? 'Experience saved as draft' : 'Experience published');
      } else {
        await cmsCreateExperience(payload);
        toast.success(draft ? 'Experience saved as draft' : 'Experience published');
      }
      navigate('/cms/experiences');
    } catch {
      toast.error('Failed to save experience');
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
        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Experience' : 'New Experience'}</h1>
        <DraftToggle draft={draft} onChange={setDraft} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="max-w-3xl space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Position / Title</Label>
              <Input value={position} onChange={(e) => setPosition(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Company Name</Label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Job Type</Label>
              <select
                className={selectClass}
                value={jobType}
                onChange={(e) => setJobType(e.target.value as CreateExperienceDto['jobType'])}
              >
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Employment Type</Label>
              <select
                className={selectClass}
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as CreateExperienceDto['employmentType'])}
              >
                {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Start Date</Label>
              <Input type="date" value={durationStart} onChange={(e) => setDurationStart(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>
                End Date <span className="text-slate-400 font-normal text-xs">(leave blank if current)</span>
              </Label>
              <Input type="date" value={durationEnd} onChange={(e) => setDurationEnd(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Company Logo URL</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-1.5">
            <Label>Highlight Skills</Label>
            <TagInput value={highlightSkills} onChange={setHighlightSkills} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Detail Content (Markdown)</Label>
          <MarkdownEditor value={pageMd} onChange={setPageMd} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : draft ? 'Save Draft' : 'Publish'}</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/cms/experiences')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
