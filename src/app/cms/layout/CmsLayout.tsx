import '@/css/terminal-mock.css';
import '@/css/terminal-theme.css';
import '@/css/terminal-cms.css';
import {NavLink, Outlet} from 'react-router-dom';
import {useCmsAuth} from '@/hooks/use-cms-auth-store';
import {useEnvironment} from '@/hooks/use-environment-store';

const navClass = ({isActive}: {isActive: boolean}) => isActive ? 'on' : undefined;

export default function CmsLayout() {
	const {logout} = useCmsAuth();
	const {mode, toggleMode} = useEnvironment();

	return (
		<div className="cms-shell">
			<div className="grid-bg" />
			<aside className="cms-aside">
				<div className="cms-brand">
					<span className="mk"><img src="/img/Mee.png" alt="" /></span>
					<span className="nm">khesir<b>.cms</b></span>
					<span className="badge">admin</span>
				</div>
				<nav className="cms-nav">
					<div className="cms-group">
						<NavLink to="/cms" end className={navClass}>
							<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
							Dashboard
						</NavLink>
					</div>
					<div className="cms-group">
						<div className="glabel">Data</div>
						<NavLink to="/cms/blogs" className={navClass}>
							<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
							Blogs
						</NavLink>
						<NavLink to="/cms/projects" className={navClass}>
							<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
							Projects
						</NavLink>
						<NavLink to="/cms/experiences" className={navClass}>
							<svg viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
							Experiences
						</NavLink>
						<NavLink to="/cms/posts" className={navClass}>
							<svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
							Posts
						</NavLink>
						<NavLink to="/cms/certifications" className={navClass}>
							<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="6" /><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" /></svg>
							Certifications
						</NavLink>
						<NavLink to="/cms/recommendations" className={navClass}>
							<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
							Recommendations
						</NavLink>
					</div>
					<div className="cms-group">
						<div className="glabel">Pages</div>
						<NavLink to="/cms/home-config" className={navClass}>
							<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
							Home
						</NavLink>
						<NavLink to="/cms/about-config" className={navClass}>
							<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
							About
						</NavLink>
						<NavLink to="/cms/service-config" className={navClass}>
							<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
							Services
						</NavLink>
					</div>
				</nav>
				<div className="cms-foot">
					<button
						type="button"
						className={`cms-mode${mode === 'development' ? ' active' : ''}`}
						onClick={toggleMode}
					>
						<svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
						{mode === 'development' ? 'Dev mode' : 'Production'}
					</button>
					<a href="/">← Back to site</a>
					<button type="button" className="logout" onClick={logout}>⏻ Logout</button>
				</div>
			</aside>
			<main className="cms-main">
				<Outlet />
			</main>
		</div>
	);
}
