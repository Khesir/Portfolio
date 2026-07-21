import {getAbout} from '@/data/about';
import {getProfile} from '@/data/profile';
import {MarkDownComponent} from '@/app/_components/readPage/readingPage';

function CharacterArtIcon() {
	return (
		<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="8" r="4" />
			<path d="M4 21v-1a8 8 0 0 1 16 0v1" />
		</svg>
	);
}

function TechnicalArtIcon() {
	return (
		<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
		</svg>
	);
}

function FullstackIcon() {
	return (
		<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<polyline points="16 18 22 12 16 6" />
			<polyline points="8 6 2 12 8 18" />
		</svg>
	);
}

const SERVICE_ICONS = [CharacterArtIcon, TechnicalArtIcon, FullstackIcon];

function EducationIcon() {
	return (
		<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M22 10L12 5 2 10l10 5 10-5z" />
			<path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
		</svg>
	);
}

export function DashboardCardBack() {
	const about = getAbout();
	const profile = getProfile();

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
					<div className="dash-back-label">
						<EducationIcon />
						Education
					</div>
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

			<div className="dash-back-bento">
				<div className="dash-back-cell dash-back-cell--svc">
					<div className="dash-back-label">Services</div>
					{about.services.map((svc, i) => {
						const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
						return (
							<div className="dash-back-svc" key={i}>
								<span className="ic">
									<Icon />
								</span>
								<div className="body">
									<h5>
										{svc.title}
										<span className="badge">{svc.badge}</span>
									</h5>
									<p>{svc.description}</p>
								</div>
							</div>
						);
					})}
				</div>

				<div className="dash-back-cell dash-back-cell--skills">
					<div className="dash-back-label">Skills</div>
					<div className="dash-back-chips">
						{about.skills.map((s, i) => (
							<span key={i}>{s}</span>
						))}
					</div>
				</div>

				<div className="dash-back-cell dash-back-cell--tools">
					<div className="dash-back-tools-split">
						<div className="dash-back-tools-group">
							<h6>Languages & frameworks</h6>
							<div className="dash-back-chips">
								{about.tools.languages.map((t, i) => (
									<span key={i}>{t}</span>
								))}
							</div>
						</div>
						<div className="dash-back-tools-group">
							<h6>Software</h6>
							<div className="dash-back-chips">
								{about.tools.software.map((t, i) => (
									<span key={i}>{t}</span>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
