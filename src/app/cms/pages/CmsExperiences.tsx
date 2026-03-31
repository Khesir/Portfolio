import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchExperiences } from '@/app/api/experience';
import { cmsDeleteExperience } from '@/app/api/cms';
import { Button } from '@/components/ui/Button';
import CmsTable from '../components/CmsTable';
import { toast } from 'sonner';

export default function CmsExperiences() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences(20)
      .then(setExperiences)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await cmsDeleteExperience(id);
    setExperiences((prev) => prev.filter((e) => e.id !== id));
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
        getId={(e) => e.id}
        getName={(e) =>
          e.properties?.Position?.title?.[0]?.plain_text ??
          e.properties?.Position?.rich_text?.[0]?.plain_text ??
          '—'
        }
        getSubtitle={(e) => e.properties?.CompanyName?.rich_text?.[0]?.plain_text ?? ''}
        getBadge={(e) =>
          e.properties?.Draft?.checkbox ? (
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
