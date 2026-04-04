import {useEffect, useState} from 'react';
import {fetchServiceConfig, cmsUpdateServiceConfig, ServiceDto} from '@/app/api/cms';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {toast} from 'sonner';
import {Icon} from '@iconify/react';
import TagInput from '../components/TagInput';
import IconSelector from '../components/IconSelector';

// --- Live preview ---

function ServicePreview({services}: {services: ServiceDto[]}) {
	if (services.length === 0) {
		return (
			<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
				<p className="text-slate-400 text-xs italic">
					Add a service to see a preview.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{services.map((service, i) => (
				<div
					key={i}
					className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex gap-3"
				>
					{/* Icon */}
					<div className="w-9 h-9 shrink-0 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center">
						{service.icon ? (
							<Icon
								icon={service.icon}
								className="w-5 h-5 text-blue-600 dark:text-blue-400"
							/>
						) : (
							<span className="text-blue-300 text-xs">?</span>
						)}
					</div>

					{/* Content */}
					<div className="flex-1 min-w-0 space-y-1.5">
						<div className="flex items-center gap-2 flex-wrap">
							<p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
								{service.title || 'Untitled'}
							</p>
							{service.mainTag && (
								<span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
									{service.mainTag}
								</span>
							)}
						</div>
						{service.description && (
							<p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
								{service.description}
							</p>
						)}
						{service.tags.length > 0 && (
							<div className="flex flex-wrap gap-1">
								{service.tags.map((tag) => (
									<span
										key={tag}
										className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
									>
										{tag}
									</span>
								))}
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

// --- Service card editor ---

function ServiceCard({
	service,
	index,
	onChange,
	onRemove,
}: {
	service: ServiceDto;
	index: number;
	onChange: (index: number, updated: ServiceDto) => void;
	onRemove: (index: number) => void;
}) {
	const set = (patch: Partial<ServiceDto>) =>
		onChange(index, {...service, ...patch});

	return (
		<div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-3">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium text-slate-500">
					Service {index + 1}
				</span>
				<button
					type="button"
					onClick={() => onRemove(index)}
					className="text-xs text-red-400 hover:text-red-600 transition-colors"
				>
					Remove
				</button>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs">Icon</Label>
				<IconSelector
					value={service.icon}
					onChange={(icon) => set({icon})}
					placeholder="mdi:server"
				/>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<div className="space-y-1.5">
					<Label className="text-xs">Title</Label>
					<Input
						value={service.title}
						onChange={(e) => set({title: e.target.value})}
						placeholder="Web Development"
						className="text-sm"
					/>
				</div>
				<div className="space-y-1.5">
					<Label className="text-xs">Main Tag</Label>
					<Input
						value={service.mainTag}
						onChange={(e) => set({mainTag: e.target.value})}
						placeholder="Backend"
						className="text-sm"
					/>
				</div>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs">Description</Label>
				<Textarea
					value={service.description}
					onChange={(e) => set({description: e.target.value})}
					placeholder="What this service covers..."
					className="text-sm min-h-20 resize-y"
				/>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs">Stack Tags</Label>
				<TagInput
					value={service.tags}
					onChange={(tags) => set({tags})}
					placeholder="React, Node.js — press Enter"
				/>
			</div>
		</div>
	);
}

// --- Page ---

export default function CmsServiceConfig() {
	const [services, setServices] = useState<ServiceDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [previewOpen, setPreviewOpen] = useState(false);

	useEffect(() => {
		fetchServiceConfig()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.then((data: any) => setServices(data?.services ?? []))
			.catch(() => toast.error('Failed to load service config'))
			.finally(() => setLoading(false));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			await cmsUpdateServiceConfig({services});
			toast.success('Services saved');
		} catch {
			toast.error('Failed to save services');
		} finally {
			setSaving(false);
		}
	};

	const updateService = (index: number, updated: ServiceDto) =>
		setServices((prev) => prev.map((s, i) => (i === index ? updated : s)));
	const removeService = (index: number) =>
		setServices((prev) => prev.filter((_, i) => i !== index));
	const addService = () =>
		setServices((prev) => [...prev, {icon: '', title: '', mainTag: '', description: '', tags: []}]);

	if (loading) return <p className="text-slate-400 text-sm">Loading...</p>;

	return (
		<>
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">Services Config</h1>
				<div className="flex items-center gap-2">
					<Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}>
						Preview
					</Button>
					<Button type="button" variant="outline" onClick={addService}>
						Add Service
					</Button>
				</div>
			</div>
			<form onSubmit={handleSubmit} className="space-y-4">
				{services.length === 0 && (
					<p className="text-sm text-slate-400">
						No services yet. Click &quot;Add Service&quot; to get started.
					</p>
				)}
				{services.map((service, i) => (
					<ServiceCard
						key={i}
						service={service}
						index={i}
						onChange={updateService}
						onRemove={removeService}
					/>
				))}
				{services.length > 0 && (
					<div className="pt-2">
						<Button type="submit" disabled={saving}>
							{saving ? 'Saving...' : 'Save Services'}
						</Button>
					</div>
				)}
			</form>
		</div>

		<Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
			<DialogContent
				className="overflow-auto resize max-w-none max-h-[90vh]"
				style={{width: 540, minWidth: 400, minHeight: 340}}
			>
				<DialogHeader>
					<DialogTitle>Services Preview</DialogTitle>
				</DialogHeader>
				<ServicePreview services={services} />
			</DialogContent>
		</Dialog>
		</>
	);
}
