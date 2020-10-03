/**
 * @name Es6TimedMap
 * An es6-map-like utility class with time based functions and support
 * TODO: add more JSDoc information
 *
 * Due to the similar surface area, use the Map doc reference from here:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 */
export default class Es6TimedMap<K, V> {
  /**
   * The core map data, used to keep track of the data
   */
  private _core: Map<K, V>;
  /**
   * A map of timers where the key is the same key provided
   * to the `_core` map.
   * TODO: update timer type, might be wrong or to generic
   */
  private _timers = new Map<K, NodeJS.Timeout | number>();
  constructor(_entries?: readonly [K, V] | null) {
    // TODO: remove any call!
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._core = _entries ? new Map<K, V>(_entries as any) : new Map();
  }

  /**
   * Returns the number of key/value pairs in the `TimedMap` object
   */
  public get size(): number {
    return this.entries?.length || 0;
  }

  /**
   * Sets the value for the key in the `Map` object. Returns the `Map` object.
   * @param key the key of the element to add to the `Map` object
   * @param value the value of the element to add to the `Map` object
   * @param expirationTime the time in milliseconds to keep this element in the map.
   * @param expirationCallback an optional callback to execute once the timer expires
   *
   * TODO: provide type for expiration callback
   * TODO: verify no memory leaks via stress testing
   * TODO: add alternate call scheme that supports more arguments
   */
  public set(
    key: K,
    value: V,
    expirationTime: number,
    expirationCallback?: (key: K, value: V) => void
  ): Es6TimedMap<K, V> {
    this._core.set(key, value);
    this._timers.set(
      key,
      setTimeout(() => {
        if (expirationCallback) expirationCallback(key, value);
        if (this.onExpire) this.onExpire(key, value);
        this._core.delete(key);
        this._timers.delete(key);
      }, expirationTime)
    );
    return this;
  }

  /**
   * Removes all key-value pairs from the `TimedMap` object.
   * TODO: Add flag if we are to trigger expiration callback
   * TODO: verify types for handler
   */
  public clear(): void {
    this._core.clear();
    Array.from(this._timers.values()).forEach((handler) =>
      clearTimeout(handler as NodeJS.Timeout)
    );
    this._timers.clear();
  }

  /**
   * Returns `true` if the element in the `Map` object existed and has been removed,
   * or `false` if the element does not exist. `has` will return `false` afterwards.
   * @param key the key to remove
   */
  public delete(key: K): boolean {
    // TODO: Remove timer
    return this._core.delete(key);
  }

  /**
   * Calls ``callbackFn` once each key-value pair present in the `Map` object,
   * in insertion order. If a `thisArg` parameter is provided to `forEach`, it will be used
   * as `this` value for each callback
   * @param callback
   *
   * TODO: check typing for `thisArg` object
   */
  public forEach(
    callback: (value: V, key: K, timedMap: Es6TimedMap<K, V>) => void,
    thisArg?: Es6TimedMap<K, V>
  ): void {
    return this._core.forEach((value, key) =>
      callback(value, key, thisArg || this)
    );
  }

  /**
   * Returns the value at the given key, if there is one
   * @param key the key to get
   */
  public get(key: K): V | undefined {
    return this._core.get(key);
  }
  /**
   * Returns a boolean asserting whether a value has been associated
   * to the `key` in the `Map` object or not.
   */
  public has(key: K): boolean {
    return this._core.has(key);
  }
  /**
   * Returns a new `Iterator` object that containers **an array of [key, value]**
   * for each element in the `Map` object in insertion order.
   *
   * TODO: Check type data
   * TODO: Add support to return data
   */
  public entries(): Iterator<[K, V]> {
    return this._core.entries();
  }
  /**
   * Returns a new `Iterator` object that contains the **keys** for each element
   * in the `Map` object in insertion order
   */
  public keys(): IterableIterator<K> {
    return this._core.keys();
  }
  /**
   * Returns a new `Iterator` object that contains **values** for each element in the `Map` object in
   * insertion order.
   */
  public values(): IterableIterator<V> {
    return this._core.values();
  }

  /**
   * Event handler triggered whenever an item from the map is expired
   */
  public onExpire: ((key: K, value: V) => void) | null = null;

  // TODO: Add time specific methods
  // - timers - list of timers
  // - onExpire - called on expiration of an element
  // - touch - update an existing timer with the given time
}
