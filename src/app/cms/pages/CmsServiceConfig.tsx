import {useEffect, useState} from 'react';
import type {ServiceEntry} from '@/data/services';
import {
	fetchLocalSection,
	saveLocalSection,
	uniqueSlug,
} from '@/app/api/cms-local';
import {toast} from 'sonner';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

const IS_DEV = import.meta.env.DEV;

function relativeTime(date: Date): string {
	const secs = Math.floor((Date.now() - date.getTime()) / 1000);
	if (secs < 60) return 'just now';
	if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
	return `${Math.floor(secs / 3600)}h ago`;
}

function ServiceCard({
	service,
	onChange,
	onRemove,
}: {
	service: ServiceEntry;
	onChange: (updated: ServiceEntry) => void;
	onRemove: () => void;
}) {
	const set = (patch: Partial<ServiceEntry>) =>
		onChange({...service, ...patch});

	return (
		<div className="rep-row" style={{alignItems: 'flex-start'}}>
			<div className="rmain">
				<div className="lname" style={{marginBottom: 10}}>
					{service.title || 'Untitled'}
					{service.draft && <span className="cbadge draft">draft</span>}
				</div>
				<div className="frow">
					<div className="field">
						<label>Title</label>
						<input
							type="text"
							value={service.title}
							onChange={(e) => set({title: e.target.value})}
							placeholder="Software Development"
						/>
					</div>
					<div className="field">
						<label>Badge</label>
						<input
							type="text"
							value={service.badge}
							onChange={(e) => set({badge: e.target.value})}
							placeholder="Web & Tools"
						/>
					</div>
				</div>
				<div className="field">
					<label>Description</label>
					<textarea
						value={service.description}
						onChange={(e) => set({description: e.target.value})}
					/>
				</div>
				<div className="frow">
					<div className="field">
						<label>Available</label>
						<button
							type="button"
							className={`feat${service.available ? ' on' : ''}`}
							onClick={() => set({available: !service.available})}
						>
							{service.available ? 'Available' : 'Not available'}
						</button>
					</div>
					<div className="field">
						<label>Draft</label>
						<button
							type="button"
							className={`feat${service.draft ? ' on' : ''}`}
							onClick={() => set({draft: !service.draft})}
						>
							{service.draft ? 'Draft — hidden from site' : 'Published'}
						</button>
					</div>
				</div>
			</div>
			<button type="button" className="rm" onClick={onRemove}>
				Remove
			</button>
		</div>
	);
}

export default function CmsServiceConfig() {
	const [services, setServices] = useState<ServiceEntry[]>([]);
	const [saving, setSaving] = useState(false);
	const [savedAt, setSavedAt] = useState<Date | null>(null);

	useEffect(() => {
		fetchLocalSection<ServiceEntry[]>('services').then(setServices);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			await saveLocalSection('services', services);
			setSavedAt(new Date());
			toast.success('Services saved');
		} catch {
			toast.error('Failed to save services');
		} finally {
			setSaving(false);
		}
	};

	const updateService = (i: number, updated: ServiceEntry) =>
		setServices((prev) => prev.map((s, idx) => (idx === i ? updated : s)));
	const removeService = (i: number) =>
		setServices((prev) => prev.filter((_, idx) => idx !== i));
	const addService = () =>
		setServices((prev) => [
			...prev,
			{
				id: uniqueSlug(
					'new-service',
					prev.map((s) => s.id),
				),
				title: '',
				badge: '',
				description: '',
				available: false,
				draft: true,
			},
		]);

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">Services Config</h1>
					<div className="sub">aj@khesir:~$ vim ./data/services.json</div>
				</div>
				<a className="btn-ol" href="/work" target="_blank" rel="noreferrer">
					Preview ↗
				</a>
			</div>
			<LocalOnlyNotice />

			<form className="cms-form" onSubmit={handleSubmit}>
				<fieldset
					disabled={!IS_DEV}
					style={{border: 'none', padding: 0, margin: 0}}
				>
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
									key={service.id}
									service={service}
									onChange={(updated) => updateService(i, updated)}
									onRemove={() => removeService(i)}
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
				</fieldset>
			</form>
		</>
	);
}
