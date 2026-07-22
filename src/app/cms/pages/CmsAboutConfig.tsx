import {useEffect, useState} from 'react';
import type {AboutContent, EducationEntry, SkillCategory} from '@/data/about';
import {fetchLocalSection, saveLocalSection} from '@/app/api/cms-local';
import {toast} from 'sonner';
import TagInput from '../components/TagInput';
import LocalOnlyNotice from '../components/LocalOnlyNotice';

const IS_DEV = import.meta.env.DEV;

function relativeTime(date: Date): string {
	const secs = Math.floor((Date.now() - date.getTime()) / 1000);
	if (secs < 60) return 'just now';
	if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
	return `${Math.floor(secs / 3600)}h ago`;
}

export default function CmsAboutConfig() {
	const [greeting, setGreeting] = useState('');
	const [kicker, setKicker] = useState('');
	const [polaroidCaption, setPolaroidCaption] = useState('');
	const [bio, setBio] = useState<string[]>([]);
	const [education, setEducation] = useState<EducationEntry[]>([]);
	const [technicalSkills, setTechnicalSkills] = useState<SkillCategory[]>([]);
	const [saving, setSaving] = useState(false);
	const [savedAt, setSavedAt] = useState<Date | null>(null);

	useEffect(() => {
		fetchLocalSection<AboutContent>('about').then((about) => {
			setGreeting(about.greeting);
			setKicker(about.kicker);
			setPolaroidCaption(about.polaroidCaption);
			setBio(about.bio);
			setEducation(about.education);
			setTechnicalSkills(about.technicalSkills);
		});
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			const data: AboutContent = {
				greeting,
				kicker,
				polaroidCaption,
				bio,
				education,
				technicalSkills,
			};
			await saveLocalSection('about', data);
			setSavedAt(new Date());
			toast.success('About saved');
		} catch {
			toast.error('Failed to save about');
		} finally {
			setSaving(false);
		}
	};

	const updateBioParagraph = (i: number, text: string) =>
		setBio((prev) => prev.map((p, idx) => (idx === i ? text : p)));
	const removeBioParagraph = (i: number) =>
		setBio((prev) => prev.filter((_, idx) => idx !== i));
	const addBioParagraph = () => setBio((prev) => [...prev, '']);

	const updateEducation = (i: number, updated: EducationEntry) =>
		setEducation((prev) => prev.map((e, idx) => (idx === i ? updated : e)));
	const removeEducation = (i: number) =>
		setEducation((prev) => prev.filter((_, idx) => idx !== i));
	const addEducation = () =>
		setEducation((prev) => [
			...prev,
			{school: '', degree: '', yearRange: '', current: false, description: ''},
		]);

	const updateSkillCategory = (i: number, updated: SkillCategory) =>
		setTechnicalSkills((prev) =>
			prev.map((c, idx) => (idx === i ? updated : c)),
		);
	const removeSkillCategory = (i: number) =>
		setTechnicalSkills((prev) => prev.filter((_, idx) => idx !== i));
	const addSkillCategory = () =>
		setTechnicalSkills((prev) => [...prev, {category: '', items: []}]);

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">About Config</h1>
					<div className="sub">aj@khesir:~$ vim ./data/about.json</div>
				</div>
				<a className="btn-ol" href="/about" target="_blank" rel="noreferrer">
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
						<h2>Intro</h2>
						<div className="field">
							<label>Greeting</label>
							<input
								value={greeting}
								onChange={(e) => setGreeting(e.target.value)}
								placeholder="Hey, I'm AJ."
							/>
						</div>
						<div className="field">
							<label>Kicker</label>
							<textarea
								value={kicker}
								onChange={(e) => setKicker(e.target.value)}
							/>
						</div>
						<div className="field">
							<label>Polaroid caption</label>
							<input
								value={polaroidCaption}
								onChange={(e) => setPolaroidCaption(e.target.value)}
								placeholder="it's me, AJ"
							/>
						</div>
					</div>

					<div className="fsection">
						<div className="fhead">
							<h2>
								Bio{' '}
								<span className="opt">· markdown, one paragraph per box</span>
							</h2>
							<button
								type="button"
								className="btn-ol"
								onClick={addBioParagraph}
							>
								Add paragraph
							</button>
						</div>
						<div className="rep">
							{bio.map((paragraph, i) => (
								<div
									key={i}
									className="rep-row"
									style={{alignItems: 'flex-start'}}
								>
									<div className="rmain field mono">
										<textarea
											value={paragraph}
											onChange={(e) => updateBioParagraph(i, e.target.value)}
										/>
									</div>
									<button
										type="button"
										className="rm"
										onClick={() => removeBioParagraph(i)}
									>
										Remove
									</button>
								</div>
							))}
						</div>
					</div>

					<div className="fsection">
						<div className="fhead">
							<h2>Education</h2>
							<button type="button" className="btn-ol" onClick={addEducation}>
								Add entry
							</button>
						</div>
						<div className="rep">
							{education.map((entry, i) => (
								<div
									key={i}
									className="rep-row"
									style={{alignItems: 'flex-start'}}
								>
									<div className="rmain">
										<div className="frow">
											<div className="field">
												<label>School</label>
												<input
													value={entry.school}
													onChange={(e) =>
														updateEducation(i, {
															...entry,
															school: e.target.value,
														})
													}
												/>
											</div>
											<div className="field">
												<label>Degree</label>
												<input
													value={entry.degree}
													onChange={(e) =>
														updateEducation(i, {
															...entry,
															degree: e.target.value,
														})
													}
												/>
											</div>
										</div>
										<div className="frow">
											<div className="field">
												<label>Year range</label>
												<input
													value={entry.yearRange}
													onChange={(e) =>
														updateEducation(i, {
															...entry,
															yearRange: e.target.value,
														})
													}
													placeholder="2022 - 2026"
												/>
											</div>
											<div className="field">
												<label>Current</label>
												<button
													type="button"
													className={`feat${entry.current ? ' on' : ''}`}
													onClick={() =>
														updateEducation(i, {
															...entry,
															current: !entry.current,
														})
													}
												>
													{entry.current ? 'Current' : 'Not current'}
												</button>
											</div>
										</div>
										<div className="field">
											<label>Description</label>
											<textarea
												value={entry.description}
												onChange={(e) =>
													updateEducation(i, {
														...entry,
														description: e.target.value,
													})
												}
											/>
										</div>
									</div>
									<button
										type="button"
										className="rm"
										onClick={() => removeEducation(i)}
									>
										Remove
									</button>
								</div>
							))}
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
								<div
									key={i}
									className="rep-row"
									style={{alignItems: 'flex-start'}}
								>
									<div className="rmain">
										<div className="field">
											<input
												type="text"
												value={cat.category}
												onChange={(e) =>
													updateSkillCategory(i, {
														...cat,
														category: e.target.value,
													})
												}
												placeholder="Category name (e.g. Skills)"
											/>
										</div>
										<TagInput
											value={cat.items}
											onChange={(items) =>
												updateSkillCategory(i, {...cat, items})
											}
											placeholder="Add skill, press Enter"
										/>
									</div>
									<button
										type="button"
										className="rm"
										onClick={() => removeSkillCategory(i)}
									>
										Remove
									</button>
								</div>
							))}
						</div>
					</div>

					<div className="save-bar">
						<button className="btn-new" type="submit" disabled={saving}>
							{saving ? 'Saving...' : 'Save about'}
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
