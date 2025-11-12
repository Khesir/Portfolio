/* eslint-disable @typescript-eslint/no-explicit-any */
import {Skeleton} from '@/components/ui/skeleton';
import {dateParser} from '@/lib/utils';
import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {fetchBlogs} from '../api/blogs';
import {useEnvironment} from '@/hooks/use-environment-store';

export function BlogList() {
	const [projects, setProjects] = useState([]);
	const [res, setRes] = useState(null);
	const [loading, setLoading] = useState(false);
	const location = useLocation();
	const { refreshKey } = useEnvironment();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const data = await fetchBlogs();
				setProjects(data);
			} catch (e: any) {
				setRes(e.toString());
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [refreshKey]);
	if (loading) {
		return (
			<div className="flex flex-col gap-5">
				{Array.from({length: 1}, (_, index) => (
					<Skeleton key={index} className="h-[50px] w-full dark:bg-slate-700" />
				))}
			</div>
		);
	}
	if (res) {
		return <div> {res} </div>;
	}
	if (projects.length === 0) {
		return <div>No available blogs</div>;
	}
	return (
		<>
			{projects.map((d: any, i) => (
				<div className="flex flex-col cursor-default gap-2" key={i}>
					<a
						className={`font-semibold ${location.pathname === '/' ? 'text-sm' : 'text-lg'} hover:underline decoration-2 cursor-pointer text-blue-600 dark:text-blue-400`}
						href={`/blogs/view/${d.properties.Name.title[0].plain_text.replace(/\s+/g, '-')}?id=${d.id}`}
					>
						{d.properties.Name.title[0].plain_text}
					</a>
					<p className="font-semibold text-xs text-slate-500 dark:text-slate-400">
						{d.properties['Released Date']?.date?.start
							? dateParser(d.properties['Released Date'].date.start)
							: 'In progress'}
					</p>
				</div>
			))}
		</>
	);
}
