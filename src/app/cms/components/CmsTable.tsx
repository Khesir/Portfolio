import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import ConfirmDialog from './ConfirmDialog';

interface CmsTableProps<T> {
  rows: T[];
  getId: (row: T) => string;
  getName: (row: T) => string;
  getSubtitle?: (row: T) => string;
  getBadge?: (row: T) => React.ReactNode;
  editPath: (id: string) => string;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export default function CmsTable<T>({
  rows,
  getId,
  getName,
  getSubtitle,
  getBadge,
  editPath,
  onDelete,
  loading,
}: CmsTableProps<T>) {
  const navigate = useNavigate();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    await onDelete(confirmId);
    setDeleting(false);
    setConfirmId(null);
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-slate-400 py-8 text-center">No items yet.</p>
    );
  }

  const confirmRow = confirmId ? rows.find((r) => getId(r) === confirmId) : null;

  return (
    <>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row) => (
            <tr key={getId(row)} className="group">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-800 dark:text-slate-200">{getName(row)}</p>
                  {getBadge && getBadge(row)}
                </div>
                {getSubtitle && (
                  <p className="text-xs text-slate-400 mt-0.5">{getSubtitle(row)}</p>
                )}
              </td>
              <td className="py-3 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(editPath(getId(row)))}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setConfirmId(getId(row))}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        open={!!confirmId}
        itemName={confirmRow ? getName(confirmRow) : ''}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setConfirmId(null)}
      />
    </>
  );
}
