import {useEffect, useState} from 'react';
import {fetchPosts, PostDto} from '@/app/api/cms';
import {Skeleton} from '@/components/ui/skeleton';
import {EngagementBar} from '@/components/EngagementBar';

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

export function PostsPage() {
	const [posts, setPosts] = useState<PostDto[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchPosts()
			.then((all) => setPosts(all.filter((p) => !p.draft)))
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
			<h1 className="text-3xl font-bold text-slate-900 dark:text-white">Posts</h1>

			{loading ? (
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-32 w-full rounded-2xl" />
					))}
				</div>
			) : posts.length === 0 ? (
				<p className="text-slate-400 text-sm">No posts yet.</p>
			) : (
				<div className="space-y-4">
					{posts.map((post) => (
						<div
							key={post.id}
							className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3"
						>
							<p className="text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap">
								{post.content}
							</p>

							{post.imageUrl && (
								<div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
									<img src={post.imageUrl} alt="" className="w-full h-auto object-cover max-h-80" />
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

							<div className="flex items-center justify-between pt-1">
								<span className="text-xs text-slate-400">{timeAgo(post.createdAt)}</span>
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
			)}
		</div>
	);
}
