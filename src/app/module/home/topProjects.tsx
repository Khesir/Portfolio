/* eslint-disable @typescript-eslint/no-explicit-any */
import {fetchProjects} from '@/app/api/projects';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {dateParser} from '@/lib/utils';
import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {
	ArrowUpRight,
	Github,
	RefreshCw,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import {motion} from 'framer-motion';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {toast} from 'sonner';
import {useEnvironment} from '@/hooks/use-environment-store';
import {Button} from '@/components/ui/Button';

export function TopProjects() {
	const [projects, setProjects] = useState([]);
	const [res, setRes] = useState(null);
	const [loading, setLoading] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const navigate = useNavigate();
	const {refreshKey} = useEnvironment();

	const fetchData = async () => {
		setRes(null);
		setLoading(true);
		try {
			const data = await fetchProjects();
			setProjects(data);
		} catch (e: any) {
			toast.error(e instanceof Error ? e.message : String(e));
			setRes(e.toString());
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [refreshKey]);

	const nextProject = () => {
		setCurrentIndex((prev) => (prev + 1) % projects.length);
	};

	const prevProject = () => {
		setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
	};

	const goToProject = (index: number) => {
		setCurrentIndex(index);
	};
	if (projects.length === 0) {
		return <div>Empty</div>;
	}
	if (res) {
		return (
			<div className="flex flex-col w-full gap-3 dark:bg-slate-800 dark:border-gray-700">
				<div className="flex justify-between">
					<Link to={'/projects'}>
						<p className="font-semibold text-2xl mb-2">Projects</p>
					</Link>
				</div>
				<Card
					className="flex justify-between pt-5 hover:dark:bg-slate-800 hover:bg-slate-300 transition-all"
					onClick={() => fetchData()}
				>
					<CardContent>Something went wrong while fetching data</CardContent>
					<CardFooter>
						<RefreshCw />
					</CardFooter>
				</Card>
			</div>
		);
	}
	if (loading || !projects) {
		return (
			<>
				<div className="flex justify-between mb-6">
					<Link to={'/projects'}>
						<p className="font-semibold text-2xl">Featured Projects</p>
					</Link>
					<div className="flex flex-col items-end pt-2">
						<Link
							to={'/projects'}
							className="font-semibold text-md hover:underline text-blue-600 dark:text-blue-400/60"
						>
							View all
						</Link>
					</div>
				</div>
				<div className="relative h-[450px] flex items-center justify-center">
					<Skeleton className="h-[370px] w-[580px] rounded-3xl bg-slate-500 dark:bg-slate-900" />
				</div>
			</>
		);
	}

	if (projects.length === 0 && !loading) {
		return <div> No Data Available</div>;
	}

	return (
		<div className="flex flex-col w-full gap-6 dark:bg-slate-800 dark:border-gray-700 mb-10">
			{/* Header */}
			<div className="flex justify-between items-center">
				<Link to={'/projects'} className="group">
					<h2 className="font-bold text-3xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
						Featured Projects
					</h2>
				</Link>
				<Link
					to={'/projects'}
					className="font-semibold text-sm hover:underline text-blue-600 dark:text-blue-400 flex items-center gap-1 group"
				>
					View all
					<ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
				</Link>
			</div>

			{/* Carousel Container */}
			<div className="relative h-[450px] flex items-center justify-center">
				{/* Fade Gradient Overlays */}
				<div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-white dark:from-slate-800 to-transparent z-25 pointer-events-none" />
				<div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-white dark:from-slate-800 to-transparent z-25 pointer-events-none" />

				{/* Navigation Buttons */}
				<Button
					onClick={prevProject}
					variant="outline"
					size="icon"
					className="absolute left-4 z-30 rounded-full w-12 h-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 shadow-xl border-2"
				>
					<ChevronLeft className="w-6 h-6" />
				</Button>
				<Button
					onClick={nextProject}
					variant="outline"
					size="icon"
					className="absolute right-4 z-30 rounded-full w-12 h-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 shadow-xl border-2"
				>
					<ChevronRight className="w-6 h-6" />
				</Button>

				{/* Projects */}
				<div className="relative w-full h-full flex items-center justify-center overflow-visible">
					{projects.map((project: any, index: number) => {
						const diff = index - currentIndex;
						const total = projects.length;
						const normalizedDiff = (diff + total) % total;

						let xOffset = 0;
						let scale = 0.7;
						let opacity = 0.3;
						let zIndex = 0;

						if (normalizedDiff === 0) {
							// Center
							xOffset = 0;
							scale = 1;
							opacity = 1;
							zIndex = 20;
						} else if (normalizedDiff === 1) {
							// Right adjacent
							xOffset = 380;
							scale = 0.82;
							opacity = 0.6;
							zIndex = 10;
						} else if (normalizedDiff === total - 1) {
							// Left adjacent
							xOffset = -380;
							scale = 0.82;
							opacity = 0.6;
							zIndex = 10;
						} else if (normalizedDiff === 2) {
							// Far right
							xOffset = 750;
							scale = 0.68;
							opacity = 0.3;
							zIndex = 5;
						} else if (normalizedDiff === total - 2) {
							// Far left
							xOffset = -750;
							scale = 0.68;
							opacity = 0.3;
							zIndex = 5;
						} else {
							// Very far - still visible but very faded
							if (normalizedDiff > total / 2) {
								xOffset = -1100;
							} else {
								xOffset = 1100;
							}
							scale = 0.55;
							opacity = 0.1;
							zIndex = 1;
						}

						return (
							<motion.div
								key={project.id}
								className="absolute cursor-pointer"
								style={{
									zIndex,
								}}
								initial={false}
								animate={{
									x: xOffset,
									scale,
									opacity,
								}}
								transition={{
									type: 'spring',
									stiffness: 260,
									damping: 28,
								}}
								onClick={() => {
									if (index === currentIndex) {
										navigate(
											`/projects/view/${project.properties.Name.title[0].plain_text.replace(/\s+/g, '-')}?id=${project.id}`,
										);
									} else {
										goToProject(index);
									}
								}}
							>
								<div className="w-[580px] h-[370px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
									{/* Image Section */}
									<div className="relative h-[220px] overflow-hidden group">
										<img
											src={
												project.properties.Image.files[0].file.url ||
												'/img/profile3.jpg'
											}
											alt={project.properties.Name.title[0].plain_text}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

										{/* Action Buttons on Image */}
										<div className="absolute top-4 right-4 flex gap-2">
											{project.properties.URL.url && (
												<a
													href={project.properties.URL.url}
													target="_blank"
													rel="noreferrer"
													onClick={(e) => e.stopPropagation()}
													className="p-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all shadow-lg"
												>
													<Github className="w-5 h-5" />
												</a>
											)}
											{project.properties.Deployment.url && (
												<a
													href={project.properties.Deployment.url}
													target="_blank"
													rel="noreferrer"
													onClick={(e) => e.stopPropagation()}
													className="p-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all shadow-lg"
												>
													<ArrowUpRight className="w-5 h-5" />
												</a>
											)}
										</div>
									</div>

									{/* Content Section */}
									<div className="p-5 space-y-3">
										<div>
											<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5 line-clamp-1">
												{project.properties.Name.title[0].plain_text}
											</h3>
											<p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
												<span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
												{project.properties['Released Date']?.date?.start
													? dateParser(
															project.properties['Released Date'].date.start,
														)
													: 'In progress'}
											</p>
										</div>

										{/* Tech Stack */}
										<div className="flex flex-wrap gap-1.5">
											{project.relatedData
												.slice(0, 4)
												.map((tech: any, idx: number) => (
													<Badge
														key={idx}
														variant="secondary"
														className="px-2.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
													>
														{tech.properties['Name'].title[0].plain_text}
													</Badge>
												))}
											{project.relatedData.length > 4 && (
												<Badge
													variant="secondary"
													className="px-2.5 py-0.5 text-xs"
												>
													+{project.relatedData.length - 4}
												</Badge>
											)}
										</div>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>

			{/* Pagination Dots */}
			<div className="flex justify-center gap-2 mt-4">
				{projects.map((_: any, index: number) => (
					<button
						key={index}
						onClick={() => goToProject(index)}
						className={`transition-all ${
							index === currentIndex
								? 'w-8 h-2 bg-blue-600 dark:bg-blue-400'
								: 'w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
						} rounded-full`}
					/>
				))}
			</div>
		</div>
	);
}
