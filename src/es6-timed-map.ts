/**
 * @name Es6TimedMap
 * An es6-map-like utility class
 */
export default class Es6TimedMap<K, V, E> implements Map<K, V> {
  constructor(entries: readonly [K, V, E] | null) {}

  public get size() {
    // TODO:
    return 0;
  }

  public clear() {
    // TODO:
  }

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
    return;
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
