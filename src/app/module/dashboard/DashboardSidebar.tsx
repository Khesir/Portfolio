import {useHomeConfig, useAboutConfig} from '@/hooks/use-home-config';
import {Icon} from '@iconify/react';
import DashboardJourney from './DashboardJourney';
import '@/css/terminal-dashboard.css';

const STATUS_DOT: Record<string, React.CSSProperties> = {
	online: {background: '#4ade80', boxShadow: '0 0 8px #4ade80'},
	idle: {background: '#facc15'},
	dnd: {background: '#f87171'},
	custom: {background: '#94a3b8'},
};

export default function DashboardSidebar() {
	const {config: home} = useHomeConfig();
	const {config: about} = useAboutConfig();

	return (
		<aside className="dash-sidebar">
			<div className="dash-profile">
				<img className="dash-avatar" src={home.profileImageUrl || '/img/Mee.png'} alt={home.name} />
				<p className="dash-name">{home.name}</p>
				<p className="dash-role">{home.role}</p>
				{home.status.type === 'online' && (
					<span className="dash-availability">
						<i className="dot" style={STATUS_DOT.online} />
						available for work
					</span>
				)}
				{about.bioTagline && <p className="dash-bio">{about.bioTagline}</p>}
				{home.location && <p className="dash-location">{home.location}</p>}
			</div>

			<div className="dash-contact">
				{home.contactEmail && (
					<a className="dash-email" href={`mailto:${home.contactEmail}`}>
						{home.contactEmail}
					</a>
				)}
				{(home.socialLinks ?? []).length > 0 && (
					<div className="dash-social">
						{home.socialLinks.map((link, i) => (
							<a
								key={i}
								href={link.href}
								title={link.label}
								aria-label={link.label}
								target={link.href.startsWith('mailto:') ? undefined : '_blank'}
								rel="noopener noreferrer"
							>
								{link.icon ? <Icon icon={link.icon} style={{width: 18, height: 18}} /> : link.label}
							</a>
						))}
					</div>
				)}
			</div>

			<DashboardJourney />
		</aside>
	);
}
