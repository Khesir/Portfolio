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
	animate: {transition: {staggerChildren: 0.08}},
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
	const {refreshKey} = useEnvironment();

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
			<div className="flex flex-col gap-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{[...Array(4)].map((_, i) => (
						<Skeleton key={i} className="h-[250px] w-full rounded-2xl bg-slate-300 dark:bg-slate-800" />
					))}
				</div>
				<p className="text-center text-sm text-slate-400 dark:text-slate-500">
					Fetching for the first time — subsequent visits load instantly from cache.
				</p>
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
		<motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{blogs.map((d: any, i) => {
				const id = d._id ?? d.id;
				const name = d.name ?? 'Untitled';
				const tags: string[] = d.tags ?? [];

				return (
					<motion.div
						key={i}
						variants={cardVariants}
						className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02]"
						onClick={() => navigate(`/blogs/view/${name.replace(/\s+/g, '-')}?id=${id}`)}
					>
						{d.imageUrl && (
							<div className="relative h-[180px] overflow-hidden bg-slate-100 dark:bg-slate-800">
								<img
									src={d.imageUrl}
									alt={name}
									className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
							</div>
						)}

						<div className="p-6 space-y-3">
							<h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
								{name}
							</h3>

							<div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
								<div className="flex items-center gap-1.5">
									<Calendar className="w-4 h-4" />
									<span>{d.releasedDate ? dateParser(d.releasedDate) : 'Draft'}</span>
								</div>
								{d.minRead && (
									<div className="flex items-center gap-1.5">
										<Clock className="w-4 h-4" />
										<span>{d.minRead} min read</span>
									</div>
								)}
							</div>

							{tags.length > 0 && (
								<div className="flex flex-wrap gap-1.5">
									{tags.slice(0, 3).map((tag, index) => (
										<Badge key={index} variant="secondary" className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
											{tag}
										</Badge>
									))}
									{tags.length > 3 && (
										<Badge variant="secondary" className="px-2 py-0.5 text-xs">+{tags.length - 3}</Badge>
									)}
								</div>
							)}

							<div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<span>Read article</span>
								<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</div>
						</div>
					</motion.div>
				);
			})}
		</motion.div>
	);
}
