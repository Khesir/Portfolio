import {useCmsAuth} from '@/hooks/use-cms-auth-store';
import '@/css/terminal-mock.css';
import '@/css/terminal-cms-gate.css';

export default function CmsLoginGate() {
	const {login} = useCmsAuth();

	return (
		<div className="boot-stage">
			<div className="tcard">
				<div className="tc-bar">
					<div className="dots">
						<i style={{background: '#ff5f57'}}></i>
						<i style={{background: '#febc2e'}}></i>
						<i style={{background: '#28c840'}}></i>
					</div>
					<span className="ttl">khesir<b>.cms</b> — local</span>
				</div>
				<div className="login-body">
					<div className="login-head">
						<span className="mk"><img src="/img/Mee.png" alt="" /></span>
						<div className="lh-t">khesir<b>.cms</b></div>
						<span className="badge">dev</span>
					</div>

					<div className="login-prompt">
						<b>aj@khesir</b>:~$ ./cms start
						<span className="cur"> — local dev instance, no auth needed</span>
					</div>

					<button className="lbtn" type="button" onClick={() => login('')} style={{marginTop: '18px'}}>
						Enter CMS
					</button>

					<div className="lhint">
						<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.7}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
						Local only · <a href="/">← back to site</a>
					</div>
				</div>
			</div>
		</div>
	);
}
