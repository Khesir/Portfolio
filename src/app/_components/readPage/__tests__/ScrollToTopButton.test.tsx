import {render, screen, fireEvent} from '@testing-library/react'
import {describe, it, expect, vi} from 'vitest'
import {ScrollToTopButton} from '../ScrollToTopButton'

function setScrollY(value: number) {
	Object.defineProperty(window, 'scrollY', {value, writable: true, configurable: true})
}

describe('ScrollToTopButton', () => {
	it('is not rendered while at the top of the page', () => {
		setScrollY(0)
		render(<ScrollToTopButton />)
		expect(screen.queryByRole('button', {name: /scroll to top/i})).not.toBeInTheDocument()
	})

	it('renders once the page is scrolled past the threshold', () => {
		setScrollY(0)
		render(<ScrollToTopButton />)

		setScrollY(500)
		fireEvent.scroll(window)

		expect(screen.getByRole('button', {name: /scroll to top/i})).toBeInTheDocument()
	})

	it('hides again once scrolled back near the top', () => {
		setScrollY(500)
		render(<ScrollToTopButton />)
		fireEvent.scroll(window)
		expect(screen.getByRole('button', {name: /scroll to top/i})).toBeInTheDocument()

		setScrollY(0)
		fireEvent.scroll(window)
		expect(screen.queryByRole('button', {name: /scroll to top/i})).not.toBeInTheDocument()
	})

	it('scrolls to top when clicked', () => {
		setScrollY(500)
		render(<ScrollToTopButton />)
		fireEvent.scroll(window)

		const scrollTo = vi.fn()
		window.scrollTo = scrollTo

		fireEvent.click(screen.getByRole('button', {name: /scroll to top/i}))
		expect(scrollTo).toHaveBeenCalledWith({top: 0, behavior: 'smooth'})
	})
})
