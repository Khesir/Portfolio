import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Row {
  syntax: string;
  result: string;
  note?: string;
}

interface Section {
  title: string;
  rows: Row[];
}

const SECTIONS: Section[] = [
  {
    title: 'Text formatting',
    rows: [
      { syntax: '**bold**', result: 'bold', note: 'Ctrl+B' },
      { syntax: '_italic_', result: 'italic', note: 'Ctrl+I' },
      { syntax: '~~strikethrough~~', result: 'strikethrough' },
      { syntax: '`inline code`', result: 'inline code', note: 'Ctrl+`' },
    ],
  },
  {
    title: 'Headings',
    rows: [
      { syntax: '# Heading 1', result: 'H1' },
      { syntax: '## Heading 2', result: 'H2' },
      { syntax: '### Heading 3', result: 'H3' },
    ],
  },
  {
    title: 'Lists',
    rows: [
      { syntax: '- item', result: 'Unordered list' },
      { syntax: '1. item', result: 'Ordered list' },
      { syntax: '- [ ] task', result: 'Task list (unchecked)' },
      { syntax: '- [x] task', result: 'Task list (checked)' },
    ],
  },
  {
    title: 'Blocks',
    rows: [
      { syntax: '> quote', result: 'Blockquote' },
      { syntax: '```js\ncode\n```', result: 'Code block (with lang)' },
      { syntax: '---', result: 'Horizontal rule' },
    ],
  },
  {
    title: 'Links & Images',
    rows: [
      { syntax: '[text](url)', result: 'Link' },
      { syntax: '![alt](url)', result: 'Image' },
      { syntax: '[![alt](img)](url)', result: 'Linked image' },
    ],
  },
  {
    title: 'Table',
    rows: [
      {
        syntax: '| A | B |\n| --- | --- |\n| 1 | 2 |',
        result: 'Table',
      },
      {
        syntax: '| Left | Center | Right |\n| :--- | :---: | ---: |',
        result: 'Column alignment',
      },
    ],
  },
  {
    title: 'Embeds (special)',
    rows: [
      {
        syntax: '[video](https://youtube.com/watch?v=ID)',
        result: 'YouTube embed',
        note: 'youtube.com or vimeo.com URLs auto-embed',
      },
      {
        syntax: '[video](https://...file.mp4)',
        result: 'Video file embed',
        note: '.mp4 .webm .mov .ogv',
      },
      {
        syntax: '[tweet](https://x.com/khesirr/status/ID)',
        result: 'Tweet embed',
        note: 'Must be your x.com/khesirr/status/ URL',
      },
    ],
  },
];

export default function MarkdownCheatSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
          >
            <HelpCircle size={15} />
          </button>
        </TooltipTrigger>
        <TooltipContent>Markdown cheat sheet</TooltipContent>
      </Tooltip>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 dark:bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative z-10 w-[420px] max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
              <h2 className="text-sm font-semibold">Markdown Cheat Sheet</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-4 space-y-5">
              {SECTIONS.map((section) => (
                <div key={section.title}>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {section.title}
                  </p>
                  <table className="w-full text-xs">
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {section.rows.map((row, i) => (
                        <tr key={i}>
                          <td className="py-1.5 pr-3 font-mono text-slate-500 dark:text-slate-400 whitespace-pre">
                            {row.syntax}
                          </td>
                          <td className="py-1.5 text-slate-700 dark:text-slate-300">
                            {row.result}
                          </td>
                          {row.note && (
                            <td className="py-1.5 pl-2 text-slate-400 italic text-right">
                              {row.note}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 space-y-1">
                <p>Paste or drop images → auto-upload to bucket</p>
                <p>Tab inserts 2 spaces inside code blocks</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
