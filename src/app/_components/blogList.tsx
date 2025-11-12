/* eslint-disable @typescript-eslint/no-explicit-any */
import {Skeleton} from '@/components/ui/skeleton';
import {dateParser} from '@/lib/utils';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {fetchBlogs} from '../api/blogs';
import {useEnvironment} from '@/hooks/use-environment-store';
import {motion} from 'framer-motion';
import {Calendar, Clock, ArrowRight} from 'lucide-react';
import {Badge} from '@/components/ui/badge';

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

export function BlogList() {
	const [blogs, setBlogs] = useState<any[]>([]);
	const [res, setRes] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { refreshKey } = useEnvironment();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const data = await fetchBlogs();
				setBlogs(Array.isArray(data) ? data : []);
			} catch (e: any) {
				setRes(e.toString());
				setBlogs([]);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [refreshKey]);

	if (loading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{[...Array(4)].map((_, i) => (
					<Skeleton
						key={i}
						className="h-[250px] w-full rounded-2xl bg-slate-300 dark:bg-slate-800"
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

	if (blogs.length === 0) {
		return (
			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 text-center">
				<p className="text-slate-600 dark:text-slate-400">No blog posts available yet</p>
			</div>
		);
	}

	return (
		<motion.div
			variants={containerVariants}
			initial="initial"
			animate="animate"
			className="grid grid-cols-1 md:grid-cols-2 gap-6"
		>
			{blogs.map((d: any, i) => (
				<motion.div
					key={i}
					variants={cardVariants}
					className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02]"
					onClick={() =>
						navigate(
							`/blogs/view/${d.properties.Name.title[0].plain_text.replace(/\s+/g, '-')}?id=${d.id}`,
						)
					}
				>
					{/* Blog Image - if available */}
					{d.properties?.Image?.files?.[0]?.file?.url && (
						<div className="relative h-[180px] overflow-hidden bg-slate-100 dark:bg-slate-800">
							<img
								src={d.properties.Image.files[0].file.url}
								alt={d.properties.Name.title[0].plain_text}
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						</div>
					)}

					{/* Blog Content */}
					<div className="p-6 space-y-3">
						{/* Title */}
						<h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
							{d.properties.Name.title[0].plain_text}
						</h3>

						{/* Meta Information */}
						<div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
							<div className="flex items-center gap-1.5">
								<Calendar className="w-4 h-4" />
								<span>
									{d.properties['Released Date']?.date?.start
										? dateParser(d.properties['Released Date'].date.start)
										: 'Draft'}
								</span>
							</div>
							{d.properties['Min']?.number && (
								<div className="flex items-center gap-1.5">
									<Clock className="w-4 h-4" />
									<span>{d.properties['Min'].number} min read</span>
								</div>
							)}
						</div>

						{/* Tags */}
						{d.properties?.['Tags']?.multi_select?.length > 0 && (
							<div className="flex flex-wrap gap-1.5">
								{d.properties['Tags'].multi_select.slice(0, 3).map(
									(tag: any, index: number) => (
										<Badge
											key={index}
											variant="secondary"
											className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
										>
											{tag.name}
										</Badge>
									),
								)}
								{d.properties['Tags'].multi_select.length > 3 && (
									<Badge variant="secondary" className="px-2 py-0.5 text-xs">
										+{d.properties['Tags'].multi_select.length - 3}
									</Badge>
								)}
							</div>
						)}

						{/* Read More */}
						<div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
							<span>Read article</span>
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</div>
					</div>
				</motion.div>
			))}
		</motion.div>
	);
}
