import {useEffect, useState} from 'react'

const SHOW_AFTER_SCROLL_Y = 400

export function ScrollToTopButton() {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		function onScroll() {
			setVisible(window.scrollY > SHOW_AFTER_SCROLL_Y)
		}
		onScroll()
		window.addEventListener('scroll', onScroll, {passive: true})
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	if (!visible) return null

	return (
		<button
			type="button"
			className="scroll-to-top"
			aria-label="Scroll to top"
			onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
		>
			<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<polyline points="18 15 12 9 6 15" />
			</svg>
			back to top
		</button>
	)
}
