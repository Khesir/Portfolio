import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {fetchBlogs} from '@/app/api/blogs';
import {motion} from 'framer-motion';

function fmtDate(iso: string): string {
	const d = new Date(iso);
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${yyyy}.${mm}.${dd}`;
}

const listContainer = {
	hidden: {},
	show: {transition: {staggerChildren: 0.09}},
};
const listItem = {
	hidden: {opacity: 0, x: -18},
	show: {opacity: 1, x: 0, transition: {type: 'spring' as const, stiffness: 80, damping: 18}},
};

export function TerminalWritingSection({count = 3}: {count?: number}) {
	const [blogs, setBlogs] = useState<any[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchBlogs()
			.then((data) => setBlogs(Array.isArray(data) ? data.slice(0, count) : []))
			.catch(() => setBlogs([]));
	}, [count]);

	return (
		<>
			<div className="sl">
				<span className="n">03</span>
				<h2>writing</h2>
				<span className="rule" />
				<Link to="/blogs" className="more">all posts →</Link>
			</div>

			<motion.section
				className="posts"
				key={blogs.length}
				variants={listContainer}
				initial="hidden"
				whileInView="show"
				viewport={{once: true, amount: 0.1}}
			>
				{blogs.length === 0 ? (
					<p style={{color: 'var(--ink-3)', fontFamily: 'var(--mono)', fontSize: '13px'}}>No posts yet.</p>
				) : (
					blogs.map((b) => {
						const id = b._id ?? b.id;
						const name = b.name ?? 'Untitled';
						const tags: string[] = b.tags ?? [];
						return (
							<motion.div
								className="post"
								key={id}
								variants={listItem}
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
							</motion.div>
						);
					})
				)}
			</motion.section>
		</>
	);
}
