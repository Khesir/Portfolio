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
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {useEnvironment} from '@/hooks/use-environment-store';
import {motion} from 'framer-motion';
import {Calendar, Clock, ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import {useNavigate} from 'react-router-dom';
import {Badge} from '@/components/ui/badge';
import {EngagementBar} from '@/components/EngagementBar';
import {StickyHeart} from '@/components/StickyHeart';
import type {EngagementType} from '@/app/api/cms';

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
				setMarkdown(response.markdown ?? '');
				setData(response);
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

	const tags: string[] = name === 'projects'
		? data.languages ?? []
		: data.tags ?? [];

	const engagementType: EngagementType = name === 'projects' ? 'project' : 'blog';
	const itemId = searchParams.get('id') ?? '';
	const hideViews = data.hideViews ?? false;
	const hideHearts = data.hideHearts ?? false;

	return (
		<motion.div
			initial={{opacity: 0, y: 20}}
			animate={{opacity: 1, y: 0}}
			transition={{duration: 0.5}}
		>
			{/* Sticky heart — zero-height anchor, floats just outside the right edge */}
			{itemId && (
				<div className="sticky top-[45vh] h-0 overflow-visible hidden md:block">
					<div className="absolute right-0 translate-x-[calc(100%+1rem)] -translate-y-1/2">
						<StickyHeart type={engagementType} id={itemId} hideHearts={hideHearts} />
					</div>
				</div>
			)}
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
						{data?.name}
					</h1>

					{/* Meta Information */}
					<div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
						{data.releasedDate && (
							<div className="flex items-center gap-2">
								<Calendar className="w-4 h-4" />
								<span>{dateParser(data.releasedDate)}</span>
							</div>
						)}
						{data?.minRead && (
							<div className="flex items-center gap-2">
								<Clock className="w-4 h-4" />
								<span>{data.minRead} min read</span>
							</div>
						)}
						{itemId && (
							<EngagementBar type={engagementType} id={itemId} trackOnMount hideViews={hideViews} hideHearts={hideHearts} />
						)}
					</div>

					{/* Tags */}
					{tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{tags.map((tag: string, index: number) => (
								<Badge
									key={index}
									variant="secondary"
									className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
								>
									{tag}
								</Badge>
							))}
						</div>
					)}
				</div>

				{/* Hero Image */}
				{data.imageUrl && (
					<div className="mt-8 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
						<img
							src={data.imageUrl}
							alt={data?.name}
							className="w-full h-[400px] object-cover"
						/>
					</div>
				)}
			</div>

			{/* Content Section */}
			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 md:p-12">
				{markdown ? (
					<div className="prose dark:prose-invert prose-gray max-w-none prose-lg">
						<MarkDownComponent markdown={markdown} />
					</div>
				) : (
					<div className="text-center space-y-3 py-8">
						<p className="text-4xl">🚧</p>
						<h2 className="font-bold text-xl text-slate-900 dark:text-white">
							Content coming soon
						</h2>
						<p className="text-sm text-slate-500 dark:text-slate-400">
							This {name === 'projects' ? 'project' : 'post'} doesn&apos;t have a write-up yet. Check back later!
						</p>
					</div>
				)}
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

function getNodeText(children: React.ReactNode): string {
	if (typeof children === 'string') return children
	if (Array.isArray(children)) return children.map(getNodeText).join('')
	return ''
}

function slugifyHeading(text: string): string {
	return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function MarkDownComponent({markdown}: {markdown: string}) {
	let h2Count = 0

	return (
		<ReactMarkdown
			rehypePlugins={[rehypeRaw, rehypeSanitize]}
			remarkPlugins={[remarkGfm]}
			components={{
				h2: ({children}) => {
					h2Count++
					const num = String(h2Count).padStart(2, '0')
					const id = slugifyHeading(getNodeText(children))
					return <h2 id={id}><span className="hh">{num}</span>{children}</h2>
				},
				h3: ({children}) => {
					const id = slugifyHeading(getNodeText(children))
					return <h3 id={id}>{children}</h3>
				},
				p: ({children}) => <p>{children}</p>,
				ul: ({children}) => <ul>{children}</ul>,
				ol: ({children}) => <ol>{children}</ol>,
				li: ({children}) => <li>{children}</li>,
				blockquote: ({children}) => <blockquote>{children}</blockquote>,
				a: ({href, children}) => {
					if (isVideoLink(href)) {
						return href ? <VideoComponent src={href} /> : null
					}
					if (isTweetLink(href)) {
						const tweetId = href ? getTweetId(href) : null
						return tweetId ? (
							<div style={{width: '100%', margin: '24px auto'}}>
								<Tweet tweetId={tweetId} />
							</div>
						) : null
					}
					return (
						<a href={href} target="_blank" rel="noopener noreferrer">
							{children}
						</a>
					)
				},
				img: ({src, alt}) => <img src={src} alt={alt} />,
				code({
					node,
					inline,
					className,
					children,
					...props
				}: {
					node?: any
					inline?: boolean
					className?: string
					children?: React.ReactNode
					[key: string]: any
				}) {
					const match = /language-(\w+)/.exec(className || '')
					const lang = match ? match[1] : ''
					return !inline && match ? (
						<div className="codeblock">
							<div className="cb-bar">
								<i style={{background: '#ff5f57'}} />
								<i style={{background: '#febc2e'}} />
								<i style={{background: '#28c840'}} />
								<span className="cb-lang">{lang}</span>
							</div>
							<SyntaxHighlighter
								style={oneDark}
								language={lang}
								PreTag="div"
								customStyle={{margin: 0, padding: '16px 18px', background: 'transparent', fontSize: '12.5px'}}
								{...props}
							>
								{String(children).replace(/\n$/, '')}
							</SyntaxHighlighter>
						</div>
					) : (
						<code {...props}>{children}</code>
					)
				},
			}}
		>
			{markdown}
		</ReactMarkdown>
	)
}
