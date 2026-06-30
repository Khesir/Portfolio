import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {fetchBlogsCms, cmsDeleteBlog} from '@/app/api/cms';
import {toast} from 'sonner';

const fmtDate = (iso: string) =>
	new Date(iso).toISOString().split('T')[0].replace(/-/g, '.');

export default function CmsBlogs() {
	const navigate = useNavigate();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [blogs, setBlogs] = useState<any[]>([]);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');

	useEffect(() => {
		fetchBlogsCms().then(setBlogs);
	}, []);

	const handleDelete = async (id: string) => {
		await cmsDeleteBlog(id);
		setBlogs((prev) => prev.filter((b) => b._id !== id && b.id !== id));
		toast.success('Blog deleted');
	};

	const filteredBlogs = blogs
		.filter((b) =>
			filter === 'all'
				? true
				: filter === 'published'
					? !b.draft
					: b.draft,
		)
		.filter(
			(b) =>
				!search ||
				(b.name ?? '').toLowerCase().includes(search.toLowerCase()),
		);

	return (
		<>
			<div className="cms-top">
				<div>
					<h1 className="cms-h1">Blogs</h1>
					<div className="sub">
						aj@khesir:~$ ls ./blogs · {blogs.length} entries
					</div>
				</div>
				<button className="btn-new" onClick={() => navigate('/cms/blogs/new')}>
					+ New Blog
				</button>
			</div>
			<div className="cms-toolbar">
				<div className="cms-search">
					<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.6}>
						<circle cx="11" cy="11" r="7" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
					<input
						type="text"
						placeholder="search blogs…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="cms-filter">
					<button
						className={filter === 'all' ? 'on' : ''}
						onClick={() => setFilter('all')}
					>
						All
					</button>
					<button
						className={filter === 'published' ? 'on' : ''}
						onClick={() => setFilter('published')}
					>
						Published
					</button>
					<button
						className={filter === 'drafts' ? 'on' : ''}
						onClick={() => setFilter('drafts')}
					>
						Drafts
					</button>
				</div>
			</div>
			<div className="cms-table">
				<div className="cms-listhead">
					<span>Title</span>
					<span>Released</span>
					<span className="r" />
				</div>
				{filteredBlogs.map((b) => (
					<div className="lrow" key={b.id ?? b._id}>
						<div>
							<div className="lname">
								{b.name}
								{b.draft && <span className="cbadge draft">draft</span>}
							</div>
						</div>
						<div className="ldate">
							{b.releasedDate ? fmtDate(b.releasedDate) : '—'}
						</div>
						<div className="lacts">
							<Link
								className="edit"
								to={`/cms/blogs/${b.id ?? b._id}/edit`}
							>
								Edit
							</Link>
							<button
								className="del"
								onClick={() => handleDelete(b.id ?? b._id)}
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
