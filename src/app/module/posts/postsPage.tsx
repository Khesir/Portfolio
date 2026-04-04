import {useEffect, useState} from 'react';
import {fetchPosts, PostDto} from '@/app/api/cms';
import {Skeleton} from '@/components/ui/skeleton';
import {EngagementBar} from '@/components/EngagementBar';
import {Pin} from 'lucide-react';
import {motion} from 'framer-motion';
import {useEnvironment} from '@/hooks/use-environment-store';

function timeAgo(iso: string) {
	const diff = Date.now() - new Date(iso).getTime();
	const m = Math.floor(diff / 60000);
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	const d = Math.floor(h / 24);
	if (d < 30) return `${d}d ago`;
	return new Date(iso).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
}

const cardVariants = {
	initial: {y: 50, opacity: 0},
	animate: {y: 0, opacity: 1, transition: {type: 'spring', stiffness: 60, damping: 15}},
};

export function PostsPage() {
	const [posts, setPosts] = useState<PostDto[]>([]);
	const [loading, setLoading] = useState(true);
	const {refreshKey} = useEnvironment();

	useEffect(() => {
		fetchPosts()
			.then((all) => setPosts(all.filter((p) => !p.draft)))
			.finally(() => setLoading(false));
	}, [refreshKey]);

	return (
		<div className="flex w-full flex-col gap-6 dark:text-white">
			{/* Header */}
			<motion.div
				className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8"
				initial={{y: -50, opacity: 0}}
				animate={{y: 0, opacity: 1}}
				transition={{type: 'spring', stiffness: 60, damping: 15}}
			>
				<h1 className="text-4xl font-bold text-slate-900 dark:text-white">Posts</h1>
				<p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
					Thoughts, updates, and things I find worth sharing.
				</p>
			</motion.div>

			{/* Content */}
			{loading ? (
				<div className="flex flex-col gap-4">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-36 w-full rounded-2xl dark:bg-slate-700" />
					))}
				</div>
			) : posts.length === 0 ? (
				<motion.div
					className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-12 text-center"
					initial={{opacity: 0}}
					animate={{opacity: 1}}
				>
					<p className="text-slate-500 dark:text-slate-400 text-sm">No posts yet.</p>
				</motion.div>
			) : (
				<motion.div
					className="flex flex-col gap-4"
					initial="initial"
					animate="animate"
					variants={{animate: {transition: {staggerChildren: 0.08}}}}
				>
					{posts.map((post) => (
						<motion.div
							key={post.id}
							variants={cardVariants}
							className={`bg-white dark:bg-slate-900 border rounded-2xl shadow-lg p-6 space-y-4 ${
								post.pinned
									? 'border-amber-300 dark:border-amber-700'
									: 'border-slate-200 dark:border-slate-700'
							}`}
						>
							{post.pinned && (
								<div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
									<Pin size={12} className="fill-current" /> Pinned
								</div>
							)}

							<p className="text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap text-base">
								{post.content}
							</p>

							{post.imageUrl && (
								<div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
									<img src={post.imageUrl} alt="" className="w-full h-auto object-cover max-h-96" />
								</div>
							)}

							{post.tags.length > 0 && (
								<div className="flex flex-wrap gap-1.5">
									{post.tags.map((t) => (
										<span
											key={t}
											className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
										>
											#{t}
										</span>
									))}
								</div>
							)}

							<div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
								<span className="text-xs text-slate-400">{timeAgo(post.createdAt)}</span>
								<EngagementBar
									type="post"
									id={post.id}
									trackOnMount={true}
									hideViews={post.hideViews}
									hideHearts={post.hideHearts}
								/>
							</div>
						</motion.div>
					))}
				</motion.div>
			)}
		</div>
	);
}
