import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {fetchPosts, PostDto} from '@/app/api/cms';
import {Skeleton} from '@/components/ui/skeleton';
import {ArrowUpRight, Pin} from 'lucide-react';
import {EngagementBar} from '@/components/EngagementBar';
import {useEnvironment} from '@/hooks/use-environment-store';

function timeAgo(iso: string) {
	const diff = Date.now() - new Date(iso).getTime();
	const m = Math.floor(diff / 60000);
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	const d = Math.floor(h / 24);
	if (d < 30) return `${d}d ago`;
	return new Date(iso).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

export function RecentPosts() {
	const [posts, setPosts] = useState<PostDto[]>([]);
	const [loading, setLoading] = useState(true);
	const {refreshKey} = useEnvironment();

	useEffect(() => {
		fetchPosts()
			.then((all) => setPosts(all.slice(0, 3)))
			.finally(() => setLoading(false));
	}, [refreshKey]);

	const Header = () => (
		<div className="flex justify-between items-center">
			<Link to="/posts" className="group">
				<h2 className="font-bold text-3xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
					Recent Posts
				</h2>
			</Link>
			<Link
				to="/posts"
				className="font-semibold text-sm hover:underline text-blue-600 dark:text-blue-400 flex items-center gap-1 group"
			>
				View all
				<ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
			</Link>
		</div>
	);

	if (loading) {
		return (
			<div className="flex flex-col w-full gap-4">
				<Header />
				<div className="space-y-3">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-24 w-full rounded-xl" />
					))}
				</div>
			</div>
		);
	}

	if (posts.length === 0) {
		return (
			<div className="flex flex-col w-full gap-4">
				<Header />
				<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
					<p className="text-slate-500 dark:text-slate-400 text-sm">No posts yet.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full gap-4">
			<Header />
			<div className="space-y-3">
				{posts.map((post) => (
					<div
						key={post._id ?? post.id}
						className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 space-y-2 ${
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
						<p className="text-slate-900 dark:text-white leading-relaxed line-clamp-3 whitespace-pre-wrap">
							{post.content}
						</p>
						<div className="flex items-center justify-between flex-wrap gap-2">
						<div className="flex items-center gap-2 flex-wrap">
							<span className="text-xs text-slate-400">
								{timeAgo(post.createdAt)}
							</span>
							{post.tags.map((t) => (
								<span
									key={t}
									className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
								>
									#{t}
								</span>
							))}
						</div>
						<EngagementBar
							type="post"
							id={post.id}
							trackOnMount={false}
							hideViews={post.hideViews}
							hideHearts={post.hideHearts}
						/>
					</div>
					</div>
				))}
			</div>
		</div>
	);
}
