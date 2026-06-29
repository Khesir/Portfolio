import {usePathname} from '@/hooks/use-pathname-store';
import {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/Button';
import {Icon} from '@iconify/react';
import {motion} from 'framer-motion';
import {MapPin, Briefcase} from 'lucide-react';
import {ExperienceSection} from '@/app/module/home/experienceSection';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
	useHomeConfig,
	useAboutConfig,
	iconLabel,
	getStatusStyle,
} from '@/hooks/use-home-config';
import type {BannerButton} from '@/app/api/cms';

function AboutBtn({btn}: {btn: BannerButton}) {
	const navigate = useNavigate();
	const handleClick = () => {
		if (btn.action === 'contact') {
			navigate('/');
			setTimeout(() => {
				document
					.getElementById('contact')
					?.scrollIntoView({behavior: 'smooth'});
			}, 100);
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

export default function AboutMe() {
	const {setPathname} = usePathname();
	const navigate = useNavigate();
	const location = useLocation();
	const {config: home} = useHomeConfig();
	const {config: about} = useAboutConfig();

	useEffect(() => {
		setPathname(location.pathname);
	}, [location.pathname, setPathname]);

	return (
		<div className="flex w-full flex-col gap-6 dark:text-white">
			{/* Header Card */}
			<motion.div
				className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden"
				initial={{y: -50, opacity: 0}}
				whileInView={{y: 0, opacity: 1}}
				viewport={{once: true, amount: 0.3}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<div className="p-8">
					<div className="flex flex-col md:flex-row gap-8 items-start">
						{/* Profile Image */}
						<div className="flex-shrink-0">
							<div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-slate-200 dark:border-slate-700 shadow-md">
								<img
									src={
										about.profileImageUrl ||
										home.profileImageUrl ||
										'/img/profile2.jpg'
									}
									alt={home.name || 'Profile'}
									className="w-full h-full object-cover"
								/>
							</div>
						</div>

						{/* Header Content */}
						<div className="flex-1 space-y-4">
							<div>
								<div className="flex items-center justify-between mb-2">
									<div>
										<h1 className="text-4xl font-bold text-slate-900 dark:text-white">
											{home.name || 'Khesir (AJ)'}
										</h1>
									</div>
									{about.lastUpdatedAt && (
										<div className="hidden md:block text-xs text-slate-500 dark:text-slate-500 shrink-0">
											Last updated:{' '}
											{new Date(about.lastUpdatedAt).toLocaleDateString(
												'en-US',
												{
													month: 'long',
													year: 'numeric',
												},
											)}
										</div>
									)}
								</div>
								{home.role && (
									<p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-3">
										{home.role}
									</p>
								)}
								<div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
									{about.location && (
										<div className="flex items-center gap-1.5">
											<MapPin className="w-4 h-4" />
											<span>{about.location}</span>
										</div>
									)}
									{home.role && (
										<div className="flex items-center gap-1.5">
											<Briefcase className="w-4 h-4" />
											<span>{home.role}</span>
										</div>
									)}
								</div>
							</div>

							{/* Quick Actions */}
							{about.aboutButtons.length > 0 && (
								<div className="flex flex-wrap gap-3">
									{about.aboutButtons.map((btn, i) => (
										<AboutBtn key={i} btn={btn} />
									))}
								</div>
							)}

							{/* Status badge */}
							{(() => {
								const style = getStatusStyle(home.status.type);
								return (
									<div
										className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg w-fit border ${style.pill}`}
									>
										{home.status.type === 'custom' && home.status.emoji ? (
											<span>{home.status.emoji}</span>
										) : (
											<span className={`w-2 h-2 rounded-full ${style.dot}`} />
										)}
										<span className="text-sm font-medium">
											{home.status.type === 'custom'
												? home.status.message || 'Custom'
												: home.status.message || style.text}
										</span>
									</div>
								);
							})()}
						</div>
					</div>
				</div>
			</motion.div>

			{/* Professional Summary */}
			{about.professionalSummary && (
				<motion.div
					className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8"
					initial={{y: 50, opacity: 0}}
					whileInView={{y: 0, opacity: 1}}
					viewport={{once: true, amount: 0.3}}
					transition={{type: 'spring', stiffness: 60, damping: 15}}
				>
					<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
						Professional Summary
					</h2>
					<div className="prose prose-slate dark:prose-invert max-w-none">
						<ReactMarkdown remarkPlugins={[remarkGfm]}>
							{about.professionalSummary}
						</ReactMarkdown>
					</div>
				</motion.div>
			)}

			{/* Tech Stack */}
			{home.languages.length > 0 && (
				<motion.div
					className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8"
					initial={{y: 50, opacity: 0}}
					whileInView={{y: 0, opacity: 1}}
					viewport={{once: true, amount: 0.3}}
					transition={{type: 'spring', stiffness: 60, damping: 15}}
				>
					<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
						Tech Stack
					</h2>
					<div className="flex flex-wrap gap-3">
						{home.languages.map((entry, i) => (
							<div
								key={i}
								className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
							>
								<Icon icon={entry.icon} className="w-8 h-8" />
								<p className="font-semibold text-sm">
									{entry.label || iconLabel(entry.icon)}
								</p>
							</div>
						))}
					</div>
				</motion.div>
			)}

			{/* Technical Skills */}
			{about.technicalSkills.length > 0 && (
				<motion.div
					className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8"
					initial={{y: 50, opacity: 0}}
					whileInView={{y: 0, opacity: 1}}
					viewport={{once: true, amount: 0.3}}
					transition={{type: 'spring', stiffness: 60, damping: 15}}
				>
					<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
						Technical Skills
					</h2>
					<div className="space-y-6">
						{about.technicalSkills.map((cat, i) => (
							<div key={i}>
								<h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
									{cat.category}
								</h3>
								<div className="flex flex-wrap gap-2">
									{cat.items.map((item) => (
										<span
											key={item}
											className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300"
										>
											{item}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				</motion.div>
			)}


			{/* Off the Clock */}
			{about.offTheClock.length > 0 && (
				<motion.div
					className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8"
					initial={{y: 50, opacity: 0}}
					whileInView={{y: 0, opacity: 1}}
					viewport={{once: true, amount: 0.3}}
					transition={{type: 'spring', stiffness: 60, damping: 15}}
				>
					<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
						Off the Clock
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{about.offTheClock.map((item, i) => (
							<div
								key={i}
								className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
							>
								{item.icon && (
									<Icon icon={item.icon} className="w-8 h-8 shrink-0 mt-0.5 text-slate-600 dark:text-slate-400" />
								)}
								<div>
									<p className="font-semibold text-slate-900 dark:text-white text-sm">
										{item.label}
									</p>
									{item.description && (
										<p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
											{item.description}
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				</motion.div>
			)}

			{/* Work Experience */}
			<motion.div
				initial={{y: 50, opacity: 0}}
				whileInView={{y: 0, opacity: 1}}
				viewport={{once: true, amount: 0.3}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<ExperienceSection pageSize={10} displayHeader={true} />
			</motion.div>

			{/* Call to Action */}
			<motion.div
				className="bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4"
				initial={{y: 50, opacity: 0}}
				whileInView={{y: 0, opacity: 1}}
				viewport={{once: true, amount: 0.3}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<div className="text-center sm:text-left">
					<p className="font-bold text-lg text-slate-900 dark:text-white">
						Interested in working together?
					</p>
					<p className="text-sm text-slate-600 dark:text-slate-400">
						I&apos;m always open to discussing new opportunities and
						collaborations
					</p>
				</div>
				<Button
					size="lg"
					onClick={() => {
						navigate('/');
						setTimeout(() => {
							const el = document.getElementById('contact');
							if (el) el.scrollIntoView({behavior: 'smooth'});
						}, 100);
					}}
					className="whitespace-nowrap"
				>
					Get in Touch →
				</Button>
			</motion.div>
		</div>
	);
}
