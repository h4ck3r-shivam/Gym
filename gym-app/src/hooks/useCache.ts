interface CacheItem<T> {
  value: T;
  timestamp: number;
  expiry: number;
}

export const useCache = () => {
  const getCache = <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;

      const cache: CacheItem<T> = JSON.parse(item);
      const now = Date.now();

      if (now - cache.timestamp > cache.expiry) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return cache.value;
    } catch {
      return null;
    }
  };

  const setCache = <T>(key: string, value: T, expiry: number): void => {
    try {
      const item: CacheItem<T> = {
        value,
        timestamp: Date.now(),
        expiry,
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.error('Cache set failed:', error);
    }
  };

  const removeCache = (key: string): void => {
    localStorage.removeItem(`cache_${key}`);
  };

  const clearCache = (): void => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  };

  return {
    getCache,
    setCache,
    removeCache,
    clearCache,
  };
};
