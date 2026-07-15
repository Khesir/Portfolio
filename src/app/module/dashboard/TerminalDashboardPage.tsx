import '../../../css/terminal-mock.css';
import '../../../css/terminal-theme.css';
import DashboardSidebar from './DashboardSidebar';
import DashboardWorkGrid from './DashboardWorkGrid';

export default function TerminalDashboardPage() {
	return (
		<div className="dashboard-shell">
			{/* Intentionally bare — no TerminalLayout chrome. */}
			<DashboardSidebar />
			<DashboardWorkGrid />
		</div>
	);
}
