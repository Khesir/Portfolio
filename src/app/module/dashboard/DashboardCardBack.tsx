import {getAbout} from '@/data/about';
import {getProfile} from '@/data/profile';
import {getServices} from '@/data/services';
import {MarkDownComponent} from '@/app/_components/readPage/readingPage';

const SERVICE_ACCENT: Record<string, 'blue' | 'amber' | 'plum'> = {
	'Software Development': 'plum',
	'Technical Art': 'amber',
	'Character Art': 'blue',
};

function EducationIcon() {
	return (
		<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M22 10L12 5 2 10l10 5 10-5z" />
			<path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
		</svg>
	);
}

function findSkillCategory(about: ReturnType<typeof getAbout>, category: string) {
	return about.technicalSkills.find((c) => c.category === category)?.items ?? [];
}

export function DashboardCardBack() {
	const about = getAbout();
	const profile = getProfile();
	const services = getServices();
	const skills = findSkillCategory(about, 'Skills');
	const languages = findSkillCategory(about, 'Languages & frameworks');
	const software = findSkillCategory(about, 'Software');

	return (
		<div className="dash-back-page">
			<div className="dash-back-hero">
				<div className="dash-back-polaroid">
					<img src={profile.avatarSrc || '/img/Mee.png'} alt="AJ" />
					<span className="cap">{about.polaroidCaption}</span>
				</div>
				<div>
					<h2 className="dash-back-greeting">{about.greeting}</h2>
					<p className="dash-back-kicker">{about.kicker}</p>
				</div>
			</div>

			<div className="dash-back-cols">
				<div className="dash-back-md">
					<MarkDownComponent markdown={about.bio.join('\n\n')} />
				</div>

				<div className="dash-back-edu">
					<h3 className="dash-back-heading dash-back-heading--amber">
						<EducationIcon />
						Education
					</h3>
					{about.education.map((edu, i) => (
						<div
							className={`dash-back-jt-item${edu.current ? ' now' : ''}`}
							key={i}
						>
							<div className="dash-back-jt-top">
								<h5>{edu.degree}</h5>
								<span className="dash-back-jt-yr">{edu.yearRange}</span>
							</div>
							<div className="dash-back-jt-org">{edu.school}</div>
							<p>{edu.description}</p>
						</div>
					))}
				</div>
			</div>

			<div className="dash-back-section">
				<h3 className="dash-back-heading">Services</h3>
				<div className="dash-back-svc-list">
					{services.map((svc, i) => (
						<div
							className={`dash-back-svc dash-back-svc--${SERVICE_ACCENT[svc.title]}${svc.available ? '' : ' dash-back-svc--unavailable'}`}
							key={i}
						>
							<span className="num">{String(i + 1).padStart(2, '0')}</span>
							<div className="body">
								<div className="head">
									<h5>{svc.title}</h5>
									<span className="badge">{svc.badge}</span>
									{!svc.available && <span className="unavailable">Unavailable</span>}
								</div>
								<p>{svc.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="dash-back-hr" />

			<div className="dash-back-section">
				<h3 className="dash-back-heading dash-back-heading--amber">Skills</h3>
				<div className="dash-back-chips">
					{skills.map((s, i) => (
						<span key={i}>{s}</span>
					))}
				</div>
			</div>

			<div className="dash-back-hr" />

			<div className="dash-back-section">
				<h3 className="dash-back-heading">Languages & software</h3>
				<div className="dash-back-tools-split">
					<div className="dash-back-tools-group">
						<h6>Languages & frameworks</h6>
						<div className="dash-back-chips">
							{languages.map((t, i) => (
								<span key={i}>{t}</span>
							))}
						</div>
					</div>
					<div className="dash-back-tools-group">
						<h6>Software</h6>
						<div className="dash-back-chips">
							{software.map((t, i) => (
								<span key={i}>{t}</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
