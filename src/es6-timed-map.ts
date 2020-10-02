/**
 * @name Es6TimedMap
 * An es6-map-like utility class with time based functions and support
 * TODO: add more JSDoc information
 *
 * Due to the similar surface area, use the Map doc reference from here:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 */
export default class Es6TimedMap<K, V, E> {
  constructor(private _entries?: readonly [K, V, E] | null) {}

  /**
   * Returns the number of key/value pairs in the `TimedMap` object
   */
  public get size(): number {
    return this.entries?.length || 0;
  }
  /**
   * Removes all key-value pairs from the `TimedMap` object
   */
  public clear(): void {
    // TODO:
  }

  /**
   * Returns `true` if the element in the `Map` object existed and has been removed,
   * or `false` if the element does not exist. `has` will return `false` afterwards.
   * @param key the key to remove
   */
  public delete(key: K): boolean {
    // TODO:
    return false;
  }

  public forEach(
    callback: (value: V, key: K, timedMap: Es6TimedMap<K, V, E>) => void,
    thisArg?: any
  ): void {
    // TODO:
  }

  public get(key: K): V | undefined {
    // TODO:
    return;
  }

  public has(key: K): boolean {
    // TODO:
    return true;
  }

  public set(
    key: K,
    value: V,
    expirationTime: number,
    expirationCallback?: any
  ) {
    return;
  }

  public entries(): Iterator<[K, V], any> {
    // TODO:
    return undefined as any;
  }

  public keys(): Array<K> {
    // TODO:
    return [];
  }

  public values(): Array<V> {
    // TODO:
    return [];
  }
}
