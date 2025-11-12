/* eslint-disable @typescript-eslint/no-explicit-any */
import {fetchProjects} from '@/app/api/projects';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {dateParser} from '@/lib/utils';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowUpRight, Github, Calendar} from 'lucide-react';
import {motion} from 'framer-motion';
import {useEnvironment} from '@/hooks/use-environment-store';

const containerVariants = {
	initial: {},
	animate: {
		transition: {
			staggerChildren: 0.08,
		},
	},
};

const cardVariants = {
	initial: {opacity: 0, y: 30},
	animate: {opacity: 1, y: 0, transition: {duration: 0.4}},
};

export function ProjectList() {
	const [projects, setProjects] = useState([]);
	const [res, setRes] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { refreshKey } = useEnvironment();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const data = await fetchProjects();
				setProjects(data);
			} catch (e: any) {
				setRes(e.toString());
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [refreshKey]);

	if (loading || !projects) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[...Array(6)].map((_, i) => (
					<Skeleton
						key={i}
						className="h-[380px] w-full rounded-2xl bg-slate-300 dark:bg-slate-800"
					/>
				))}
			</div>
		);
	}

	if (res) {
		return (
			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 text-center">
				<p className="text-red-600 dark:text-red-400">{res}</p>
			</div>
		);
	}

	if (projects.length === 0 && !loading) {
		return (
			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 text-center">
				<p className="text-slate-600 dark:text-slate-400">No projects available yet</p>
			</div>
		);
	}

	return (
		<motion.div
			variants={containerVariants}
			initial="initial"
			animate="animate"
			className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
		>
			{projects.map((d: any, i) => (
				<motion.div
					key={i}
					variants={cardVariants}
					className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02]"
					onClick={() =>
						navigate(
							`/projects/view/${d.properties.Name.title[0].plain_text.replace(/\s+/g, '-')}?id=${d.id}`,
						)
					}
				>
					{/* Project Image */}
					<div className="relative h-[200px] overflow-hidden bg-slate-100 dark:bg-slate-800">
						<img
							src={d.properties.Image.files[0]?.file.url || '/img/profile3.jpg'}
							alt={d.properties.Name.title[0].plain_text}
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

						{/* Action Buttons */}
						<div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							{d.properties.URL?.url && (
								<a
									href={d.properties.URL.url}
									target="_blank"
									rel="noreferrer"
									onClick={(e) => e.stopPropagation()}
									className="p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all shadow-lg"
								>
									<Github className="w-4 h-4" />
								</a>
							)}
							{d.properties.Deployment?.url && (
								<a
									href={d.properties.Deployment.url}
									target="_blank"
									rel="noreferrer"
									onClick={(e) => e.stopPropagation()}
									className="p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all shadow-lg"
								>
									<ArrowUpRight className="w-4 h-4" />
								</a>
							)}
						</div>
					</div>

					{/* Project Info */}
					<div className="p-5 space-y-3">
						{/* Title */}
						<div>
							<h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
								{d.properties.Name.title[0].plain_text}
							</h3>
						</div>

						{/* Date */}
						<div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
							<Calendar className="w-4 h-4" />
							<span>
								{d.properties['Released Date']?.date?.start
									? dateParser(d.properties['Released Date'].date.start)
									: 'In Progress'}
							</span>
						</div>

						{/* Tech Stack */}
						<div className="flex flex-wrap gap-1.5">
							{d.properties['Languages']?.multi_select.slice(0, 3).map(
								(tech: any, index: number) => (
									<Badge
										key={index}
										variant="secondary"
										className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
									>
										{tech.name}
									</Badge>
								),
							)}
							{d.properties['Languages']?.multi_select.length > 3 && (
								<Badge variant="secondary" className="px-2 py-0.5 text-xs">
									+{d.properties['Languages'].multi_select.length - 3}
								</Badge>
							)}
						</div>
					</div>
				</motion.div>
			))}
		</motion.div>
	);
}
