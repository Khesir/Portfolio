import {useEffect, useState} from 'react';
import {
	fetchAboutConfig,
	cmsUpdateAboutConfig,
	SkillCategoryDto,
	BannerButton,
	OffTheClockItem,
} from '@/app/api/cms';
import {toast} from 'sonner';
import TagInput from '../components/TagInput';
import ImageUpload from '../components/ImageUpload';
import IconSelector from '../components/IconSelector';
import {invalidateAboutCache} from '@/hooks/use-home-config';

function relativeTime(date: Date): string {
	const secs = Math.floor((Date.now() - date.getTime()) / 1000);
	if (secs < 60) return 'just now';
	if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
	return `${Math.floor(secs / 3600)}h ago`;
}

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
		<div className="rep-row" style={{alignItems: 'flex-start'}}>
			<div className="rmain">
				<div className="field">
					<input
						type="text"
						value={category.category}
						onChange={(e) =>
							onChange(index, {...category, category: e.target.value})
						}
						placeholder="Category name (e.g. Frontend)"
					/>
				</div>
				<TagInput
					value={category.items}
					onChange={(items) => onChange(index, {...category, items})}
					placeholder="Add skill, press Enter"
				/>
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

export default function CmsAboutConfig() {
	const [lastUpdatedAt, setLastUpdatedAt] = useState('');
	const [location, setLocation] = useState('');
	const [profileImageUrl, setProfileImageUrl] = useState('');
	const [aboutButtons, setAboutButtons] = useState<BannerButton[]>([]);
	const [professionalSummary, setProfessionalSummary] = useState('');
	const [technicalSkills, setTechnicalSkills] = useState<SkillCategoryDto[]>([]);
	const [bioTagline, setBioTagline] = useState('');
	const [bioBody, setBioBody] = useState('');
	const [offTheClock, setOffTheClock] = useState<OffTheClockItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [savedAt, setSavedAt] = useState<Date | null>(null);

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
				setBioTagline(data?.bioTagline ?? '');
				setBioBody(data?.bioBody ?? '');
				setOffTheClock(data?.offTheClock ?? []);
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
				bioTagline,
				bioBody,
				offTheClock,
			});
			invalidateAboutCache();
			setSavedAt(new Date());
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

	if (loading) return <p>Loading...</p>;

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">About Config</h1>
					<div className="sub">aj@khesir:~$ vim ./pages/about.json</div>
				</div>
				<a className="btn-ol" href="/about" target="_blank" rel="noreferrer">
					Preview ↗
				</a>
			</div>

			<form className="cms-form" onSubmit={handleSubmit}>
				<div className="fsection">
					<h2>Profile</h2>
					<ImageUpload
						value={profileImageUrl}
						onChange={setProfileImageUrl}
					/>
				</div>

				<div className="fsection">
					<h2>Bio</h2>
					<div className="field">
						<label>Tagline</label>
						<input
							type="text"
							value={bioTagline}
							onChange={(e) => setBioTagline(e.target.value)}
							placeholder="I build software — and I build the tools that build software."
						/>
					</div>
					<div className="field mono">
						<label>Bio body · markdown</label>
						<textarea
							value={bioBody}
							onChange={(e) => setBioBody(e.target.value)}
							placeholder="I'm a full-stack engineer..."
						/>
					</div>
				</div>

				<div className="fsection">
					<h2>
						Professional summary{' '}
						<span className="opt">· markdown</span>
					</h2>
					<div className="field mono">
						<textarea
							value={professionalSummary}
							onChange={(e) => setProfessionalSummary(e.target.value)}
							placeholder="Software engineer focused on **backend development**..."
						/>
					</div>
				</div>

				<div className="fsection">
					<div className="fhead">
						<h2>Technical skills</h2>
						<button
							type="button"
							className="btn-ol"
							onClick={addSkillCategory}
						>
							Add category
						</button>
					</div>
					<div className="rep">
						{technicalSkills.map((cat, i) => (
							<SkillCategoryCard
								key={i}
								category={cat}
								index={i}
								onChange={updateSkillCategory}
								onRemove={removeSkillCategory}
							/>
						))}
					</div>
				</div>

				<div className="fsection">
					<div className="fhead">
						<h2>Off the clock</h2>
						<button
							type="button"
							className="btn-ol"
							onClick={() =>
								setOffTheClock((prev) => [
									...prev,
									{label: '', description: '', icon: ''},
								])
							}
						>
							Add item
						</button>
					</div>
					<div className="rep">
						{offTheClock.map((item, i) => (
							<div key={i} className="rep-row" style={{alignItems: 'flex-start'}}>
								<div className="rmain">
									<div className="frow">
										<div className="field">
											<input
												type="text"
												value={item.label}
												onChange={(e) =>
													setOffTheClock((prev) =>
														prev.map((x, j) =>
															j === i ? {...x, label: e.target.value} : x,
														),
													)
												}
												placeholder="Label (e.g. At the gym)"
											/>
										</div>
										<div className="field">
											<input
												type="text"
												value={item.description}
												onChange={(e) =>
													setOffTheClock((prev) =>
														prev.map((x, j) =>
															j === i ? {...x, description: e.target.value} : x,
														),
													)
												}
												placeholder="Short description"
											/>
										</div>
									</div>
									<div className="field" style={{marginTop: 8}}>
										<IconSelector
											value={item.icon}
											onChange={(icon) =>
												setOffTheClock((prev) =>
													prev.map((x, j) => (j === i ? {...x, icon} : x)),
												)
											}
										/>
									</div>
								</div>
								<button
									type="button"
									className="rm"
									onClick={() =>
										setOffTheClock((prev) => prev.filter((_, j) => j !== i))
									}
								>
									Remove
								</button>
							</div>
						))}
					</div>
				</div>

				<div className="save-bar">
					<button className="btn-new" type="submit" disabled={saving}>
						{saving ? 'Saving...' : 'Save about config'}
					</button>
					{savedAt && (
						<span className="hint">last saved {relativeTime(savedAt)}</span>
					)}
				</div>
			</form>
		</>
	);
}
