/* eslint-disable @typescript-eslint/no-explicit-any */
import {fetchExperiences} from '@/app/api/experience';
import {Badge} from '@/components/ui/badge';
import {Dialog, DialogContent, DialogTitle} from '@/components/ui/dialog';
import {Skeleton} from '@/components/ui/skeleton';
import {dateParser} from '@/lib/utils';
import {motion} from 'framer-motion';
import {ArrowUpRight, RefreshCw, Briefcase, Calendar, MapPin} from 'lucide-react';
import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {useEnvironment} from '@/hooks/use-environment-store';
import {MarkDownComponent} from '@/app/_components/readPage/readingPage';
import {Link} from 'react-router-dom';
import {ScrollArea} from '@/components/ui/scroll-area';

const containerVariants = {
	initial: {},
	animate: {transition: {staggerChildren: 0.15}},
};

const cardVariants = {
	initial: {opacity: 0, x: -30},
	animate: {opacity: 1, x: 0, transition: {duration: 0.4}},
};

export function ExperienceSection({
	pageSize = 4,
	displayHeader = true,
}: {
	pageSize: number;
	displayHeader: boolean;
}) {
	const [experiences, setExperiences] = useState<any[]>([]);
	const [res, setRes] = useState(null);
	const [loading, setLoading] = useState(false);
	const {refreshKey} = useEnvironment();

	const [open, setOpen] = useState(false);
	const [selectedExperience, setSelectedExperience] = useState<number | null>(null);
	const openDialog = (rowId: number) => {
		setOpen(true);
		setSelectedExperience(rowId);
	};

	const fetchData = async () => {
		setRes(null);
		setLoading(true);
		try {
			const res = await fetchExperiences(pageSize);
			setExperiences(Array.isArray(res) ? res : []);
		} catch (e: any) {
			toast.error(e instanceof Error ? e.message : String(e));
			setRes(e.toString());
			setExperiences([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refreshKey]);

	const selected = selectedExperience !== null ? experiences[selectedExperience] : null;

	if (res) {
		return (
			<div className="flex flex-col w-full gap-3">
				{displayHeader && <h2 className="font-bold text-3xl text-slate-900 dark:text-white">Work Experience</h2>}
				<motion.div
					initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
					className="bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all"
					onClick={() => fetchData()}
				>
					<div className="flex items-start gap-4">
						<div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
							<RefreshCw className="w-6 h-6 text-red-600 dark:text-red-400 animate-pulse" />
						</div>
						<div className="flex-1">
							<h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Failed to Load Experiences</h3>
							<div className="text-xs text-red-600 dark:text-red-400 font-mono bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-3 break-all">Error: {res}</div>
							<p className="text-sm text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-2">
								<span>Click to retry</span><ArrowUpRight className="w-4 h-4" />
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		);
	}

	if (loading || !experiences) {
		return (
			<>
				{displayHeader && (
					<div className="flex justify-between items-center mb-6">
						<h2 className="font-bold text-3xl text-slate-900 dark:text-white">Work Experience</h2>
						<Link to={'/experiences'} className="font-semibold text-sm hover:underline text-purple-600 dark:text-purple-400 flex items-center gap-1 group">
							View all <ArrowUpRight className="w-4 h-4" />
						</Link>
					</div>
				)}
				<motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col gap-4">
					{[1, 2].map((i) => (
						<div key={i} className="ml-16 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-md border border-slate-200 dark:border-slate-700">
							<div className="flex gap-4">
								<Skeleton className="w-16 h-16 rounded-lg bg-slate-300 dark:bg-slate-700" />
								<div className="flex-1 space-y-3">
									<Skeleton className="h-5 w-3/4 bg-slate-300 dark:bg-slate-700" />
									<Skeleton className="h-4 w-1/2 bg-slate-300 dark:bg-slate-700" />
									<div className="flex gap-2">
										<Skeleton className="h-6 w-16 rounded-full bg-slate-300 dark:bg-slate-700" />
										<Skeleton className="h-6 w-16 rounded-full bg-slate-300 dark:bg-slate-700" />
									</div>
								</div>
							</div>
						</div>
					))}
				</motion.div>
			</>
		);
	}

	if (experiences.length === 0 && !loading) {
		return (
			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 text-center">
				<p className="text-slate-600 dark:text-slate-400">No work experiences available yet</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full gap-6 dark:bg-slate-800 dark:border-gray-700 mb-10">
			{displayHeader && (
				<div className="flex justify-between items-center">
					<Link to={'/experiences'} className="group">
						<h2 className="font-bold text-3xl text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
							Work Experience
						</h2>
					</Link>
					<Link to={'/experiences'} className="font-semibold text-sm hover:underline text-purple-600 dark:text-purple-400 flex items-center gap-1 group">
						View all <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
					</Link>
				</div>
			)}

			<motion.div variants={containerVariants} initial="initial" animate="animate" className="relative flex flex-col gap-4">
				<div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-300 dark:bg-slate-700" />

				{experiences.map((d: any, i: number) => {
					const skills: string[] = d.highlightSkills ?? [];
					return (
						<motion.div key={i} variants={cardVariants} onClick={() => openDialog(i)} className="group relative cursor-pointer">
							<div className="absolute left-6 top-8 w-5 h-5 rounded-full bg-purple-500 dark:bg-purple-400 border-4 border-white dark:border-slate-800 shadow-lg z-10 group-hover:scale-125 transition-transform" />

							<div className="ml-16 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
								<div className="flex gap-4">
									<div className="flex-shrink-0">
										<div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
											<img
												src={d.imageUrl || '/img/placeholder-2.jpg'}
												alt={d.companyName ?? ''}
												className="w-full h-full object-contain p-1.5"
											/>
										</div>
									</div>

									<div className="flex-1 space-y-2">
										<div className="flex justify-between items-start">
											<div>
												<div className="flex items-center gap-2">
													<h3 className="text-lg font-bold text-slate-900 dark:text-white">
														{d.position}
													</h3>
													<ArrowUpRight className="w-4 h-4 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-all" />
												</div>
												<p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
													{d.companyName}
												</p>
											</div>
										</div>

										<div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-400">
											<div className="flex items-center gap-1">
												<Calendar className="w-3.5 h-3.5" />
												<span>
													{d.durationStart ? dateParser(d.durationStart) : ''} —{' '}
													{d.durationEnd ? dateParser(d.durationEnd) : 'Present'}
												</span>
											</div>
											{d.jobType && (
												<div className="flex items-center gap-1">
													<Briefcase className="w-3.5 h-3.5" />
													<span>{d.jobType}</span>
												</div>
											)}
											{d.employmentType && (
												<div className="flex items-center gap-1">
													<MapPin className="w-3.5 h-3.5" />
													<span>{d.employmentType}</span>
												</div>
											)}
										</div>

										<div className="flex flex-wrap gap-1.5">
											{skills.slice(0, 4).map((skill, index) => (
												<Badge key={index} variant="secondary" className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
													{skill}
												</Badge>
											))}
											{skills.length > 4 && (
												<Badge variant="secondary" className="px-2 py-0.5 text-xs">+{skills.length - 4} more</Badge>
											)}
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					);
				})}
			</motion.div>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="dark:text-white sm:max-w-[90%] xl:max-w-[60%] dark:bg-slate-800 max-h-[85vh] flex flex-col">
					<DialogTitle className="text-2xl font-bold flex-shrink-0">
						{selected?.position}
						<span className="text-base font-normal text-slate-600 dark:text-slate-400 ml-3">
							({selected?.durationStart ? dateParser(selected.durationStart) : ''} —{' '}
							{selected?.durationEnd ? dateParser(selected.durationEnd) : 'Present'})
						</span>
					</DialogTitle>

					<ScrollArea className="flex-1 pr-4">
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg">
								<div>
									<p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Company</p>
									<p className="font-semibold">{selected?.companyName}</p>
								</div>
								<div>
									<p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Work Environment</p>
									<p className="font-semibold">{selected?.jobType}</p>
								</div>
								<div>
									<p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Position</p>
									<p className="font-semibold">{selected?.position}</p>
								</div>
								<div>
									<p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Employment Type</p>
									<p className="font-semibold">{selected?.employmentType}</p>
								</div>
							</div>

							{(selected?.highlightSkills ?? []).length > 0 && (
								<div>
									<p className="text-sm font-semibold mb-2">Highlighted Skills</p>
									<div className="flex gap-2 flex-wrap">
										{(selected?.highlightSkills ?? []).map((skill: string, index: number) => (
											<Badge key={index} variant="secondary" className="px-3 py-1">{skill}</Badge>
										))}
									</div>
								</div>
							)}

							<div className="border-t pt-4">
								<MarkDownComponent markdown={selected?.pageMd || 'No description available.'} />
							</div>
						</div>
					</ScrollArea>
				</DialogContent>
			</Dialog>
		</div>
	);
}
