import { useRef, useState, useCallback } from 'react';
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  Code, CodeSquare, Quote, List, ListOrdered, Link2, Image,
  Minus, Table, Eye, Pencil, Columns2, Upload, Loader2,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { MarkDownComponent } from '@/app/_components/readPage/readingPage';
import { cmsUploadImage } from '@/app/api/cms';
import { toast } from 'sonner';
import MarkdownCheatSheet from './MarkdownCheatSheet';

interface MarkdownEditorProps {
  value: string;
  onChange: (v: string) => void;
}

type ViewMode = 'write' | 'preview' | 'split';

interface ToolbarAction {
  icon: React.ReactNode;
  label: string;
  action: (selected: string) => { text: string; offset: number };
  separator?: never;
}
interface ToolbarSeparator {
  separator: true;
  icon?: never;
  label?: never;
  action?: never;
}
type ToolbarItem = ToolbarAction | ToolbarSeparator;

const TOOLBAR: ToolbarItem[] = [
  {
    icon: <Bold size={15} />, label: 'Bold',
    action: (s) => s ? { text: `**${s}**`, offset: 2 } : { text: '**bold**', offset: 2 },
  },
  {
    icon: <Italic size={15} />, label: 'Italic',
    action: (s) => s ? { text: `_${s}_`, offset: 1 } : { text: '_italic_', offset: 1 },
  },
  {
    icon: <Strikethrough size={15} />, label: 'Strikethrough',
    action: (s) => s ? { text: `~~${s}~~`, offset: 2 } : { text: '~~strikethrough~~', offset: 2 },
  },
  { separator: true },
  {
    icon: <Heading1 size={15} />, label: 'Heading 1',
    action: (s) => ({ text: `# ${s || 'Heading 1'}`, offset: 2 }),
  },
  {
    icon: <Heading2 size={15} />, label: 'Heading 2',
    action: (s) => ({ text: `## ${s || 'Heading 2'}`, offset: 3 }),
  },
  {
    icon: <Heading3 size={15} />, label: 'Heading 3',
    action: (s) => ({ text: `### ${s || 'Heading 3'}`, offset: 4 }),
  },
  { separator: true },
  {
    icon: <Code size={15} />, label: 'Inline code',
    action: (s) => s ? { text: `\`${s}\``, offset: 1 } : { text: '`code`', offset: 1 },
  },
  {
    icon: <CodeSquare size={15} />, label: 'Code block',
    action: (s) => ({ text: `\`\`\`\n${s || 'code'}\n\`\`\``, offset: 4 }),
  },
  {
    icon: <Quote size={15} />, label: 'Blockquote',
    action: (s) => ({ text: `> ${s || 'quote'}`, offset: 2 }),
  },
  { separator: true },
  {
    icon: <List size={15} />, label: 'Unordered list',
    action: (s) => ({
      text: s
        ? s.split('\n').map((l) => `- ${l}`).join('\n')
        : '- Item 1\n- Item 2\n- Item 3',
      offset: 2,
    }),
  },
  {
    icon: <ListOrdered size={15} />, label: 'Ordered list',
    action: (s) => ({
      text: s
        ? s.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n')
        : '1. Item 1\n2. Item 2\n3. Item 3',
      offset: 3,
    }),
  },
  { separator: true },
  {
    icon: <Link2 size={15} />, label: 'Link',
    action: (s) => ({ text: `[${s || 'link text'}](url)`, offset: 1 }),
  },
  {
    icon: <Image size={15} />, label: 'Image',
    action: (s) => ({ text: `![${s || 'alt text'}](image-url)`, offset: 2 }),
  },
  {
    icon: <Table size={15} />, label: 'Table',
    action: () => ({
      text: '| Header | Header |\n| --- | --- |\n| Cell | Cell |',
      offset: 0,
    }),
  },
  {
    icon: <Minus size={15} />, label: 'Horizontal rule',
    action: () => ({ text: '\n---\n', offset: 0 }),
  },
];

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [view, setView] = useState<ViewMode>('write');
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Upload a File and insert the resulting markdown image
  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files can be uploaded');
      return;
    }
    setUploading(true);
    // Insert a placeholder while uploading
    const placeholder = `![Uploading ${file.name}…]()`;
    const ta = textareaRef.current;
    const insertPos = ta ? ta.selectionStart : value.length;
    const withPlaceholder = value.slice(0, insertPos) + placeholder + value.slice(insertPos);
    onChange(withPlaceholder);

    try {
      const url = await cmsUploadImage(file);
      // Replace placeholder with real URL
      const imageMarkdown = `![${file.name}](${url})`;
      onChange(withPlaceholder.replace(placeholder, imageMarkdown));
      toast.success('Image uploaded');
    } catch {
      // Remove placeholder on failure
      onChange(withPlaceholder.replace(placeholder, ''));
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  }, [value, onChange]);

  const applyAction = useCallback((action: ToolbarAction['action']) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const { text, offset } = action(selected);

    const before = value.slice(0, start);
    const after = value.slice(end);

    const needsNewline = before.length > 0 && !before.endsWith('\n') && (
      text.startsWith('#') || text.startsWith('>') || text.startsWith('-') ||
      text.startsWith('1.') || text.startsWith('```') || text.startsWith('\n---')
    );
    const prefix = needsNewline ? '\n' : '';
    const newValue = before + prefix + text + after;
    onChange(newValue);

    requestAnimationFrame(() => {
      ta.focus();
      if (selected) {
        ta.setSelectionRange(start + offset + prefix.length, start + offset + prefix.length + selected.length);
      } else {
        const cur = start + prefix.length + text.length;
        ta.setSelectionRange(cur, cur);
      }
    });
  }, [value, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current!;
      const start = ta.selectionStart;
      const newValue = value.slice(0, start) + '  ' + value.slice(ta.selectionEnd);
      onChange(newValue);
      requestAnimationFrame(() => ta.setSelectionRange(start + 2, start + 2));
    }
    if (e.ctrlKey || e.metaKey) {
      const map: Record<string, number> = { b: 0, i: 2, '`': 8 };
      const idx = map[e.key];
      if (idx !== undefined) {
        e.preventDefault();
        const item = TOOLBAR[idx];
        if (item && !item.separator) applyAction(item.action);
      }
    }
  };

  // Ctrl+V paste — intercept image files from clipboard
  const handlePaste = useCallback(async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((item) => item.type.startsWith('image/'));
    if (!imageItem) return; // let normal text paste through
    e.preventDefault();
    const file = imageItem.getAsFile();
    if (file) await handleImageUpload(file);
  }, [handleImageUpload]);

  // Drag-and-drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    for (const file of files) {
      await handleImageUpload(file);
    }
  }, [handleImageUpload]);

  // Toolbar upload button — file picker fallback
  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async () => {
      const files = Array.from(input.files ?? []);
      for (const file of files) await handleImageUpload(file);
    };
    input.click();
  };

  const viewBtn = (mode: ViewMode, icon: React.ReactNode, label: string) => (
    <button
      type="button"
      onClick={() => setView(mode)}
      title={label}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
        view === mode
          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <TooltipProvider delayDuration={400}>
      <div className={`border rounded-lg overflow-hidden transition-colors ${
        isDragOver
          ? 'border-blue-400 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900'
          : 'border-slate-200 dark:border-slate-800'
      }`}>

        {/* Toolbar */}
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex-wrap">
          {view !== 'preview' && (
            <>
              {TOOLBAR.map((item, i) =>
                item.separator ? (
                  <Separator key={i} orientation="vertical" className="mx-1 h-4" />
                ) : (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); applyAction(item.action); }}
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
                      >
                        {item.icon}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{item.label}</TooltipContent>
                  </Tooltip>
                )
              )}

              <Separator orientation="vertical" className="mx-1 h-4" />

              {/* Upload image button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={uploading}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-50"
                  >
                    {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Upload image (or paste / drop)</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="mx-1 h-4" />
              <MarkdownCheatSheet />
            </>
          )}

          <div className="ml-auto flex items-center gap-0.5 rounded-md border border-slate-200 dark:border-slate-800 p-0.5">
            {viewBtn('write', <Pencil size={12} />, 'Write')}
            {viewBtn('preview', <Eye size={12} />, 'Preview')}
            {viewBtn('split', <Columns2 size={12} />, 'Split')}
          </div>
        </div>

        {/* Editor area */}
        <div className={view === 'split' ? 'grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-800' : ''}>

          {view !== 'preview' && (
            <div className="relative">
              {isDragOver && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-50/80 dark:bg-blue-950/80 pointer-events-none">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Drop image to upload</p>
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                placeholder={uploading ? 'Uploading image…' : 'Write markdown here… paste or drop images to upload'}
                spellCheck
                className="w-full min-h-96 resize-y bg-white dark:bg-slate-950 p-4 font-mono text-sm text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none placeholder:text-slate-400"
              />
            </div>
          )}

          {view !== 'write' && (
            <div className="min-h-96 overflow-auto bg-white dark:bg-slate-950 p-4">
              {value.trim() ? (
                <MarkDownComponent markdown={value} />
              ) : (
                <p className="text-sm text-slate-400 italic">Nothing to preview.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-1 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Paste or drop images to upload
          </span>
          <span className="text-xs text-slate-400">{value.length} chars</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
