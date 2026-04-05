import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
	fetchPostsCms,
	cmsDeletePost,
	cmsUpdatePost,
	PostDto,
} from '@/app/api/cms';
import {Button} from '@/components/ui/Button';
import {toast} from 'sonner';
import {Skeleton} from '@/components/ui/skeleton';
import {EyeOff, Heart, Pencil, Trash2, Pin} from 'lucide-react';

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

export default function CmsPosts() {
	const navigate = useNavigate();
	const [posts, setPosts] = useState<PostDto[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchPostsCms()
			.then(setPosts)
			.finally(() => setLoading(false));
	}, []);

	const handleDelete = async (id: string) => {
		if (!confirm('Delete this post?')) return;
		await cmsDeletePost(id);
		setPosts((prev) => prev.filter((p) => p.id !== id));
		toast.success('Post deleted');
	};

	const handleTogglePin = async (post: PostDto) => {
		await cmsUpdatePost(post.id, {pinned: !post.pinned});
		setPosts((prev) =>
			prev.map((p) => (p.id === post.id ? {...p, pinned: !post.pinned} : p)),
		);
		toast.success(post.pinned ? 'Post unpinned' : 'Post pinned');
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">Posts</h1>
				<Button onClick={() => navigate('/cms/posts/new')}>+ New Post</Button>
			</div>

			{loading ? (
				<div className="space-y-3">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-24 w-full rounded-xl" />
					))}
				</div>
			) : posts.length === 0 ? (
				<p className="text-slate-400 text-sm">No posts yet.</p>
			) : (
				<div className="space-y-3">
					{posts.map((post) => (
						<div
							key={post.id}
							className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex gap-4"
						>
							<div className="flex-1 min-w-0 space-y-1.5">
								<p className="text-sm text-slate-900 dark:text-white leading-relaxed line-clamp-2">
									{post.content}
								</p>
								<div className="flex items-center gap-3 flex-wrap">
									<span className="text-xs text-slate-400">
										{timeAgo(post.createdAt)}
									</span>
									{post.pinned && (
										<span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
											<Pin size={10} className="fill-current" /> Pinned
										</span>
									)}
									{post.draft && (
										<span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
											Draft
										</span>
									)}
									{post.tags.map((t) => (
										<span
											key={t}
											className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500"
										>
											#{t}
										</span>
									))}
									<div className="flex items-center gap-2 ml-auto">
										{post.hideViews && (
											<EyeOff size={12} className="text-slate-400" />
										)}
										{post.hideHearts && (
											<Heart size={12} className="text-slate-400" />
										)}
									</div>
								</div>
							</div>
							<div className="flex items-start gap-1 shrink-0">
								<button
									type="button"
									onClick={() => handleTogglePin(post)}
									title={post.pinned ? 'Unpin' : 'Pin'}
									className={`p-1.5 rounded transition-colors ${
										post.pinned
											? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
											: 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
									}`}
								>
									<Pin
										size={14}
										className={post.pinned ? 'fill-current' : ''}
									/>
								</button>
								<button
									type="button"
									onClick={() => navigate(`/cms/posts/${post.id}/edit`)}
									className="p-1.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
								>
									<Pencil size={14} />
								</button>
								<button
									type="button"
									onClick={() => handleDelete(post.id)}
									className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
								>
									<Trash2 size={14} />
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
