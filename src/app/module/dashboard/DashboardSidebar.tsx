import {getProfile} from '@/data/profile';
import DashboardJourney from './DashboardJourney';
import {ContactDialog} from './ContactDialog';
import '@/css/terminal-dashboard.css';

const STATUS_DOT: Record<string, React.CSSProperties> = {
	online: {background: '#4ade80', boxShadow: '0 0 8px #4ade80'},
	idle: {background: '#facc15'},
	dnd: {background: '#f87171'},
	custom: {background: '#94a3b8'},
};

export default function DashboardSidebar() {
	const profile = getProfile();

	return (
		<aside className="dash-sidebar">
			<div className="dash-profile">
				<div className="dash-who">
					<img className="dash-avatar" src={profile.avatarSrc || '/img/Mee.png'} alt="Khesir" />
					<div className="dash-who-text">
						<p className="dash-name">Khe<em>sir</em> <span className="dash-name-alias">(AJ)</span></p>
						<p className="dash-role">{profile.role}</p>
					</div>
				</div>
				{profile.status === 'online' && (
					<span className="dash-availability">
						<i className="dot" style={STATUS_DOT.online} />
						available for work
					</span>
				)}
				{profile.bio && <p className="dash-bio">{profile.bio}</p>}
				{profile.location && <p className="dash-location">{profile.location}</p>}
			</div>

			<div className="dash-divider" />

			<DashboardJourney />

			<div className="dash-contact">
				<div className="dash-divider" />
				<p className="dash-contact-label">Get in touch</p>
				{profile.contactEmail && (
					<ContactDialog
						fallbackEmail={profile.contactEmail}
						trigger={<span className="dash-email">{profile.contactEmail}</span>}
					/>
				)}
				{(profile.socialLinks ?? []).length > 0 && (
					<div className="dash-social">
						{profile.socialLinks.map((link, i) => (
							<a
								key={i}
								href={link.href}
								title={link.label}
								aria-label={link.label}
								target={link.href.startsWith('mailto:') ? undefined : '_blank'}
								rel="noopener noreferrer"
							>
								{link.label}
							</a>
						))}
					</div>
				)}
			</div>
		</aside>
	);
}
