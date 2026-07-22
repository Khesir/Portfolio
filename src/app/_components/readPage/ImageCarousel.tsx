import {useEffect} from 'react'

function ChevronIcon({direction}: {direction: 'left' | 'right'}) {
	const points = direction === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'
	return (
		<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<polyline points={points} />
		</svg>
	)
}

interface ImageCarouselProps {
	images: string[]
	alt: string
	index: number
	onIndexChange: (index: number) => void
	onImageClick: (src: string) => void
}

export function ImageCarousel({images, alt, index, onIndexChange, onImageClick}: ImageCarouselProps) {
	function goPrev(e?: React.MouseEvent) {
		e?.stopPropagation()
		onIndexChange(index === 0 ? images.length - 1 : index - 1)
	}

	function goNext(e?: React.MouseEvent) {
		e?.stopPropagation()
		onIndexChange(index === images.length - 1 ? 0 : index + 1)
	}

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'ArrowLeft') goPrev()
			if (e.key === 'ArrowRight') goNext()
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [index, images.length])

	return (
		<div className="acarousel">
			<div className="ahero" onClick={() => onImageClick(images[index])}>
				<img key={index} className="acarousel-img" src={images[index]} alt={alt} />
				<div className="acarousel-scrim" />
			</div>
			<button type="button" className="acarousel-arrow acarousel-prev" onClick={goPrev} aria-label="Previous image">
				<ChevronIcon direction="left" />
			</button>
			<button type="button" className="acarousel-arrow acarousel-next" onClick={goNext} aria-label="Next image">
				<ChevronIcon direction="right" />
			</button>
			<div className="acarousel-footer">
				<div className="acarousel-dots">
					{images.map((_, i) => (
						<button
							key={i}
							type="button"
							className={`acarousel-dot${i === index ? ' active' : ''}`}
							aria-label={`Go to image ${i + 1}`}
							onClick={(e) => {
								e.stopPropagation()
								onIndexChange(i)
							}}
						/>
					))}
				</div>
				<span className="acarousel-count">{index + 1} / {images.length}</span>
			</div>
		</div>
	)
}
