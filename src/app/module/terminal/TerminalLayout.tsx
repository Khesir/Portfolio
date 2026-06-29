import '../../../css/terminal-mock.css';
import '../../../css/terminal-theme.css';
import {Link, useLocation} from 'react-router-dom';
import {useHomeConfig} from '@/hooks/use-home-config';
import {type ReactNode} from 'react';

const NAV_LINKS = [
	{label: '~/home', to: '/'},
	{label: '/about', to: '/about'},
	{label: '/work', to: '/work'},
	{label: '/blog', to: '/blogs'},
] as const;

const STATUS_DOT: Record<string, React.CSSProperties> = {
	online: {background: '#4ade80', boxShadow: '0 0 8px #4ade80'},
	idle:   {background: '#facc15'},
	dnd:    {background: '#f87171'},
	custom: {background: '#94a3b8'},
};

export function TerminalLayout({children}: {children: ReactNode}) {
	const {pathname} = useLocation();
	const {config} = useHomeConfig();

	return (
		<>
			<div className="grid-bg" />

			<header className="top">
				<Link to="/" className="brand">
					<div className="mk">
						<img src="/img/Mee.png" alt="AJ" />
					</div>
					<span className="nm">khesir<b>.dev</b></span>
				</Link>

				<nav className="nav">
					{NAV_LINKS.map(({label, to}) => (
						<Link
							key={to}
							to={to}
							className={pathname === to ? 'on' : undefined}
						>
							{label}
						</Link>
					))}
				</nav>

				{config.status.type === 'online' && (
					<span className="ava">
						<i className="dot" style={STATUS_DOT.online} />
						available for work
					</span>
				)}
			</header>

			<div className="wrap">
				{children}
			</div>

			<footer className="foot">
				<span>{config.footerCopyright}</span>
				<span>{config.footerTagline}</span>
			</footer>
		</>
	);
}
