import { Navigate, Route, Routes } from 'react-router-dom';
import { useCmsAuth } from '@/hooks/use-cms-auth-store';
import CmsLoginGate from './components/CmsLoginGate';
import CmsLayout from './layout/CmsLayout';
import CmsDashboard from './pages/CmsDashboard';
import CmsBlogs from './pages/CmsBlogs';
import CmsBlogEditor from './pages/CmsBlogEditor';
import CmsProjects from './pages/CmsProjects';
import CmsProjectEditor from './pages/CmsProjectEditor';
import CmsExperiences from './pages/CmsExperiences';
import CmsExperienceEditor from './pages/CmsExperienceEditor';
import CmsProgress from './pages/CmsProgress';
import CmsProgressEditor from './pages/CmsProgressEditor';
import CmsHomeConfig from './pages/CmsHomeConfig';

export default function CmsApp() {
  const { authenticated } = useCmsAuth();

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
        <Route path="progress" element={<CmsProgress />} />
        <Route path="progress/new" element={<CmsProgressEditor />} />
        <Route path="progress/:id/edit" element={<CmsProgressEditor />} />
        <Route path="home-config" element={<CmsHomeConfig />} />
        <Route path="*" element={<Navigate to="/cms" replace />} />
      </Route>
    </Routes>
  );
}
