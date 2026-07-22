import {Suspense} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {useCmsAuth} from '@/hooks/use-cms-auth-store';
import CmsLoginGate from './components/CmsLoginGate';
import CmsLayout from './layout/CmsLayout';
import CmsProjects from './pages/CmsProjects';
import CmsProjectEditor from './pages/CmsProjectEditor';
import CmsJourney from './pages/CmsJourney';
import CmsJourneyEditor from './pages/CmsJourneyEditor';
import CmsAboutConfig from './pages/CmsAboutConfig';
import CmsServiceConfig from './pages/CmsServiceConfig';
import CmsHomeConfig from './pages/CmsHomeConfig';
import CmsDisabledPage from './pages/CmsDisabledPage';

// Blogs/Experiences/Posts/Certifications/Recommendations/Home config all depend
// on backend modules that don't exist yet (missing @/app/api/experience,
// @/lib/mockData, and most of @/app/api/cms's exports) — pre-existing gaps,
// unrelated to the local-file CMS pages above. They render a disabled
// placeholder instead of a broken page until that backend work lands.

export default function CmsApp() {
	const {authenticated} = useCmsAuth();

	if (!authenticated) return <CmsLoginGate />;

	return (
		<Suspense fallback={<p className="hint">Loading...</p>}>
			<Routes>
				<Route element={<CmsLayout />}>
					<Route index element={<Navigate to="/cms/projects" replace />} />
					<Route path="blogs/*" element={<CmsDisabledPage label="Blogs" />} />
					<Route path="projects" element={<CmsProjects />} />
					<Route path="projects/new" element={<CmsProjectEditor />} />
					<Route path="projects/:id/edit" element={<CmsProjectEditor />} />
					<Route path="journey" element={<CmsJourney />} />
					<Route path="journey/new" element={<CmsJourneyEditor />} />
					<Route path="journey/:id/edit" element={<CmsJourneyEditor />} />
					<Route
						path="experiences/*"
						element={<CmsDisabledPage label="Experiences" />}
					/>
					<Route path="posts/*" element={<CmsDisabledPage label="Posts" />} />
					<Route
						path="certifications/*"
						element={<CmsDisabledPage label="Certifications" />}
					/>
					<Route
						path="recommendations/*"
						element={<CmsDisabledPage label="Recommendations" />}
					/>
					<Route path="home-config" element={<CmsHomeConfig />} />
					<Route path="about-config" element={<CmsAboutConfig />} />
					<Route path="service-config" element={<CmsServiceConfig />} />
					<Route path="*" element={<Navigate to="/cms/projects" replace />} />
				</Route>
			</Routes>
		</Suspense>
	);
}
