import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {fetchExperiencesCms, cmsDeleteExperience} from '@/app/api/cms';
import {Button} from '@/components/ui/Button';
import CmsTable from '../components/CmsTable';
import {toast} from 'sonner';

export default function CmsExperiences() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiencesCms()
      .then(setExperiences)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await cmsDeleteExperience(id);
    setExperiences((prev) => prev.filter((e) => e._id !== id && e.id !== id));
    toast.success('Experience deleted');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Experiences</h1>
        <Button onClick={() => navigate('/cms/experiences/new')}>+ New Experience</Button>
      </div>
      <CmsTable
        rows={experiences}
        getId={(e) => e._id ?? e.id}
        getName={(e) => e.position ?? '—'}
        getSubtitle={(e) => e.companyName ?? ''}
        getBadge={(e) =>
          e.draft ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
              Draft
            </span>
          ) : null
        }
        editPath={(id) => `/cms/experiences/${id}/edit`}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}
