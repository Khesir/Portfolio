import {useState} from 'react';
import * as Popover from '@radix-ui/react-popover';
import {getJourney, type JourneyPosition} from '@/data/journey';
import {MarkDownComponent} from '@/app/_components/readPage/readingPage';

interface PositionDetailsProps {
	position: JourneyPosition;
	expandedKey: string | null;
	positionKey: string;
	onToggle: (key: string | null) => void;
}

function PositionDetails({position, expandedKey, positionKey, onToggle}: PositionDetailsProps) {
	const isExpanded = expandedKey === positionKey;

	return (
		<>
			{position.description && <p className="dash-journey-desc">{position.description}</p>}
			{(position.skills.length > 0 || position.detail) && (
				<div className="dash-journey-skills-row">
					{position.skills.length > 0 && (
						<div className="dash-journey-skills">{position.skills.join(' · ')}</div>
					)}
					{position.detail && (
						<Popover.Root
							open={isExpanded}
							onOpenChange={(open) => onToggle(open ? positionKey : null)}
						>
							<Popover.Trigger
								className="dash-journey-more"
								aria-label={isExpanded ? 'Show less detail' : 'Show more detail'}
							>
								{isExpanded ? 'less' : 'more'}
							</Popover.Trigger>
							<Popover.Portal>
								<Popover.Content
									className="dash-journey-popover"
									side="right"
									align="start"
									sideOffset={12}
									collisionPadding={16}
								>
									<div className="dash-journey-md">
										<MarkDownComponent markdown={position.detail} />
									</div>
									<Popover.Arrow className="dash-journey-popover-arrow" />
								</Popover.Content>
							</Popover.Portal>
						</Popover.Root>
					)}
				</div>
			)}
		</>
	);
}

export default function DashboardJourney() {
	const journey = getJourney();
	const [expandedKey, setExpandedKey] = useState<string | null>(null);

	return (
		<div className="dash-journey-slot">
			<p className="dash-journey-section-title">Journey</p>
			<div className="dash-journey-list">
				{journey.map((entry, i) => {
					const [firstPosition, ...earlierPositions] = entry.positions;
					const isCurrentCompany = entry.positions.some((p) => p.current);

					return (
						<div
							className={`dash-journey-item${isCurrentCompany ? ' dash-journey-item--current' : ''}`}
							data-current={isCurrentCompany}
							key={i}
						>
							<span className="dash-journey-dot" />
							<div className="dash-journey-content">
								<div className="dash-journey-head">
									<h4 className="dash-journey-title">{firstPosition.title}</h4>
									<span className="dash-journey-yr">{firstPosition.yearRange}</span>
								</div>
								<div className="dash-journey-place">{entry.company}</div>
								<PositionDetails
									position={firstPosition}
									expandedKey={expandedKey}
									positionKey={`${i}-0`}
									onToggle={setExpandedKey}
								/>

								{earlierPositions.length > 0 && (
									<div className="dash-journey-positions">
										{earlierPositions.map((position, j) => {
											const positionKey = `${i}-${j + 1}`;
											return (
												<div className="dash-journey-position" key={positionKey}>
													<div className="dash-journey-head">
														<h5 className="dash-journey-position-title">{position.title}</h5>
														<span className="dash-journey-yr">{position.yearRange}</span>
													</div>
													<PositionDetails
														position={position}
														expandedKey={expandedKey}
														positionKey={positionKey}
														onToggle={setExpandedKey}
													/>
												</div>
											);
										})}
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
