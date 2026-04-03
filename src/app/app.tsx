import {BrowserRouter, Route, Routes as Router} from 'react-router-dom';
import {LoadingScreen} from '@/components/LoadingScreen';

import SandBoxPage from './sandbox/SandBoxPage';
import CmsApp from './cms/CmsApp';
import {GuestchatPage} from './module/guestChat/guestchatPage';
import {ReadPage} from './_components/readPage/readingPage';
import {BaseLayout} from '@/app/layouts/pagelayout';
import AboutMe from './module/aboutme/aboutMe';
import {ServicePage} from './module/services/servicePage';
import SkillSetPage from './module/skillset/skillset';
import {BlogPage} from './module/blogs/blogPage';
import Homepage from './module/home/homePage';
import {ProgressPage} from './module/progress/progress';
import {PostsPage} from './module/posts/postsPage';
import {ProjectPage} from './module/projects/projectPage';
import {ExperiencePage} from './module/experiences/experiencePage';

export default function App() {
	return (
		<BrowserRouter>
		<LoadingScreen>
			<Router>
				<Route element={<BaseLayout />}>
					<Route path="progress-report" element={<ProgressPage />} />
					<Route path="about" element={<AboutMe />} />
					<Route path="guest-book" element={<GuestchatPage />} />
					<Route path="blogs" element={<BlogPage />} />
					<Route path="projects" element={<ProjectPage />} />
					<Route index element={<Homepage />} />
					<Route path="services" element={<ServicePage />} />
					<Route path="experiences" element={<ExperiencePage />} />
					<Route path="posts" element={<PostsPage />} />
					<Route path="blogs/view/:title" element={<ReadPage name="blogs" />} />
					<Route
						path="projects/view/:title"
						element={<ReadPage name="projects" />}
					/>
					{/* <Route
						path="/progress/view/:title"
						element={<ReadPage name="progress" />}
					/> */}
				</Route>
				<Route path="sandbox" element={<SandBoxPage />} />
				<Route path="cms/*" element={<CmsApp />} />
				<Route path="*" />
				<Route path="skillset" element={<SkillSetPage />} />
			</Router>
		</LoadingScreen>
		</BrowserRouter>
	);
}
