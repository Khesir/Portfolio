import {useState} from 'react';
import {useCmsAuth} from '@/hooks/use-cms-auth-store';
import '@/css/terminal-mock.css';
import '@/css/terminal-cms-gate.css';

export default function CmsLoginGate() {
	const {login} = useCmsAuth();
	const [password, setPassword] = useState('');
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const toggleEye = () => setShowPassword(s => !s);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const ok = await login(password);
		setLoading(false);
		if (!ok) {
			setError(true);
			setPassword('');
		}
	};

	return (
		<div className="boot-stage">
			<div className="tcard">
				<div className="tc-bar">
					<div className="dots">
						<i style={{background: '#ff5f57'}}></i>
						<i style={{background: '#febc2e'}}></i>
						<i style={{background: '#28c840'}}></i>
					</div>
					<span className="ttl">khesir<b>.cms</b> — auth</span>
				</div>
				<div className="login-body">
					<div className="login-head">
						<span className="mk"><img src="/img/Mee.png" alt="" /></span>
						<div className="lh-t">khesir<b>.cms</b></div>
						<span className="badge">admin</span>
					</div>

					<div className="login-prompt">
						<b>aj@khesir</b>:~$ sudo ./cms login
						<span className="cur"> — enter password to continue</span>
					</div>

					<form onSubmit={handleSubmit}>
						<div className="lfield">
							<label htmlFor="pw">Password <span className="req">*</span></label>
							<div className={`lwrap${error ? ' invalid' : ''}`} id="pwWrap">
								<span className="pchar">$</span>
								<input
									id="pw"
									type={showPassword ? 'text' : 'password'}
									placeholder="••••••••••••"
									autoComplete="current-password"
									value={password}
									onChange={e => { setPassword(e.target.value); setError(false); }}
									autoFocus
								/>
								<button className="eye" type="button" onClick={toggleEye} aria-label="toggle visibility">
									{showPassword
										? <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.7}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/></svg>
										: <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.7}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
									}
								</button>
							</div>
						</div>

						<div className={`lerror${error ? ' show' : ''}`}>
							<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.8}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
							Authentication failed — try again.
						</div>

						<button className="lbtn" type="submit" disabled={loading} style={{marginTop: '6px'}}>
							{loading
								? <><span className="cursor"></span> authenticating…</>
								: <><svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> Authenticate</>
							}
						</button>
					</form>

					<div className="lhint">
						<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.7}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
						Encrypted session · <a href="/">← back to site</a>
					</div>
				</div>
			</div>
		</div>
	);
}
