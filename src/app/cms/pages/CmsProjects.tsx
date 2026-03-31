import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects } from '@/app/api/projects';
import { cmsDeleteProject } from '@/app/api/cms';
import { Button } from '@/components/ui/Button';
import CmsTable from '../components/CmsTable';
import { toast } from 'sonner';

export default function CmsProjects() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await cmsDeleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success('Project deleted');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button onClick={() => navigate('/cms/projects/new')}>+ New Project</Button>
      </div>
      <CmsTable
        rows={projects}
        getId={(p) => p.id}
        getName={(p) => p.properties?.Name?.title?.[0]?.plain_text ?? '—'}
        getSubtitle={(p) => p.properties?.['Released Date']?.date?.start ?? ''}
        getBadge={(p) =>
          p.properties?.Draft?.checkbox ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
              Draft
            </span>
          ) : null
        }
        editPath={(id) => `/cms/projects/${id}/edit`}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}
