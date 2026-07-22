import {useState} from 'react';
import {motion} from 'framer-motion';
import {Icon} from '@iconify/react';
import {useServiceConfig} from '@/hooks/use-home-config';
import '../../../css/terminal-mock.css';
import '../../../css/terminal-theme.css';

const FLIP_EASE = [0.22, 0.78, 0.24, 1] as const;

export function ServicePage() {
	const {config, loading} = useServiceConfig();
	const [flipped, setFlipped] = useState(false);

	return (
		<>
			<div className="grid-bg" />

			<div
				style={{
					position: 'fixed',
					top: 26,
					left: 30,
					zIndex: 5,
					display: 'flex',
					alignItems: 'center',
					gap: 11,
				}}
			>
				<span className="mk" style={{width: 32, height: 32, borderRadius: 9, overflow: 'hidden', border: '1px solid var(--line-2)', boxShadow: '0 0 0 3px rgba(var(--accent-rgb),.1)', flexShrink: 0}}>
					<img src="/img/Mee.png" alt="AJ" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				</span>
				<span className="nm" style={{fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--ink)'}}>
					khesir
				</span>
				<span style={{fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)', borderLeft: '1px solid var(--line-2)', paddingLeft: 11, marginLeft: 4}}>
					digital card
				</span>
			</div>

			<div
				style={{
					minHeight: '100vh',
					display: 'grid',
					placeItems: 'center',
					padding: '70px 24px 50px',
					position: 'relative',
					zIndex: 1,
				}}
			>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
					{loading ? (
						<>
							{[0, 1, 2].map((i) => (
								<div
									key={i}
									className="animate-pulse"
									style={{
										width: 440,
										height: 600,
										borderRadius: 'var(--radius)',
										background: 'var(--panel-2)',
										border: '1px solid var(--line-2)',
									}}
								/>
							))}
						</>
					) : (
						<>
							<div
								onClick={() => setFlipped((p) => !p)}
								style={{
									perspective: '2000px',
									width: 440,
									cursor: 'pointer',
								}}
								className="max-[520px]:!w-[360px]"
							>
								<motion.div
									animate={{rotateY: flipped ? 180 : 0}}
									transition={{duration: 0.85, ease: FLIP_EASE}}
									style={{
										position: 'relative',
										transformStyle: 'preserve-3d',
										width: '100%',
										height: 600,
									}}
								>
									{/* Front face */}
									<div
										style={{
											position: 'absolute',
											inset: 0,
											backfaceVisibility: 'hidden',
											WebkitBackfaceVisibility: 'hidden',
											borderRadius: 'var(--radius)',
											border: '1px solid var(--line-2)',
											overflow: 'hidden',
											background: 'linear-gradient(165deg, var(--panel-2), var(--bg))',
											boxShadow: 'var(--shadow-lg)',
										}}
									>
										<div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(480px 280px at 16% -10%, rgba(var(--accent-rgb),.2), transparent 60%)'}} />
										<div style={{position: 'relative', height: '100%', padding: '30px 30px 28px', display: 'flex', flexDirection: 'column'}}>
											<div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
												{config.profileImageUrl ? (
													<span style={{width: 54, height: 54, borderRadius: 13, overflow: 'hidden', border: '1px solid var(--line-2)', boxShadow: '0 0 0 3px rgba(var(--accent-rgb),.1)', flexShrink: 0}}>
														<img src={config.profileImageUrl} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
													</span>
												) : (
													<span style={{width: 54, height: 54, borderRadius: 13, background: 'rgba(var(--accent-rgb),.1)', border: '1px solid rgba(var(--accent-rgb),.25)', flexShrink: 0}} />
												)}
												<span style={{fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', paddingTop: 4}}>
													card · services
												</span>
											</div>

											<div style={{fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--accent)', marginTop: 22}}>
												{config.greeting}
											</div>
											<h1 style={{fontFamily: 'var(--serif)', fontSize: 47, lineHeight: 0.92, margin: '11px 0 0', letterSpacing: '-.02em', color: 'var(--ink)'}}>
												{config.headline}
											</h1>
											<div style={{fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--ink-2)', marginTop: 16}}>
												{config.roleLabel}
											</div>

											<div style={{marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 16}}>
												<div style={{display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0}}>
													<span style={{fontFamily: 'var(--mono)', fontSize: 15, color: 'var(--ink)'}}>
														{config.siteUrl}
													</span>
													<span style={{fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)'}}>
														view my works on
													</span>
													<div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 9, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)'}}>
														<span
															className="animate-pulse"
															style={{width: 7, height: 7, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 8px rgba(var(--accent-rgb),.9)', flexShrink: 0, display: 'inline-block'}}
														/>
														tap card to flip →
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Back face */}
									<div
										style={{
											position: 'absolute',
											inset: 0,
											backfaceVisibility: 'hidden',
											WebkitBackfaceVisibility: 'hidden',
											transform: 'rotateY(180deg)',
											borderRadius: 'var(--radius)',
											border: '1px solid var(--line-2)',
											overflow: 'hidden',
											background: 'linear-gradient(165deg, var(--panel-2), var(--bg))',
											boxShadow: 'var(--shadow-lg)',
										}}
									>
										<div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(480px 280px at 16% -10%, rgba(var(--accent-rgb),.18), transparent 60%)'}} />
										<div style={{position: 'relative', height: '100%', padding: '26px 26px 22px', display: 'flex', flexDirection: 'column'}}>
											<div style={{fontFamily: 'var(--mono)', fontSize: 12.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)'}}>
												// services
											</div>
											<span style={{position: 'absolute', top: 24, right: 26, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)'}}>
												↩ tap to flip
											</span>

											<div style={{display: 'flex', flexDirection: 'column', margin: '16px 0 0', flex: 1, overflow: 'hidden'}}>
												{config.services.map((service, i) => (
													<div
														key={i}
														style={{
															display: 'grid',
															gridTemplateColumns: '32px 1fr',
															gap: 13,
															padding: '13px 0',
															borderBottom: '1px solid var(--line)',
														}}
													>
														<div style={{width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', background: 'rgba(var(--accent-rgb),.1)', border: '1px solid rgba(var(--accent-rgb),.25)', flexShrink: 0}}>
															<Icon icon={service.icon} width={17} height={17} />
														</div>
														<div>
															<div style={{display: 'flex', alignItems: 'center', gap: 8}}>
																<h4 style={{fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 16.5, margin: 0, color: 'var(--ink)'}}>
																	{service.title}
																</h4>
																{service.mainTag && (
																	<span style={{fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.04em', color: 'var(--accent)', border: '1px solid rgba(var(--accent-rgb),.32)', background: 'rgba(var(--accent-rgb),.08)', padding: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap'}}>
																		{service.mainTag}
																	</span>
																)}
															</div>
															{service.description && (
																<div style={{color: 'var(--ink-3)', fontSize: 13, lineHeight: 1.45, marginTop: 5}}>
																	{service.description}
																</div>
															)}
														</div>
													</div>
												))}
											</div>

											<div style={{marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
												<div style={{display: 'flex', gap: 8}}>
													{config.socialLinks.map((link) => (
														<a
															key={link.href}
															href={link.href}
															aria-label={link.label}
															target="_blank"
															rel="noopener noreferrer"
															onClick={(e) => e.stopPropagation()}
															style={{width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)', background: 'rgba(255,255,255,.035)', border: '1px solid var(--line-2)', textDecoration: 'none', transition: 'color .15s, border-color .15s'}}
														>
															<Icon icon={link.icon} width={16} height={16} />
														</a>
													))}
												</div>
												{config.contactEmail && (
													<a
														href={`mailto:${config.contactEmail}`}
														onClick={(e) => e.stopPropagation()}
														style={{textAlign: 'right', textDecoration: 'none'}}
													>
														<span style={{fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)', display: 'block'}}>
															★ preferred
														</span>
														<span style={{fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--ink)'}}>
															{config.contactEmail}
														</span>
													</a>
												)}
											</div>
										</div>
									</div>
								</motion.div>
							</div>

							<span style={{fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--ink-3)'}}>
								Tap the card to flip ·{' '}
								<span
									onClick={() => setFlipped(false)}
									style={{color: 'var(--accent)', cursor: 'pointer', borderBottom: '1px solid transparent'}}
								>
									reset
								</span>
							</span>
						</>
					)}
				</div>
			</div>
		</>
	);
}
