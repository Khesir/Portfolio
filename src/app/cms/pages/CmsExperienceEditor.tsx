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
import EngagementToggles from '../components/EngagementToggles';
import ImageUpload from '../components/ImageUpload';

const JOB_TYPES: CreateExperienceDto['jobType'][] = ['Remote', 'Hybrid', 'Onsite'];
const EMPLOYMENT_TYPES: CreateExperienceDto['employmentType'][] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
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
  const [hideViews, setHideViews] = useState(false);
  const [hideHearts, setHideHearts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (!isEdit || !id) return;
    fetchExperienceByID(id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        setPosition(res?.position ?? '');
        setCompanyName(res?.companyName ?? '');
        setJobType(res?.jobType ?? 'Remote');
        setEmploymentType(res?.employmentType ?? 'Full-time');
        setDurationStart(res?.durationStart ?? '');
        setDurationEnd(res?.durationEnd ?? '');
        setImageUrl(res?.imageUrl ?? '');
        setPageMd(res?.pageMd ?? '');
        setHighlightSkills(res?.highlightSkills ?? []);
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
        hideViews,
        hideHearts,
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
        <div className="flex items-center gap-2">
          <EngagementToggles hideViews={hideViews} hideHearts={hideHearts} onChangeViews={setHideViews} onChangeHearts={setHideHearts} />
          <DraftToggle draft={draft} onChange={setDraft} />
        </div>
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
            <Label>Company Logo</Label>
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
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
