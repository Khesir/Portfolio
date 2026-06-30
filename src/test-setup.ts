import '@testing-library/jest-dom';
import { vi } from 'vitest';

const mockIntersectionObserver = vi.fn(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));
Object.defineProperty(window, 'IntersectionObserver', {value: mockIntersectionObserver, writable: true});
