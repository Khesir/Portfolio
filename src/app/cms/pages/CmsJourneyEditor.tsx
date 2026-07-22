import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import type {JourneyEntry, JourneyPosition} from '@/data/journey';
import {
	fetchLocalSection,
	saveLocalSection,
	uniqueSlug,
} from '@/app/api/cms-local';
import {toast} from 'sonner';
import TagInput from '../components/TagInput';
import ConfirmDialog from '../components/ConfirmDialog';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

const IS_DEV = import.meta.env.DEV;

const emptyPosition = (): JourneyPosition => ({
	title: '',
	yearRange: '',
	current: false,
	description: '',
	skills: [],
	detail: '',
});

export default function CmsJourneyEditor() {
	const {id} = useParams();
	const isEdit = Boolean(id);
	const navigate = useNavigate();

	const [company, setCompany] = useState('');
	const [positions, setPositions] = useState<JourneyPosition[]>([
		emptyPosition(),
	]);
	const [draft, setDraft] = useState(true);
	const [saving, setSaving] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [existingIds, setExistingIds] = useState<string[]>([]);

	useEffect(() => {
		fetchLocalSection<JourneyEntry[]>('journey').then((all) => {
			setExistingIds(all.map((j) => j.id));
			if (!isEdit || !id) return;
			const existing = all.find((j) => j.id === id);
			if (!existing) return;
			setCompany(existing.company);
			setPositions(existing.positions);
			setDraft(existing.draft);
		});
	}, [id, isEdit]);

	const slug = id ?? (company ? uniqueSlug(company, existingIds) : 'untitled');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			const all = await fetchLocalSection<JourneyEntry[]>('journey');
			const entry: JourneyEntry = {
				id: isEdit && id ? id : slug,
				company,
				positions,
				draft,
			};
			const next = isEdit
				? all.map((j) => (j.id === id ? entry : j))
				: [...all, entry];
			await saveLocalSection('journey', next);
			toast.success(draft ? 'Saved as draft' : 'Published');
			navigate('/cms/journey');
		} catch {
			toast.error('Failed to save');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!id) return;
		try {
			const all = await fetchLocalSection<JourneyEntry[]>('journey');
			await saveLocalSection(
				'journey',
				all.filter((j) => j.id !== id),
			);
			toast.success('Company deleted');
			navigate('/cms/journey');
		} catch {
			toast.error('Failed to delete');
		}
	};

	const updatePosition = (i: number, updated: JourneyPosition) =>
		setPositions((prev) => prev.map((p, idx) => (idx === i ? updated : p)));
	const removePosition = (i: number) =>
		setPositions((prev) => prev.filter((_, idx) => idx !== i));
	const addPosition = () => setPositions((prev) => [...prev, emptyPosition()]);

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">{isEdit ? 'Edit' : 'New'} Company</h1>
					<div className="sub">
						aj@khesir:~$ {isEdit ? 'vim' : 'touch'} ./journey/{slug}
					</div>
				</div>
				{isEdit && (
					<button
						className="btn-ol"
						type="button"
						onClick={() => setConfirmOpen(true)}
					>
						Delete
					</button>
				)}
			</div>
			<LocalOnlyNotice />
			<form className="cms-form" onSubmit={handleSubmit}>
				<fieldset
					disabled={!IS_DEV}
					style={{border: 'none', padding: 0, margin: 0}}
				>
					<div className="fsection">
						<h2>Company</h2>
						<div className="field">
							<label>Name</label>
							<input
								value={company}
								onChange={(e) => setCompany(e.target.value)}
								required
							/>
						</div>
						<div className="field">
							<label>Draft</label>
							<button
								type="button"
								className={`feat${draft ? ' on' : ''}`}
								onClick={() => setDraft((d) => !d)}
							>
								{draft ? 'Draft — hidden from site' : 'Published'}
							</button>
						</div>
					</div>

					<div className="fsection">
						<div className="fhead">
							<h2>Positions</h2>
							<button type="button" className="btn-ol" onClick={addPosition}>
								Add position
							</button>
						</div>
						<div className="rep">
							{positions.map((pos, i) => (
								<div
									key={i}
									className="rep-row"
									style={{alignItems: 'flex-start'}}
								>
									<div className="rmain">
										<div className="frow">
											<div className="field">
												<label>Title</label>
												<input
													value={pos.title}
													onChange={(e) =>
														updatePosition(i, {...pos, title: e.target.value})
													}
												/>
											</div>
											<div className="field">
												<label>Year range</label>
												<input
													value={pos.yearRange}
													onChange={(e) =>
														updatePosition(i, {
															...pos,
															yearRange: e.target.value,
														})
													}
													placeholder="2024 — 25"
												/>
											</div>
										</div>
										<div className="field">
											<label>Current</label>
											<button
												type="button"
												className={`feat${pos.current ? ' on' : ''}`}
												onClick={() =>
													updatePosition(i, {...pos, current: !pos.current})
												}
											>
												{pos.current ? 'Current' : 'Not current'}
											</button>
										</div>
										<div className="field">
											<label>Description</label>
											<textarea
												value={pos.description}
												onChange={(e) =>
													updatePosition(i, {
														...pos,
														description: e.target.value,
													})
												}
											/>
										</div>
										<div className="field">
											<label>Skills</label>
											<TagInput
												value={pos.skills}
												onChange={(skills) =>
													updatePosition(i, {...pos, skills})
												}
											/>
										</div>
										<div className="field mono">
											<label>
												Detail <span className="opt">· markdown, optional</span>
											</label>
											<textarea
												value={pos.detail ?? ''}
												onChange={(e) =>
													updatePosition(i, {...pos, detail: e.target.value})
												}
											/>
										</div>
									</div>
									<button
										type="button"
										className="rm"
										onClick={() => removePosition(i)}
									>
										Remove
									</button>
								</div>
							))}
						</div>
					</div>

					<div className="save-bar">
						<button className="btn-new" type="submit" disabled={saving}>
							{isEdit ? 'Save changes' : 'Create'}
						</button>
					</div>
				</fieldset>
			</form>
			<ConfirmDialog
				open={confirmOpen}
				itemName={company}
				onConfirm={handleDelete}
				onCancel={() => setConfirmOpen(false)}
			/>
		</>
	);
}
