import {useEffect, useState} from 'react';
import {fetchServiceConfig, cmsUpdateServiceConfig, ServiceDto} from '@/app/api/cms';
import {toast} from 'sonner';
import TagInput from '../components/TagInput';
import IconSelector from '../components/IconSelector';

function relativeTime(date: Date): string {
	const secs = Math.floor((Date.now() - date.getTime()) / 1000);
	if (secs < 60) return 'just now';
	if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
	return `${Math.floor(secs / 3600)}h ago`;
}

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
		<div className="rep-row" style={{alignItems: 'flex-start'}}>
			<span className="grip">⠿</span>
			<div className="ico">
				{service.icon.split(':').pop()?.slice(0, 3) || '?'}
			</div>
			<div className="rmain">
				<div className="rt">
					{service.title || 'Untitled'}
					{service.mainTag && (
						<span className="tag" style={{marginLeft: 8}}>
							{service.mainTag}
						</span>
					)}
				</div>
				{service.description && (
					<div className="rs">{service.description}</div>
				)}
				{service.tags.length > 0 && (
					<div className="chips" style={{marginTop: 6}}>
						{service.tags.map((tag) => (
							<span key={tag} className="tag">
								{tag}
							</span>
						))}
					</div>
				)}
				<div className="field" style={{marginTop: 14}}>
					<label>Icon</label>
					<IconSelector
						value={service.icon}
						onChange={(icon) => set({icon})}
						placeholder="mdi:server"
					/>
				</div>
				<div className="frow">
					<div className="field">
						<label>Title</label>
						<input
							type="text"
							value={service.title}
							onChange={(e) => set({title: e.target.value})}
							placeholder="Web Development"
						/>
					</div>
					<div className="field">
						<label>Main tag</label>
						<input
							type="text"
							value={service.mainTag}
							onChange={(e) => set({mainTag: e.target.value})}
							placeholder="Backend"
						/>
					</div>
				</div>
				<div className="field">
					<label>Description</label>
					<textarea
						value={service.description}
						onChange={(e) => set({description: e.target.value})}
						placeholder="What this service covers..."
					/>
				</div>
				<div className="field">
					<label>Stack tags</label>
					<TagInput
						value={service.tags}
						onChange={(tags) => set({tags})}
						placeholder="React, Node.js — press Enter"
					/>
				</div>
			</div>
			<button
				type="button"
				className="rm"
				onClick={() => onRemove(index)}
			>
				Remove
			</button>
		</div>
	);
}

export default function CmsServiceConfig() {
	const [services, setServices] = useState<ServiceDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [savedAt, setSavedAt] = useState<Date | null>(null);

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
			setSavedAt(new Date());
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
		setServices((prev) => [
			...prev,
			{icon: '', title: '', mainTag: '', description: '', tags: []},
		]);

	if (loading) return <p>Loading...</p>;

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">Services Config</h1>
					<div className="sub">aj@khesir:~$ vim ./pages/services.json</div>
				</div>
				<a
					className="btn-ol"
					href="/work"
					target="_blank"
					rel="noreferrer"
				>
					Preview ↗
				</a>
			</div>

			<form className="cms-form" onSubmit={handleSubmit}>
				<div className="fsection">
					<div className="fhead">
						<h2>Services</h2>
						<button type="button" className="btn-ol" onClick={addService}>
							Add service
						</button>
					</div>
					<div className="rep">
						{services.map((service, i) => (
							<ServiceCard
								key={i}
								service={service}
								index={i}
								onChange={updateService}
								onRemove={removeService}
							/>
						))}
					</div>
				</div>

				<div className="save-bar">
					<button className="btn-new" type="submit" disabled={saving}>
						{saving ? 'Saving...' : 'Save services config'}
					</button>
					{savedAt && (
						<span className="hint">last saved {relativeTime(savedAt)}</span>
					)}
				</div>
			</form>
		</>
	);
}
