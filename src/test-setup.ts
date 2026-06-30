import '@testing-library/jest-dom';

const mockIntersectionObserver = vi.fn(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));
Object.defineProperty(window, 'IntersectionObserver', {value: mockIntersectionObserver, writable: true});
