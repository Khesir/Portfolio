interface CacheEntry<T> {
	data: T;
	expiresAt: number;
}

export class ApiCache {
	private static store = new Map<string, CacheEntry<unknown>>();
	private static DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

	static get<T>(key: string): T | null {
		const entry = this.store.get(key) as CacheEntry<T> | undefined;
		if (!entry) return null;
		if (Date.now() > entry.expiresAt) {
			this.store.delete(key);
			return null;
		}
		return entry.data;
	}

	static set<T>(key: string, data: T, ttl = this.DEFAULT_TTL): void {
		this.store.set(key, {data, expiresAt: Date.now() + ttl});
	}

	static invalidate(key: string): void {
		this.store.delete(key);
	}

	static clear(): void {
		this.store.clear();
	}
}
