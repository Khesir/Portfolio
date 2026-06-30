import {useRef, useState, useCallback} from 'react';
import {
	Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
	Code, CodeSquare, Quote, List, ListOrdered, Link2, Image,
	Minus, Table, Eye, Pencil, Columns2, Upload, Loader2,
} from 'lucide-react';
import {MarkDownComponent} from '@/app/_components/readPage/readingPage';
import {cmsUploadImage} from '@/app/api/cms';
import {toast} from 'sonner';
import MarkdownCheatSheet from './MarkdownCheatSheet';

interface MarkdownEditorProps {
	value: string;
	onChange: (v: string) => void;
}

type ViewMode = 'write' | 'preview' | 'split';

interface ToolbarAction {
	icon: React.ReactNode;
	label: string;
	action: (selected: string) => {text: string; offset: number};
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
	{icon: <Bold size={15} />, label: 'Bold', action: (s) => s ? {text: `**${s}**`, offset: 2} : {text: '**bold**', offset: 2}},
	{icon: <Italic size={15} />, label: 'Italic', action: (s) => s ? {text: `_${s}_`, offset: 1} : {text: '_italic_', offset: 1}},
	{icon: <Strikethrough size={15} />, label: 'Strikethrough', action: (s) => s ? {text: `~~${s}~~`, offset: 2} : {text: '~~strikethrough~~', offset: 2}},
	{separator: true},
	{icon: <Heading1 size={15} />, label: 'Heading 1', action: (s) => ({text: `# ${s || 'Heading 1'}`, offset: 2})},
	{icon: <Heading2 size={15} />, label: 'Heading 2', action: (s) => ({text: `## ${s || 'Heading 2'}`, offset: 3})},
	{icon: <Heading3 size={15} />, label: 'Heading 3', action: (s) => ({text: `### ${s || 'Heading 3'}`, offset: 4})},
	{separator: true},
	{icon: <Code size={15} />, label: 'Inline code', action: (s) => s ? {text: `\`${s}\``, offset: 1} : {text: '`code`', offset: 1}},
	{icon: <CodeSquare size={15} />, label: 'Code block', action: (s) => ({text: `\`\`\`\n${s || 'code'}\n\`\`\``, offset: 4})},
	{icon: <Quote size={15} />, label: 'Blockquote', action: (s) => ({text: `> ${s || 'quote'}`, offset: 2})},
	{separator: true},
	{
		icon: <List size={15} />, label: 'Unordered list',
		action: (s) => ({text: s ? s.split('\n').map((l) => `- ${l}`).join('\n') : '- Item 1\n- Item 2\n- Item 3', offset: 2}),
	},
	{
		icon: <ListOrdered size={15} />, label: 'Ordered list',
		action: (s) => ({text: s ? s.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n') : '1. Item 1\n2. Item 2\n3. Item 3', offset: 3}),
	},
	{separator: true},
	{icon: <Link2 size={15} />, label: 'Link', action: (s) => ({text: `[${s || 'link text'}](url)`, offset: 1})},
	{icon: <Image size={15} />, label: 'Image', action: (s) => ({text: `![${s || 'alt text'}](image-url)`, offset: 2})},
	{icon: <Table size={15} />, label: 'Table', action: () => ({text: '| Header | Header |\n| --- | --- |\n| Cell | Cell |', offset: 0})},
	{icon: <Minus size={15} />, label: 'Horizontal rule', action: () => ({text: '\n---\n', offset: 0})},
];

const S = {
	wrap: (dragOver: boolean): React.CSSProperties => ({
		border: dragOver ? '1px solid rgba(var(--accent-rgb),.5)' : '1px solid var(--line)',
		borderRadius: 'var(--radius-sm)',
		overflow: 'hidden',
		boxShadow: dragOver ? '0 0 0 3px rgba(var(--accent-rgb),.15)' : undefined,
	}),
	toolbar: {
		display: 'flex', alignItems: 'center', gap: 2,
		padding: '6px 10px', flexWrap: 'wrap' as const,
		borderBottom: '1px solid var(--line)',
		background: 'var(--panel-2)',
	},
	tbBtn: (active = false): React.CSSProperties => ({
		padding: '5px', borderRadius: 7, border: 'none', cursor: 'pointer',
		background: active ? 'rgba(255,255,255,.08)' : 'none',
		color: active ? 'var(--ink)' : 'var(--ink-3)',
		display: 'flex', alignItems: 'center', justifyContent: 'center',
		transition: 'background .12s, color .12s',
	}),
	sep: {
		width: 1, height: 16, background: 'var(--line-2)',
		margin: '0 4px', flexShrink: 0,
	} as React.CSSProperties,
	viewBtnGroup: {
		display: 'flex', alignItems: 'center', gap: 2,
		marginLeft: 'auto',
		border: '1px solid var(--line)', borderRadius: 8, padding: 2,
	} as React.CSSProperties,
	viewBtn: (active: boolean): React.CSSProperties => ({
		display: 'flex', alignItems: 'center', gap: 5,
		padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
		fontFamily: 'var(--mono)', fontSize: 11,
		background: active ? 'rgba(255,255,255,.07)' : 'none',
		color: active ? 'var(--ink)' : 'var(--ink-4)',
		transition: 'background .12s, color .12s',
	}),
	editorPane: {
		background: 'rgba(255,255,255,.02)',
	} as React.CSSProperties,
	textarea: {
		width: '100%', minHeight: 384, resize: 'vertical' as const,
		background: 'transparent', border: 'none', outline: 'none',
		padding: '16px 18px',
		fontFamily: 'var(--mono)', fontSize: 13,
		color: 'var(--ink)', lineHeight: 1.7,
	},
	preview: {
		minHeight: 384, overflowY: 'auto' as const,
		padding: '16px 18px',
		background: 'transparent',
	},
	footer: {
		display: 'flex', alignItems: 'center', justifyContent: 'space-between',
		padding: '6px 14px',
		borderTop: '1px solid var(--line)',
		background: 'var(--panel-2)',
		fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-4)',
	} as React.CSSProperties,
};

export default function MarkdownEditor({value, onChange}: MarkdownEditorProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [view, setView] = useState<ViewMode>('write');
	const [uploading, setUploading] = useState(false);
	const [isDragOver, setIsDragOver] = useState(false);

	const handleImageUpload = useCallback(async (file: File) => {
		if (!file.type.startsWith('image/')) {
			toast.error('Only image files can be uploaded');
			return;
		}
		setUploading(true);
		const placeholder = `![Uploading ${file.name}…]()`;
		const ta = textareaRef.current;
		const insertPos = ta ? ta.selectionStart : value.length;
		const withPlaceholder = value.slice(0, insertPos) + placeholder + value.slice(insertPos);
		onChange(withPlaceholder);
		try {
			const url = await cmsUploadImage(file);
			onChange(withPlaceholder.replace(placeholder, `![${file.name}](${url})`));
			toast.success('Image uploaded');
		} catch {
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
		const {text, offset} = action(selected);
		const before = value.slice(0, start);
		const after = value.slice(end);
		const needsNewline = before.length > 0 && !before.endsWith('\n') && (
			text.startsWith('#') || text.startsWith('>') || text.startsWith('-') ||
			text.startsWith('1.') || text.startsWith('```') || text.startsWith('\n---')
		);
		const prefix = needsNewline ? '\n' : '';
		onChange(before + prefix + text + after);
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
			onChange(value.slice(0, start) + '  ' + value.slice(ta.selectionEnd));
			requestAnimationFrame(() => ta.setSelectionRange(start + 2, start + 2));
		}
		if (e.ctrlKey || e.metaKey) {
			const map: Record<string, number> = {b: 0, i: 2, '`': 8};
			const idx = map[e.key];
			if (idx !== undefined) {
				e.preventDefault();
				const item = TOOLBAR[idx];
				if (item && !item.separator) applyAction(item.action);
			}
		}
	};

	const handlePaste = useCallback(async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
		const imageItem = Array.from(e.clipboardData.items).find((i) => i.type.startsWith('image/'));
		if (!imageItem) return;
		e.preventDefault();
		const file = imageItem.getAsFile();
		if (file) await handleImageUpload(file);
	}, [handleImageUpload]);

	const handleDrop = useCallback(async (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		for (const file of Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))) {
			await handleImageUpload(file);
		}
	}, [handleImageUpload]);

	const handleUploadClick = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.multiple = true;
		input.onchange = async () => {
			for (const file of Array.from(input.files ?? [])) await handleImageUpload(file);
		};
		input.click();
	};

	return (
		<div style={S.wrap(isDragOver)}>
			<div style={S.toolbar}>
				{view !== 'preview' && (
					<>
						{TOOLBAR.map((item, i) =>
							item.separator
								? <span key={i} style={S.sep} />
								: (
									<button
										key={i}
										type="button"
										title={item.label}
										onMouseDown={(e) => {e.preventDefault(); applyAction(item.action);}}
										style={S.tbBtn()}
										onMouseEnter={(e) => {(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.07)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)';}}
										onMouseLeave={(e) => {(e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-3)';}}
									>
										{item.icon}
									</button>
								)
						)}

						<span style={S.sep} />

						<button
							type="button"
							title={uploading ? 'Uploading…' : 'Upload image (or paste / drop)'}
							onClick={handleUploadClick}
							disabled={uploading}
							style={{...S.tbBtn(), opacity: uploading ? 0.5 : 1}}
						>
							{uploading ? <Loader2 size={15} style={{animation: 'spin 1s linear infinite'}} /> : <Upload size={15} />}
						</button>

						<span style={S.sep} />
						<MarkdownCheatSheet />
					</>
				)}

				<div style={S.viewBtnGroup}>
					{(['write', 'preview', 'split'] as ViewMode[]).map((m) => (
						<button key={m} type="button" onClick={() => setView(m)} style={S.viewBtn(view === m)}>
							{m === 'write' ? <Pencil size={11} /> : m === 'preview' ? <Eye size={11} /> : <Columns2 size={11} />}
							{m.charAt(0).toUpperCase() + m.slice(1)}
						</button>
					))}
				</div>
			</div>

			<div style={view === 'split' ? {display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: 0} : {}}>
				{view !== 'preview' && (
					<div style={{position: 'relative', ...S.editorPane}}>
						{isDragOver && (
							<div style={{
								position: 'absolute', inset: 0, zIndex: 10,
								display: 'flex', alignItems: 'center', justifyContent: 'center',
								background: 'rgba(var(--accent-rgb),.08)', pointerEvents: 'none',
							}}>
								<p style={{fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--accent)'}}>Drop image to upload</p>
							</div>
						)}
						<textarea
							ref={textareaRef}
							value={value}
							onChange={(e) => onChange(e.target.value)}
							onKeyDown={handleKeyDown}
							onPaste={handlePaste}
							onDragOver={(e) => {e.preventDefault(); setIsDragOver(true);}}
							onDragLeave={() => setIsDragOver(false)}
							onDrop={handleDrop}
							placeholder={uploading ? 'Uploading image…' : 'Write markdown here… paste or drop images to upload'}
							spellCheck
							style={S.textarea}
						/>
					</div>
				)}

				{view !== 'write' && (
					<div style={{
						...S.preview,
						borderLeft: view === 'split' ? '1px solid var(--line)' : undefined,
					}}>
						{value.trim()
							? <MarkDownComponent markdown={value} />
							: <p style={{fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-4)', fontStyle: 'italic'}}>Nothing to preview.</p>
						}
					</div>
				)}
			</div>

			<div style={S.footer}>
				<span>Paste or drop images to upload</span>
				<span>{value.length} chars</span>
			</div>
		</div>
	);
}
