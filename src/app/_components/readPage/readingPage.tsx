/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';

import '../../../css/markdown.css';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import {Tweet} from 'react-twitter-widgets';
import rehypeSanitize from 'rehype-sanitize';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism';

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

function CopyButton({text}: {text: string}) {
	const [copied, setCopied] = useState(false)

	function copy() {
		navigator.clipboard.writeText(text).then(() => {
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		})
	}

	return (
		<button className={`cb-copy${copied ? ' copied' : ''}`} onClick={copy}>
			{copied ? (
				<>
					<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
					copied
				</>
			) : (
				<>
					<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
					copy
				</>
			)}
		</button>
	)
}

export function ImageLightbox({src, onClose}: {src: string; onClose: () => void}) {
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [onClose])

	return (
		<div className="img-lb" onClick={onClose}>
			<button className="img-lb-close" onClick={e => { e.stopPropagation(); onClose() }}>✕</button>
			<div className="img-lb-inner" onClick={e => e.stopPropagation()}>
				<img src={src} alt="" />
			</div>
		</div>
	)
}

function getNodeText(children: React.ReactNode): string {
	if (typeof children === 'string') return children
	if (Array.isArray(children)) return children.map(getNodeText).join('')
	return ''
}

function slugifyHeading(text: string): string {
	return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function MarkDownComponent({markdown}: {markdown: string}) {
	const [lightbox, setLightbox] = useState<string | null>(null)

	return (
		<>
		<ReactMarkdown
			rehypePlugins={[rehypeRaw, rehypeSanitize]}
			remarkPlugins={[remarkGfm]}
			components={{
				h2: ({children}) => {
					const id = slugifyHeading(getNodeText(children))
					return <h2 id={id}>{children}</h2>
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
				img: ({src, alt}) => (
					<img
						src={src}
						alt={alt}
						className="img-zoomable"
						onClick={() => src && setLightbox(src)}
					/>
				),
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
					const isBlock = !inline && (typeof children === 'string' ? children : String(children ?? '')).includes('\n') || (!inline && match)

					if (!inline && match) {
						const raw = String(children).replace(/\n$/, '')
						return (
							<div className="codeblock">
								<div className="cb-bar">
									<i style={{background: '#ff5f57'}} />
									<i style={{background: '#febc2e'}} />
									<i style={{background: '#28c840'}} />
									<span className="cb-lang">{lang}</span>
									<CopyButton text={raw} />
								</div>
								<SyntaxHighlighter
									style={oneDark}
									language={lang}
									PreTag="div"
									customStyle={{margin: 0, padding: '16px 18px', background: 'transparent', fontSize: '12.5px', lineHeight: '1.7'}}
									codeTagProps={{style: {background: 'transparent', color: 'var(--ink-2)'}}}
									{...props}
								>
									{raw}
								</SyntaxHighlighter>
							</div>
						)
					}

					if (isBlock) {
						const raw = String(children).replace(/\n$/, '')
						return (
							<div className="codeblock">
								<div className="cb-bar">
									<i style={{background: '#ff5f57'}} />
									<i style={{background: '#febc2e'}} />
									<i style={{background: '#28c840'}} />
									<CopyButton text={raw} />
								</div>
								<pre style={{margin: 0, padding: '16px 18px', overflowX: 'auto'}}>
									<code style={{fontFamily: 'var(--mono)', fontSize: '12.5px', lineHeight: '1.7', color: 'var(--ink-2)', background: 'transparent', border: 0, padding: 0, display: 'block'}}>
										{raw}
									</code>
								</pre>
							</div>
						)
					}

					return <code {...props}>{children}</code>
				},
			}}
		>
			{markdown}
		</ReactMarkdown>
		{lightbox && <ImageLightbox src={lightbox} onClose={() => setLightbox(null)} />}
		</>
	)
}
