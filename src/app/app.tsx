import {lazy, Suspense} from 'react';
import {BrowserRouter, Route, Routes as Router} from 'react-router-dom';
import TerminalDashboardPage from './module/dashboard/TerminalDashboardPage';
import ProjectReadPage from './module/terminal/ProjectReadPage';

// Lazy + code-split: the CMS module graph is dev-only tooling with its own
// (partially broken, pre-existing) dependencies. Loading it as a separate chunk
// means it can never break the public site bundle, even if a CMS page fails to load.
const CmsApp = lazy(() => import('./cms/CmsApp'));

export default function App() {
	return (
		<BrowserRouter>
			<Router>
				<Route index element={<TerminalDashboardPage />} />
				<Route path="work/view/:title" element={<ProjectReadPage />} />
				{import.meta.env.DEV && (
					<Route
						path="cms/*"
						element={
							<Suspense fallback={<p>Loading...</p>}>
								<CmsApp />
							</Suspense>
						}
					/>
				)}
			</Router>
		</BrowserRouter>
	);
}
