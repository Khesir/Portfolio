import {motion} from 'framer-motion';
import {Button} from '../ui/Button';
import {useNavigate} from 'react-router-dom';
import {Icon} from '@iconify/react';
import {useHomeConfig, getStatusStyle} from '@/hooks/use-home-config';
import type {BannerButton, StatusConfig} from '@/hooks/use-home-config';

function StatusBadge({status}: {status: StatusConfig}) {
	const style = getStatusStyle(status.type);
	return (
		<div
			className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${style.pill}`}
		>
			{status.type === 'custom' && status.emoji ? (
				<span className="text-base leading-none">{status.emoji}</span>
			) : (
				<span className={`w-2 h-2 rounded-full ${style.dot}`} />
			)}
			<span>
				{status.type === 'custom'
					? status.message || 'Custom Status'
					: style.text}
			</span>
		</div>
	);
}

function BannerBtn({btn}: {btn: BannerButton}) {
	const navigate = useNavigate();

	const handleClick = () => {
		if (btn.action === 'contact') {
			const el = document.getElementById('contact');
			if (el) el.scrollIntoView({behavior: 'smooth'});
		} else if (btn.to) {
			navigate(btn.to);
		} else if (btn.href) {
			window.open(btn.href, '_blank', 'noopener noreferrer');
		}
	};

	return (
		<Button
			variant={btn.variant === 'secondary' ? 'outline' : 'default'}
			className="flex items-center gap-2"
			onClick={handleClick}
		>
			{btn.icon && <Icon icon={btn.icon} className="w-4 h-4" />}
			{btn.label}
		</Button>
	);
}

export function AboutMeCard() {
	const {config} = useHomeConfig();

	// Hide the card if there's nothing to show
	if (!config.bannerTitle && config.bannerButtons.length === 0) return null;

	return (
		<motion.div
			className="absolute w-[90%] sm:w-[80%] md:w-[550px] bottom-8 right-4 md:right-8 bg-white dark:bg-slate-900 z-20 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
			initial={{x: '100%', opacity: 0}}
			animate={{x: 0, opacity: 1}}
			exit={{x: '100%', opacity: 0}}
			transition={{type: 'spring', stiffness: 100, damping: 15}}
		>
			<div className="p-6 space-y-4">
				{/* Status Badge */}
				<StatusBadge status={config.status} />

				{/* Title + subtitle */}
				{(config.bannerTitle || config.bannerSubtitle) && (
					<div className="space-y-1">
						{config.bannerTitle && (
							<h3 className="text-xl font-bold text-slate-900 dark:text-white">
								{config.bannerTitle}
							</h3>
						)}
						{config.bannerSubtitle && (
							<p className="text-sm text-slate-600 dark:text-slate-400">
								{config.bannerSubtitle}
							</p>
						)}
					</div>
				)}

				{/* Buttons */}
				{config.bannerButtons.length > 0 && (
					<div className="flex flex-wrap gap-3">
						{config.bannerButtons.map((btn, i) => (
							<BannerBtn key={i} btn={btn} />
						))}
					</div>
				)}
			</div>
		</motion.div>
	);
}
