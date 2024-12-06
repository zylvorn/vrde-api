'use strict'
// src/config/caches.ts
import NodeCache from 'node-cache'
interface Cache {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, expInSec?: number): void
  del(key: string): void
}

class MemoryCache implements Cache {
  private cache: NodeCache

  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 })
  }

  async get<T>(key: string) {
    const data = this.cache.get(key)
    return data ? (data as T) : null
  }

  set<T>(key: string, value: T, expInSec: number = 3600) {
    this.cache.set(key, value, expInSec)
  }

  del(key: string) {
    this.cache.del(key)
  }
}

class CacheManager {
  private cache: Cache
  private static instance: CacheManager
  private constructor() {
    this.cache = new MemoryCache()
  }

  async get<T>(key: string) {
    return this.cache.get<T>(key)
  }

  set<T>(key: string, value: T, expInSec: number = 2592000) {
    // 1 month = 30 days * 24 hours * 60 minutes * 60 seconds
    this.cache.set(key, value, expInSec)
  }

  del(key: string) {
    this.cache.del(key)
  }
  static getInstace() {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }
}
const cacheManager = CacheManager.getInstace()
export default cacheManager
