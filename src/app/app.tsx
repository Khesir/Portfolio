import {BrowserRouter, Route, Routes as Router} from 'react-router-dom';
import TerminalDashboardPage from './module/dashboard/TerminalDashboardPage';
import ProjectReadPage from './module/terminal/ProjectReadPage';

export default function App() {
	return (
		<BrowserRouter>
			<Router>
				<Route index element={<TerminalDashboardPage />} />
				<Route path="work/view/:title" element={<ProjectReadPage />} />
			</Router>
		</BrowserRouter>
	);
}
