import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { cmsDeleteProgress } from '@/app/api/cms';
import { Button } from '@/components/ui/Button';
import CmsTable from '../components/CmsTable';
import { toast } from 'sonner';

export default function CmsProgress() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://personal-backend-psi.vercel.app/progress')
      .then((res) => setItems(res.data?.data?.result?.results ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await cmsDeleteProgress(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
    toast.success('Progress entry deleted');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Progress</h1>
        <Button onClick={() => navigate('/cms/progress/new')}>+ New Entry</Button>
      </div>
      <CmsTable
        rows={items}
        getId={(p) => p.id}
        getName={(p) => p.properties?.Name?.title?.[0]?.plain_text ?? '—'}
        getSubtitle={(p) =>
          p.created_time ? new Date(p.created_time).toLocaleDateString() : ''
        }
        getBadge={(p) =>
          p.properties?.Draft?.checkbox ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
              Draft
            </span>
          ) : null
        }
        editPath={(id) => `/cms/progress/${id}/edit`}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}
