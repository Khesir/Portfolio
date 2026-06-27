import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {fetchBlogs} from '@/app/api/blogs';

function fmtDate(iso: string): string {
	const d = new Date(iso);
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${yyyy}.${mm}.${dd}`;
}

export function TerminalWritingSection() {
	const [blogs, setBlogs] = useState<any[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchBlogs()
			.then((data) => setBlogs(Array.isArray(data) ? data.slice(0, 3) : []))
			.catch(() => setBlogs([]));
	}, []);

	return (
		<>
			<div className="sl">
				<span className="n">03</span>
				<h2>writing</h2>
				<span className="rule" />
				<Link to="/blogs" className="more">all posts →</Link>
			</div>

			<section className="posts">
				{blogs.length === 0 ? (
					<p style={{color: 'var(--ink-3)', fontFamily: 'var(--mono)', fontSize: '13px'}}>No posts yet.</p>
				) : (
					blogs.map((b) => {
						const id = b._id ?? b.id;
						const name = b.name ?? 'Untitled';
						const tags: string[] = b.tags ?? [];
						return (
							<div
								className="post"
								key={id}
								onClick={() => navigate(`/blogs/view/${name.replace(/\s+/g, '-')}?id=${id}`)}
							>
								<span className="pdate">{b.releasedDate ? fmtDate(b.releasedDate) : '—'}</span>
								<div className="pmain">
									<h4>{name}</h4>
								</div>
								<div className="pmeta">
									{tags[0] && <span className="pcat">{tags[0]}</span>}
									{b.minRead && <span className="pread">{b.minRead} min</span>}
								</div>
							</div>
						);
					})
				)}
			</section>
		</>
	);
}
