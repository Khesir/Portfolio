import {Link} from 'react-router-dom';

interface CmsDisabledPageProps {
	label: string;
}

export default function CmsDisabledPage({label}: CmsDisabledPageProps) {
	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">{label}</h1>
					<div className="sub">
						aj@khesir:~$ ./cms status ./{label.toLowerCase()}
					</div>
				</div>
			</div>
			<div
				style={{
					border: '1px solid var(--line)',
					borderRadius: 'var(--radius-sm)',
					padding: '32px 20px',
					textAlign: 'center',
					fontFamily: 'var(--mono)',
					fontSize: 13,
					color: 'var(--ink-3)',
				}}
			>
				<div style={{marginBottom: 10}}>
					<span className="cbadge draft">disabled</span>
				</div>
				{label} isn&apos;t wired up yet — the backend it depends on is
				incomplete.
				<div style={{marginTop: 14}}>
					<Link className="btn-ol" to="/cms/projects">
						← Back to Projects
					</Link>
				</div>
			</div>
		</>
	);
}
