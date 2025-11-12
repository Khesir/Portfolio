/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {useEffect, useState} from 'react';
import {useLocation, useSearchParams} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import '../../../css/markdown.css';
import {useCustomBanner} from '@/hooks/useCustomBanner';
import {usePathname} from '@/hooks/use-pathname-store';
import {Breadcrumbs} from '@/components/breadcrumbs';
import {dateParser} from '@/lib/utils';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import {Skeleton} from '@/components/ui/skeleton';
import {Tweet} from 'react-twitter-widgets';
import {fetchProjectsByID} from '@/app/api/projects';
import {toast} from 'sonner';
import {fetchBlogsByID} from '@/app/api/blogs';
import rehypeSanitize from 'rehype-sanitize';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {xonokai as Xonokai} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {useEnvironment} from '@/hooks/use-environment-store';
import {motion} from 'framer-motion';
import {Calendar, Clock, ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import {useNavigate} from 'react-router-dom';
import {Badge} from '@/components/ui/badge';

interface ReadpageProps {
	name: string;
}

export function ReadPage({name}: ReadpageProps) {
	const {setImageUrl} = useCustomBanner();
	const location = useLocation();
	const {setPathname} = usePathname();
	const { refreshKey } = useEnvironment();
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();
	const [markdown, setMarkdown] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<any>('');
	const [loading, setLoading] = useState<boolean>();
	useEffect(() => {
		setPathname(location.pathname);
	}, [location.pathname, setPathname]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const id = searchParams.get('id');
				if (id === null) {
					toast.error('Missing ID - Data not found');
					return;
				}
				let response;
				switch (name) {
					case 'projects':
						response = await fetchProjectsByID(id);
						break;
					case 'blogs':
						response = await fetchBlogsByID(id);
						break;
				}
				if (response === null) return;
				setMarkdown(response.markdown);
				setData(response.data);
			} catch (err) {
				console.error(err);
				setError('Failed to load content');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [name, searchParams, setImageUrl, refreshKey]);

	if (error) {
		return (
			<div className="min-h-[400px] flex items-center justify-center">
				<div className="text-center">
					<p className="font-bold text-3xl dark:text-white mb-4">{error}</p>
					<Button onClick={() => navigate(-1)}>Go Back</Button>
				</div>
			</div>
		);
	}

	if (!data || (!markdown && loading)) {
		const skeletons = generateRandomSkeletons(10);
		return (
			<div className="flex flex-col gap-6">
				<Skeleton className="h-8 w-[400px] dark:bg-slate-700" />
				<Skeleton className="h-[300px] w-full rounded-2xl dark:bg-slate-700" />
				<div className="flex gap-3">
					<Skeleton className="h-6 w-[150px] dark:bg-slate-700" />
					<Skeleton className="h-6 w-[150px] dark:bg-slate-700" />
				</div>
				<div className="gap-5 flex flex-col">
					{skeletons.map((skeleton, index) => (
						<Skeleton
							key={index}
							style={{
								height: `${skeleton.height}px`,
								width: `${skeleton.width}px`,
							}}
							className="dark:bg-slate-700"
						/>
					))}
				</div>
			</div>
		);
	}

	const tags = name === 'projects'
		? data.properties?.['Languages']?.multi_select || []
		: data.properties?.['Tags']?.multi_select || [];

	return (
		<motion.div
			initial={{opacity: 0, y: 20}}
			animate={{opacity: 1, y: 0}}
			transition={{duration: 0.5}}
		>
			{/* Header Section */}
			<div className="mb-8">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate(-1)}
					className="mb-4 -ml-2"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back
				</Button>

				<Breadcrumbs />

				{/* Title and Meta */}
				<div className="mt-6 space-y-4">
					<h1 className="font-bold text-4xl md:text-5xl text-slate-900 dark:text-white leading-tight">
						{data?.properties?.Name?.title[0].plain_text}
					</h1>

					{/* Meta Information */}
					<div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
						{data.properties['Released Date']?.date?.start && (
							<div className="flex items-center gap-2">
								<Calendar className="w-4 h-4" />
								<span>{dateParser(data.properties['Released Date'].date.start)}</span>
							</div>
						)}
						{data?.properties['Min']?.number && (
							<div className="flex items-center gap-2">
								<Clock className="w-4 h-4" />
								<span>{data.properties['Min'].number} min read</span>
							</div>
						)}
					</div>

					{/* Tags */}
					{tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{tags.map((tag: any, index: number) => (
								<Badge
									key={index}
									variant="secondary"
									className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
								>
									{tag.name}
								</Badge>
							))}
						</div>
					)}
				</div>

				{/* Hero Image */}
				{data.properties?.Image?.files?.[0]?.file?.url && (
					<div className="mt-8 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
						<img
							src={data.properties.Image.files[0].file.url}
							alt={data?.properties?.Name?.title[0].plain_text}
							className="w-full h-[400px] object-cover"
						/>
					</div>
				)}
			</div>

			{/* Content Section */}
			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 md:p-12">
				<div className="prose dark:prose-invert prose-gray max-w-none prose-lg">
					<MarkDownComponent markdown={markdown} />
				</div>
			</div>

			{/* Back to top button */}
			<div className="mt-8 text-center">
				<Button
					variant="outline"
					onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
				>
					Back to Top
				</Button>
			</div>
		</motion.div>
	);
}

export const isTweetLink = (url: string | string[] | undefined) => {
	return typeof url === 'string' && url.includes('x.com/khesirr/status/');
};

export const getTweetId = (url: string) => {
	const tweetIdMatch = url.match(/status\/(\d+)/);
	return tweetIdMatch ? tweetIdMatch[1] : null;
};

export const isVideoLink = (url: string | string[] | undefined) => {
	const videoExtensions = /\.(mp4|m4p|webm|ogv|mov)(\?.*)?$/i;

	return (
		typeof url === 'string' &&
		(url.includes('youtube.com') ||
			url.includes('vimeo.com') ||
			videoExtensions.test(url))
	);
};

export const VideoComponent = ({src}: {src: string}) => {
	if (src.match(/\.(mp4|m4p|webm|ogv|mov)(\?.*)?$/i)) {
		return (
			<div className="video-container rounded-xl overflow-hidden my-6">
				<video width="100%" height="315" controls>
					<source src={src} type={`video/${src.split('.').pop()}`} />
					Your browser does not support the video tag.
				</video>
			</div>
		);
	}

	const videoId = getId(src);

	return (
		<div className="video-container rounded-xl overflow-hidden my-6 shadow-lg">
			<iframe
				width="100%"
				height="500"
				src={`//www.youtube.com/embed/${videoId}`}
				title="Video player"
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			></iframe>
		</div>
	);
};

export function getId(url: string) {
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	const match = url.match(regExp);

	return match && match[2].length === 11 ? match[2] : null;
}

export const generateRandomSkeletons = (count: number) => {
	return Array.from({length: count}, () => ({
		width: Math.floor(Math.random() * 600) + 100,
		height: Math.floor(Math.random() * 100) + 20,
	}));
};

export function MarkDownComponent({markdown}: {markdown: string}) {
	return (
		<ReactMarkdown
			className="w-full prose dark:prose-invert max-w-none"
			rehypePlugins={[rehypeRaw, rehypeSanitize]}
			remarkPlugins={[remarkGfm]}
			components={{
				h1: ({children}) => (
					<h1 className="text-3xl font-bold my-6 text-slate-900 dark:text-white">{children}</h1>
				),
				h2: ({children}) => (
					<h2 className="text-2xl font-semibold my-5 text-slate-900 dark:text-white">{children}</h2>
				),
				h3: ({children}) => (
					<h3 className="text-xl font-semibold my-4 text-slate-900 dark:text-white">{children}</h3>
				),
				p: ({children}) => <p className="my-4 leading-relaxed text-slate-700 dark:text-slate-300">{children}</p>,
				ul: ({children}) => <ul className="my-4 space-y-2">{children}</ul>,
				ol: ({children}) => <ol className="my-4 space-y-2">{children}</ol>,
				li: ({children}) => <li className="leading-relaxed">{children}</li>,
				blockquote: ({children}) => (
					<blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-slate-600 dark:text-slate-400">
						{children}
					</blockquote>
				),
				a: ({href, children}) => {
					if (isVideoLink(href)) {
						return href ? <VideoComponent src={href} /> : null;
					}
					if (isTweetLink(href)) {
						const tweetId = href ? getTweetId(href) : null;
						return tweetId ? (
							<div className="w-full mx-auto my-6">
								<Tweet tweetId={tweetId} />
							</div>
						) : null;
					}
					return (
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
						>
							{children}
						</a>
					);
				},
				img: ({src, alt}) => {
					return (
						<div className="w-full my-8 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
							<img
								src={src}
								alt={alt}
								className="w-full h-auto object-contain"
							/>
						</div>
					);
				},
				code({
					node,
					inline,
					className,
					children,
					...props
				}: {
					node?: any;
					inline?: boolean;
					className?: string;
					children?: React.ReactNode;
					[key: string]: any;
				}) {
					const match = /language-(\w+)/.exec(className || '');
					return !inline && match ? (
						<div className="my-6 rounded-xl overflow-hidden shadow-lg">
							<SyntaxHighlighter style={Xonokai} language={match[1]} {...props}>
								{String(children).replace(/\n$/, '')}
							</SyntaxHighlighter>
						</div>
					) : (
						<code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm font-mono" {...props}>
							{children}
						</code>
					);
				},
			}}
		>
			{markdown}
		</ReactMarkdown>
	);
}
