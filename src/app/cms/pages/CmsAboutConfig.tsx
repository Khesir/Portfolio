import {useEffect, useState} from 'react';
import {
	fetchAboutConfig,
	cmsUpdateAboutConfig,
	SkillCategoryDto,
	BannerButton,
} from '@/app/api/cms';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';
import {Badge} from '@/components/ui/badge';
import {toast} from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TagInput from '../components/TagInput';
import MarkdownEditor from '../components/MarkdownEditor';
import BannerButtonEditor from '../components/BannerButtonEditor';
import ImageUpload from '../components/ImageUpload';

// --- Live preview ---

function AboutPreview({
	professionalSummary,
	technicalSkills,
	coreCompetencies,
}: {
	professionalSummary: string;
	technicalSkills: SkillCategoryDto[];
	coreCompetencies: string[];
}) {
	const isEmpty =
		!professionalSummary &&
		technicalSkills.length === 0 &&
		coreCompetencies.length === 0;

	if (isEmpty) {
		return (
			<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
				<p className="text-slate-400 text-xs italic">
					Fill in the form to see a preview.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{/* Summary */}
			{professionalSummary && (
				<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
						Summary
					</p>
					<div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed">
						<ReactMarkdown remarkPlugins={[remarkGfm]}>
							{professionalSummary}
						</ReactMarkdown>
					</div>
				</div>
			)}

			{/* Technical skills */}
			{technicalSkills.length > 0 && (
				<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
						Technical Skills
					</p>
					{technicalSkills.map((cat, i) => (
						<div key={i}>
							<p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
								{cat.category || '—'}
							</p>
							<div className="flex flex-wrap gap-1">
								{cat.items.map((item) => (
									<span
										key={item}
										className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
									>
										{item}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Core competencies */}
			{coreCompetencies.length > 0 && (
				<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
						Core Competencies
					</p>
					<div className="flex flex-wrap gap-1.5">
						{coreCompetencies.map((c) => (
							<Badge key={c} variant="secondary" className="text-xs">
								{c}
							</Badge>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

// --- Skill category editor ---

function SkillCategoryCard({
	category,
	index,
	onChange,
	onRemove,
}: {
	category: SkillCategoryDto;
	index: number;
	onChange: (index: number, updated: SkillCategoryDto) => void;
	onRemove: (index: number) => void;
}) {
	return (
		<div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-3">
			<div className="flex items-center gap-3">
				<Input
					value={category.category}
					onChange={(e) =>
						onChange(index, {...category, category: e.target.value})
					}
					placeholder="Category name (e.g. Frontend)"
					className="text-sm font-medium"
				/>
				<button
					type="button"
					onClick={() => onRemove(index)}
					className="text-xs text-red-400 hover:text-red-600 transition-colors shrink-0"
				>
					Remove
				</button>
			</div>
			<TagInput
				value={category.items}
				onChange={(items) => onChange(index, {...category, items})}
				placeholder="Add skill, press Enter"
			/>
		</div>
	);
}

// --- Page ---

export default function CmsAboutConfig() {
	const [lastUpdatedAt, setLastUpdatedAt] = useState('');
	const [location, setLocation] = useState('');
	const [profileImageUrl, setProfileImageUrl] = useState('');
	const [aboutButtons, setAboutButtons] = useState<BannerButton[]>([]);
	const [professionalSummary, setProfessionalSummary] = useState('');
	const [technicalSkills, setTechnicalSkills] = useState<SkillCategoryDto[]>([]);
	const [coreCompetencies, setCoreCompetencies] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [previewOpen, setPreviewOpen] = useState(false);

	useEffect(() => {
		fetchAboutConfig()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.then((data: any) => {
				setLastUpdatedAt(data?.lastUpdatedAt ?? '');
				setLocation(data?.location ?? '');
				setProfileImageUrl(data?.profileImageUrl ?? '');
				setAboutButtons(data?.aboutButtons ?? []);
				setProfessionalSummary(data?.professionalSummary ?? '');
				setTechnicalSkills(data?.technicalSkills ?? []);
				setCoreCompetencies(data?.coreCompetencies ?? []);
			})
			.catch(() => toast.error('Failed to load about config'))
			.finally(() => setLoading(false));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			await cmsUpdateAboutConfig({
				aboutTitle: '',
				lastUpdatedAt,
				location,
				profileImageUrl,
				aboutButtons,
				professionalSummary,
				technicalSkills,
				coreCompetencies,
			});
			toast.success('About config saved');
		} catch {
			toast.error('Failed to save config');
		} finally {
			setSaving(false);
		}
	};

	const updateSkillCategory = (index: number, updated: SkillCategoryDto) =>
		setTechnicalSkills((prev) => prev.map((c, i) => (i === index ? updated : c)));
	const removeSkillCategory = (index: number) =>
		setTechnicalSkills((prev) => prev.filter((_, i) => i !== index));
	const addSkillCategory = () =>
		setTechnicalSkills((prev) => [...prev, {category: '', items: []}]);

	const updateBtn = (i: number, b: BannerButton) =>
		setAboutButtons((prev) => prev.map((x, j) => (j === i ? b : x)));
	const removeBtn = (i: number) =>
		setAboutButtons((prev) => prev.filter((_, j) => j !== i));
	const addBtn = () =>
		setAboutButtons((prev) => [...prev, {label: '', action: 'contact'}]);

	if (loading) return <p className="text-slate-400 text-sm">Loading...</p>;

	return (
		<>
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">About Config</h1>
				<Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}>
					Preview
				</Button>
			</div>
			<form onSubmit={handleSubmit} className="space-y-8">

				{/* Header */}
				<section className="space-y-4">
					<h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
						Header
					</h2>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<Label>Location / Availability <span className="text-slate-400 font-normal text-xs">e.g. Remote / Flexible</span></Label>
							<Input
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								placeholder="Remote / Flexible"
							/>
						</div>
						<div className="space-y-1.5">
							<Label>Last Updated</Label>
							<Input
								type="date"
								value={lastUpdatedAt}
								onChange={(e) => setLastUpdatedAt(e.target.value)}
							/>
						</div>
					</div>
					<div className="space-y-1.5">
						<Label>Profile Image <span className="text-slate-400 font-normal text-xs">overrides Home config image</span></Label>
						<ImageUpload value={profileImageUrl} onChange={setProfileImageUrl} />
					</div>
				</section>

				<Separator />

				{/* Quick Action Buttons */}
				<section className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
							Quick Action Buttons
						</h2>
						<Button type="button" variant="outline" onClick={addBtn}>
							Add Button
						</Button>
					</div>
					{aboutButtons.length === 0 && (
						<p className="text-sm text-slate-400">No buttons yet.</p>
					)}
					{aboutButtons.map((btn, i) => (
						<BannerButtonEditor
							key={i}
							btn={btn}
							index={i}
							onChange={updateBtn}
							onRemove={removeBtn}
						/>
					))}
				</section>

				<Separator />

				<section className="space-y-4">
					<h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
						Professional Summary
					</h2>
					<MarkdownEditor
						value={professionalSummary}
						onChange={setProfessionalSummary}
					/>
				</section>

				<Separator />

				<section className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
							Technical Skills
						</h2>
						<Button type="button" variant="outline" onClick={addSkillCategory}>
							Add Category
						</Button>
					</div>
					{technicalSkills.length === 0 && (
						<p className="text-sm text-slate-400">No categories yet.</p>
					)}
					{technicalSkills.map((cat, i) => (
						<SkillCategoryCard
							key={i}
							category={cat}
							index={i}
							onChange={updateSkillCategory}
							onRemove={removeSkillCategory}
						/>
					))}
				</section>

				<Separator />

				<section className="space-y-4">
					<h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
						Core Competencies
					</h2>
					<TagInput
						value={coreCompetencies}
						onChange={setCoreCompetencies}
						placeholder="System Design, REST APIs — press Enter"
					/>
				</section>

				<div className="pt-2">
					<Button type="submit" disabled={saving}>
						{saving ? 'Saving...' : 'Save About Config'}
					</Button>
				</div>
			</form>
		</div>

		<Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
			<DialogContent
				className="overflow-auto resize max-w-none max-h-[90vh]"
				style={{width: 540, minWidth: 400, minHeight: 340}}
			>
				<DialogHeader>
					<DialogTitle>About Page Preview</DialogTitle>
				</DialogHeader>
				<AboutPreview
					professionalSummary={professionalSummary}
					technicalSkills={technicalSkills}
					coreCompetencies={coreCompetencies}
				/>
			</DialogContent>
		</Dialog>
		</>
	);
}
