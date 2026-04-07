import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {fetchProjectsCms, cmsDeleteProject, cmsUpdateProject} from '@/app/api/cms';
import {Button} from '@/components/ui/Button';
import CmsTable from '../components/CmsTable';
import {toast} from 'sonner';
import {Pin} from 'lucide-react';

export default function CmsProjects() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectsCms()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await cmsDeleteProject(id);
    setProjects((prev) => prev.filter((p) => p._id !== id && p.id !== id));
    toast.success('Project deleted');
  };

  const handleTogglePin = async (project: any) => {
    const id = project._id ?? project.id;
    const nextPinned = !project.pinned;
    setTogglingId(id);
    try {
      await cmsUpdateProject(id, {pinned: nextPinned});
      setProjects((prev) =>
        prev.map((p) => (p._id === id || p.id === id) ? {...p, pinned: nextPinned} : p),
      );
      toast.success(nextPinned ? 'Project featured on homepage' : 'Project removed from featured');
    } catch {
      toast.error('Failed to update project');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button onClick={() => navigate('/cms/projects/new')}>+ New Project</Button>
      </div>
      <CmsTable
        rows={projects}
        getId={(p) => p._id ?? p.id}
        getName={(p) => p.name ?? '—'}
        getSubtitle={(p) => p.releasedDate ?? ''}
        getBadge={(p) => (
          <div className="flex items-center gap-1.5">
            {p.pinned && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                <Pin size={10} className="fill-current" /> Featured
              </span>
            )}
            {p.draft && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                Draft
              </span>
            )}
          </div>
        )}
        getActions={(p) => {
          const id = p._id ?? p.id;
          return (
            <button
              disabled={togglingId === id}
              onClick={() => handleTogglePin(p)}
              title={p.pinned ? 'Unfeature' : 'Feature on homepage'}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-medium transition-colors disabled:opacity-50 ${
                p.pinned
                  ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
              }`}
            >
              <Pin size={12} className={p.pinned ? 'fill-current' : ''} />
              {p.pinned ? 'Featured' : 'Feature'}
            </button>
          );
        }}
        editPath={(id) => `/cms/projects/${id}/edit`}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}
