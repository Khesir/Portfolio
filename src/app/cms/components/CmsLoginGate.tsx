import {useState} from 'react';
import {useCmsAuth} from '@/hooks/use-cms-auth-store';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

export default function CmsLoginGate() {
	const {login} = useCmsAuth();
	const [password, setPassword] = useState('');
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

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
		<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
			<div className="w-full max-w-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-8 shadow-sm">
				<h1 className="text-xl font-semibold mb-1">CMS</h1>
				<p className="text-sm text-slate-500 mb-6">
					Enter your password to continue.
				</p>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-1.5">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								setError(false);
							}}
							autoFocus
						/>
						{error && (
							<p className="text-sm text-red-500">Incorrect password.</p>
						)}
					</div>
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? 'Verifying...' : 'Sign in'}
					</Button>
				</form>
			</div>
		</div>
	);
}
