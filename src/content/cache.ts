// Content caching service for the portfolio CMS
// This service provides in-memory caching for content to improve performance

// Cache entry interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

// Cache service class
class ContentCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes default TTL

  // Set a value in the cache
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL
    };
    this.cache.set(key, entry);
  }

  // Get a value from the cache
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  // Delete a value from the cache
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clear all entries from the cache
  clear(): void {
    this.cache.clear();
  }

  // Check if a key exists in the cache
  has(key: string): boolean {
    return this.cache.has(key);
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }

  // Clean expired entries
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats(): { 
    size: number; 
    keys: string[]; 
    expiredCount: number 
  } {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const entry of this.cache.values()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredCount++;
      }
    }
    
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      expiredCount
    };
  }
}

// Export singleton instance
export const contentCache = new ContentCache();

// Content caching utilities
export class ContentCaching {
  // Cache keys for different content types
  static readonly CACHE_KEYS = {
    PROJECTS: 'content:projects',
    SKILLS: 'content:skills',
    EXPERIENCES: 'content:experiences',
    BLOG_POSTS: 'content:blogPosts',
    SKILL_CATEGORIES: 'content:skillCategories',
    METADATA: 'content:metadata',
    PROJECT_BY_ID: (id: string) => `content:project:${id}`,
    SKILL_BY_ID: (id: string) => `content:skill:${id}`,
    EXPERIENCE_BY_ID: (id: string) => `content:experience:${id}`,
    BLOG_POST_BY_ID: (id: string) => `content:blogPost:${id}`,
    BLOG_POST_BY_SLUG: (slug: string) => `content:blogPost:slug:${slug}`,
    SKILL_CATEGORY_BY_ID: (id: string) => `content:skillCategory:${id}`
  };

  // Get cached content or fetch and cache if not present
  static async getCachedContent<T>(
    key: string, 
    fetchFn: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    // Try to get from cache first
    const cached = contentCache.get<T>(key);
    if (cached !== null) {
      return cached;
    }
    
    // If not in cache, fetch the data
    const data = await fetchFn();
    
    // Cache the data
    contentCache.set(key, data, ttl);
    
    return data;
  }

  // Invalidate cache for a specific key
  static invalidateCache(key: string): void {
    contentCache.delete(key);
  }

  // Invalidate all content cache
  static invalidateAllContent(): void {
    const keys = Object.values(this.CACHE_KEYS);
    keys.forEach(key => {
      if (typeof key === 'string') {
        contentCache.delete(key);
      }
    });
  }

  // Invalidate cache for a specific content type
  static invalidateContentType(type: keyof typeof this.CACHE_KEYS): void {
    const key = this.CACHE_KEYS[type];
    if (typeof key === 'string') {
      contentCache.delete(key);
    }
  }
}