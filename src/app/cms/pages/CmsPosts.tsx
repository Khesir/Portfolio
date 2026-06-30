import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {fetchPostsCms, cmsDeletePost, cmsUpdatePost, PostDto} from '@/app/api/cms';
import {toast} from 'sonner';

function relativeTime(iso: string) {
	const diff = Date.now() - new Date(iso).getTime();
	const m = Math.floor(diff / 60000);
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	const d = Math.floor(h / 24);
	if (d < 7) return `${d}d ago`;
	return `${Math.floor(d / 7)}w ago`;
}

export default function CmsPosts() {
	const navigate = useNavigate();
	const [posts, setPosts] = useState<PostDto[]>([]);

	useEffect(() => {
		fetchPostsCms().then(setPosts);
	}, []);

	const handleDelete = async (id: string) => {
		if (!confirm('Delete this post?')) return;
		await cmsDeletePost(id);
		setPosts((prev) => prev.filter((p) => p.id !== id));
		toast.success('Post deleted');
	};

	const handlePin = async (post: PostDto) => {
		await cmsUpdatePost(post.id, {pinned: !post.pinned});
		setPosts((prev) =>
			prev.map((p) => (p.id === post.id ? {...p, pinned: !post.pinned} : p)),
		);
		toast.success(post.pinned ? 'Post unpinned' : 'Post pinned');
	};

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">Posts</h1>
					<div className="sub">
						aj@khesir:~$ ls ./posts · {posts.length} entries
					</div>
				</div>
				<button className="btn-new" onClick={() => navigate('/cms/posts/new')}>
					+ New Post
				</button>
			</div>
			<div className="cms-posts">
				{posts.map((post) => (
					<div className="cpost" key={post.id}>
						<div className="cbody">
							<div className="ctext">{post.content}</div>
							<div className="cmeta">
								<span className="t">{relativeTime(post.createdAt)}</span>
								{post.pinned && <span className="cbadge pin">pinned</span>}
								{post.draft && <span className="cbadge draft">draft</span>}
								{post.tags.map((t) => (
									<span className="htag" key={t}>
										#{t}
									</span>
								))}
							</div>
						</div>
						<div className="cacts">
							<button
								className={`pin${post.pinned ? ' on' : ''}`}
								onClick={() => handlePin(post)}
							>
								<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.6}>
									<path d="M12 17v5M9 3h6l-1 7 3 3H7l3-3z" />
								</svg>
							</button>
							<button onClick={() => navigate(`/cms/posts/${post.id}/edit`)}>
								<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.6}>
									<path d="M12 20h9" />
									<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
								</svg>
							</button>
							<button className="del" onClick={() => handleDelete(post.id)}>
								<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.6}>
									<polyline points="3 6 5 6 21 6" />
									<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
								</svg>
							</button>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
