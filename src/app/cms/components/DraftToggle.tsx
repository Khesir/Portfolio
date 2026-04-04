import { FileText, Eye } from 'lucide-react';

interface DraftToggleProps {
  draft: boolean;
  onChange: (draft: boolean) => void;
}

export default function DraftToggle({ draft, onChange }: DraftToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!draft)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
        draft
          ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
      }`}
    >
      {draft ? <FileText size={14} /> : <Eye size={14} />}
      {draft ? 'Draft' : 'Published'}
    </button>
  );
}
