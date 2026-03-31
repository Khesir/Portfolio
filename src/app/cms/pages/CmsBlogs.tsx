import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBlogs } from '@/app/api/blogs';
import { cmsDeleteBlog } from '@/app/api/cms';
import { Button } from '@/components/ui/Button';
import CmsTable from '../components/CmsTable';
import { toast } from 'sonner';

export default function CmsBlogs() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs()
      .then(setBlogs)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await cmsDeleteBlog(id);
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    toast.success('Blog deleted');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Blogs</h1>
        <Button onClick={() => navigate('/cms/blogs/new')}>+ New Blog</Button>
      </div>
      <CmsTable
        rows={blogs}
        getId={(b) => b.id}
        getName={(b) => b.properties?.Name?.title?.[0]?.plain_text ?? '—'}
        getSubtitle={(b) => b.properties?.['Released Date']?.date?.start ?? ''}
        getBadge={(b) =>
          b.properties?.Draft?.checkbox ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
              Draft
            </span>
          ) : null
        }
        editPath={(id) => `/cms/blogs/${id}/edit`}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}
