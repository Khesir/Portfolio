import {useState} from 'react';
import {HelpCircle, X} from 'lucide-react';

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
			{syntax: '**bold**', result: 'bold', note: 'Ctrl+B'},
			{syntax: '_italic_', result: 'italic', note: 'Ctrl+I'},
			{syntax: '~~strikethrough~~', result: 'strikethrough'},
			{syntax: '`inline code`', result: 'inline code', note: 'Ctrl+`'},
		],
	},
	{
		title: 'Headings',
		rows: [
			{syntax: '# Heading 1', result: 'H1'},
			{syntax: '## Heading 2', result: 'H2'},
			{syntax: '### Heading 3', result: 'H3'},
		],
	},
	{
		title: 'Lists',
		rows: [
			{syntax: '- item', result: 'Unordered list'},
			{syntax: '1. item', result: 'Ordered list'},
			{syntax: '- [ ] task', result: 'Task list (unchecked)'},
			{syntax: '- [x] task', result: 'Task list (checked)'},
		],
	},
	{
		title: 'Blocks',
		rows: [
			{syntax: '> quote', result: 'Blockquote'},
			{syntax: '```js\ncode\n```', result: 'Code block (with lang)'},
			{syntax: '---', result: 'Horizontal rule'},
		],
	},
	{
		title: 'Links & Images',
		rows: [
			{syntax: '[text](url)', result: 'Link'},
			{syntax: '![alt](url)', result: 'Image'},
			{syntax: '[![alt](img)](url)', result: 'Linked image'},
		],
	},
	{
		title: 'Table',
		rows: [
			{syntax: '| A | B |\n| --- | --- |\n| 1 | 2 |', result: 'Table'},
			{syntax: '| Left | Center | Right |\n| :--- | :---: | ---: |', result: 'Column alignment'},
		],
	},
	{
		title: 'Embeds (special)',
		rows: [
			{syntax: '[video](https://youtube.com/watch?v=ID)', result: 'YouTube embed', note: 'youtube.com or vimeo.com URLs auto-embed'},
			{syntax: '[video](https://...file.mp4)', result: 'Video file embed', note: '.mp4 .webm .mov .ogv'},
			{syntax: '[tweet](https://x.com/khesirr/status/ID)', result: 'Tweet embed', note: 'Must be your x.com/khesirr/status/ URL'},
		],
	},
];

export default function MarkdownCheatSheet() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				title="Markdown cheat sheet"
				onClick={() => setOpen(true)}
				style={{
					padding: 5, borderRadius: 7, border: 'none', cursor: 'pointer',
					background: 'none', color: 'var(--ink-3)',
					display: 'flex', alignItems: 'center', justifyContent: 'center',
				}}
				onMouseEnter={(e) => {(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.07)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)';}}
				onMouseLeave={(e) => {(e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-3)';}}
			>
				<HelpCircle size={15} />
			</button>

			{open && (
				<div style={{position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 16}}>
					<div
						style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)'}}
						onClick={() => setOpen(false)}
					/>

					<div style={{
						position: 'relative', zIndex: 10,
						width: 420, maxHeight: '90vh', overflowY: 'auto',
						background: 'var(--panel)',
						border: '1px solid var(--line-2)',
						borderRadius: 'var(--radius-sm)',
						boxShadow: 'var(--shadow-lg)',
					}}>
						<div style={{
							display: 'flex', alignItems: 'center', justifyContent: 'space-between',
							padding: '12px 18px',
							borderBottom: '1px solid var(--line)',
							position: 'sticky', top: 0,
							background: 'var(--panel)',
						}}>
							<h2 style={{fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)', margin: 0}}>
								Markdown Cheat Sheet
							</h2>
							<button
								type="button"
								onClick={() => setOpen(false)}
								style={{
									padding: 4, borderRadius: 6, border: 'none', cursor: 'pointer',
									background: 'none', color: 'var(--ink-4)',
									display: 'flex', alignItems: 'center',
								}}
							>
								<X size={14} />
							</button>
						</div>

						<div style={{padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 20}}>
							{SECTIONS.map((section) => (
								<div key={section.title}>
									<p style={{fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 8}}>
										{section.title}
									</p>
									<table style={{width: '100%', borderCollapse: 'collapse'}}>
										<tbody>
											{section.rows.map((row, i) => (
												<tr key={i} style={{borderBottom: '1px solid var(--line)'}}>
													<td style={{padding: '6px 12px 6px 0', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)', whiteSpace: 'pre'}}>
														{row.syntax}
													</td>
													<td style={{padding: '6px 0', fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)'}}>
														{row.result}
													</td>
													{row.note && (
														<td style={{padding: '6px 0 6px 8px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-4)', fontStyle: 'italic', textAlign: 'right'}}>
															{row.note}
														</td>
													)}
												</tr>
											))}
										</tbody>
									</table>
								</div>
							))}

							<div style={{paddingTop: 12, borderTop: '1px solid var(--line)', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-4)', display: 'flex', flexDirection: 'column', gap: 4}}>
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
