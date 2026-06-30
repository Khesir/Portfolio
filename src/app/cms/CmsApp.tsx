import {Navigate, Route, Routes} from 'react-router-dom';
import {useCmsAuth} from '@/hooks/use-cms-auth-store';
import CmsLoginGate from './components/CmsLoginGate';
import CmsLayout from './layout/CmsLayout';
import CmsDashboard from './pages/CmsDashboard';
import CmsBlogs from './pages/CmsBlogs';
import CmsBlogEditor from './pages/CmsBlogEditor';
import CmsProjects from './pages/CmsProjects';
import CmsProjectEditor from './pages/CmsProjectEditor';
import CmsExperiences from './pages/CmsExperiences';
import CmsExperienceEditor from './pages/CmsExperienceEditor';
import CmsPosts from './pages/CmsPosts';
import CmsPostEditor from './pages/CmsPostEditor';
import CmsHomeConfig from './pages/CmsHomeConfig';
import CmsAboutConfig from './pages/CmsAboutConfig';
import CmsServiceConfig from './pages/CmsServiceConfig';
import CmsCertifications from './pages/CmsCertifications';
import CmsCertificationEditor from './pages/CmsCertificationEditor';
import CmsRecommendations from './pages/CmsRecommendations';
import CmsRecommendationEditor from './pages/CmsRecommendationEditor';

export default function CmsApp() {
	const {authenticated} = useCmsAuth();

	if (!authenticated) return <CmsLoginGate />;

	return (
		<Routes>
			<Route element={<CmsLayout />}>
				<Route index element={<CmsDashboard />} />
				<Route path="blogs" element={<CmsBlogs />} />
				<Route path="blogs/new" element={<CmsBlogEditor />} />
				<Route path="blogs/:id/edit" element={<CmsBlogEditor />} />
				<Route path="projects" element={<CmsProjects />} />
				<Route path="projects/new" element={<CmsProjectEditor />} />
				<Route path="projects/:id/edit" element={<CmsProjectEditor />} />
				<Route path="experiences" element={<CmsExperiences />} />
				<Route path="experiences/new" element={<CmsExperienceEditor />} />
				<Route path="experiences/:id/edit" element={<CmsExperienceEditor />} />
				<Route path="posts" element={<CmsPosts />} />
				<Route path="posts/new" element={<CmsPostEditor />} />
				<Route path="posts/:id/edit" element={<CmsPostEditor />} />
				<Route path="certifications" element={<CmsCertifications />} />
				<Route path="certifications/new" element={<CmsCertificationEditor />} />
				<Route path="certifications/:id/edit" element={<CmsCertificationEditor />} />
				<Route path="recommendations" element={<CmsRecommendations />} />
				<Route path="recommendations/new" element={<CmsRecommendationEditor />} />
				<Route path="recommendations/:id/edit" element={<CmsRecommendationEditor />} />
				<Route path="home-config" element={<CmsHomeConfig />} />
				<Route path="about-config" element={<CmsAboutConfig />} />
				<Route path="service-config" element={<CmsServiceConfig />} />
				<Route path="*" element={<Navigate to="/cms" replace />} />
			</Route>
		</Routes>
	);
}
