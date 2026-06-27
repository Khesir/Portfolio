import {BrowserRouter, Route, Routes as Router} from 'react-router-dom';
import {LoadingScreen} from '@/components/LoadingScreen';

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

export default function App() {
	return (
		<BrowserRouter>
			<LoadingScreen>
				<Router>
					<Route element={<BaseLayout />}>
						<Route path="progress-report" element={<ProgressPage />} />
						<Route path="guest-book" element={<GuestchatPage />} />
						<Route path="services" element={<ServicePage />} />
						<Route path="experiences" element={<ExperiencePage />} />
						<Route path="posts" element={<PostsPage />} />
							{/* <Route
						path="/progress/view/:title"
						element={<ReadPage name="progress" />}
					/> */}
					</Route>
					<Route path="sandbox" element={<SandBoxPage />} />
					<Route path="projects" element={<TerminalWorkPage />} />
					<Route path="about" element={<TerminalAboutPage />} />
					<Route path="blogs" element={<TerminalBlogPage />} />
					<Route path="blogs/view/:title" element={<BlogReadPage />} />
					<Route path="projects/view/:title" element={<ProjectReadPage />} />
					<Route index element={<TerminalHomePage />} />
					<Route path="cms/*" element={<CmsApp />} />
					<Route path="*" element={<NotFoundPage />} />
					<Route path="skillset" element={<SkillSetPage />} />
				</Router>
			</LoadingScreen>
		</BrowserRouter>
	);
}
