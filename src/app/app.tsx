import {BrowserRouter, Route, Routes as Router, useLocation} from 'react-router-dom';
import {LoadingScreen} from '@/components/LoadingScreen';
import type {ReactNode} from 'react';

function ConditionalLoadingScreen({children}: {children: ReactNode}) {
	const {pathname} = useLocation();
	if (pathname.startsWith('/cms')) return <>{children}</>;
	if (pathname === '/services') return <>{children}</>;
	return <LoadingScreen>{children}</LoadingScreen>;
}

import SandBoxPage from './sandbox/SandBoxPage';
import CmsApp from './cms/CmsApp';
import {GuestchatPage} from './module/guestChat/guestchatPage';
import {ReadPage} from './_components/readPage/readingPage';
import {BaseLayout} from '@/app/layouts/pagelayout';
import {ServicePage} from './module/services/servicePage';
import SkillSetPage from './module/skillset/skillset';
import TerminalHomePage from './module/home/terminalHomePage';
import TerminalWorkPage from './module/terminal/TerminalWorkPage';
import TerminalAboutPage from './module/terminal/TerminalAboutPage';
import TerminalBlogPage from './module/terminal/TerminalBlogPage';
import BlogReadPage from './module/terminal/BlogReadPage';
import ProjectReadPage from './module/terminal/ProjectReadPage';
import {ProgressPage} from './module/progress/progress';
import {PostsPage} from './module/posts/postsPage';
import {ExperiencePage} from './module/experiences/experiencePage';
import {NotFoundPage} from './module/notFound/notFoundPage';
import CertificationPage from './module/certifications/certificationPage';
import RecommendationPage from './module/recommendations/recommendationPage';

export default function App() {
	return (
		<BrowserRouter>
			<ConditionalLoadingScreen>
				<Router>
					<Route element={<BaseLayout />}>
						<Route path="progress-report" element={<ProgressPage />} />
						<Route path="guest-book" element={<GuestchatPage />} />
						<Route path="experiences" element={<ExperiencePage />} />
						<Route path="posts" element={<PostsPage />} />
							{/* <Route
						path="/progress/view/:title"
						element={<ReadPage name="progress" />}
					/> */}
					</Route>
					<Route path="sandbox" element={<SandBoxPage />} />
					<Route path="services" element={<ServicePage />} />
					<Route path="certifications" element={<CertificationPage />} />
					<Route path="recommendations" element={<RecommendationPage />} />
					<Route path="work" element={<TerminalWorkPage />} />
					<Route path="about" element={<TerminalAboutPage />} />
					<Route path="blogs" element={<TerminalBlogPage />} />
					<Route path="blogs/view/:title" element={<BlogReadPage />} />
					<Route path="work/view/:title" element={<ProjectReadPage />} />
					<Route index element={<TerminalHomePage />} />
					<Route path="cms/*" element={<CmsApp />} />
					<Route path="*" element={<NotFoundPage />} />
					<Route path="skillset" element={<SkillSetPage />} />
				</Router>
			</ConditionalLoadingScreen>
		</BrowserRouter>
	);
}
