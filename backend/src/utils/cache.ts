class MemoryCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;

  constructor() {
    this.cache = new Map();
  }

  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  getStats(): {
    totalItems: number;
    expiredItems: number;
    items: {
      key: string;
      age: number;
      ttl: number;
      expired: boolean;
    }[];
  } {
    const now = Date.now();
    const items = Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      age: now - item.timestamp,
      ttl: item.ttl,
      expired: now - item.timestamp > item.ttl,
    }));

    return {
      totalItems: this.cache.size,
      expiredItems: items.filter((item) => item.expired).length,
      items,
    };
  }
}

export const cache = new MemoryCache();

export const CACHE_KEYS = {
  HIERARCHY_STATS: 'hierarchy_stats',
  COUNTY_STATS: 'county_stats',
  CONSTITUENCY_STATS: 'constituency_stats',
} as const;
