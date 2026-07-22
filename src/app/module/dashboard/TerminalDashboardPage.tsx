import {useState} from 'react';
import '../../../css/terminal-mock.css';
import '../../../css/terminal-theme.css';
import DashboardSidebar from './DashboardSidebar';
import DashboardWorkGrid from './DashboardWorkGrid';
import {FullscreenToggle} from './FullscreenToggle';
import {FlipCardToggle} from './FlipCardToggle';
import {DashboardCardBack} from './DashboardCardBack';
import {ScrollToTopButton} from '@/app/_components/readPage/ScrollToTopButton';

export default function TerminalDashboardPage() {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isFlipped, setIsFlipped] = useState(false);
	const toggleFullscreen = () => setIsFullscreen((v) => !v);
	const toggleFlip = () => setIsFlipped((v) => !v);

	const controls = (
		<>
			<FullscreenToggle isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
			<FlipCardToggle isFlipped={isFlipped} disabled={isFullscreen} onToggle={toggleFlip} />
		</>
	);

	return (
		<div className={`dashboard-page${isFullscreen ? ' fullscreen-active' : ''}`}>
			<div className="dashboard-card-wrap">
				{!isFullscreen && <div className="dashboard-controls-row">{controls}</div>}
				<div className={`dashboard-flip-wrap${isFullscreen ? ' fullscreen' : ''}`}>
					<div className={`dashboard-flip-inner${isFlipped ? ' flipped' : ''}`}>
						<div className={`dashboard-shell${isFullscreen ? ' fullscreen' : ''}`}>
							<DashboardSidebar />
							<DashboardWorkGrid
								isFullscreen={isFullscreen}
								headerControls={isFullscreen && !isFlipped ? controls : undefined}
							/>
						</div>
						<div className={`dashboard-shell dashboard-shell--back${isFullscreen ? ' fullscreen' : ''}`}>
							<DashboardCardBack headerControls={isFullscreen && isFlipped ? controls : undefined} />
						</div>
					</div>
				</div>
			</div>
			<ScrollToTopButton />
		</div>
	);
}
