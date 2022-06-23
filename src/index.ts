/**
 * Type representing a TimeoutID for a nodejs.timeout timer.
 * @private
 */
export type TimeoutID = NodeJS.Timeout | number;

/**
 * Data saved for individual _timers.
 * @private
 */
export type Timeout<K, V> = [
  id: TimeoutID,
  start: number,
  ms: number,
  callback: ((key: K, value: V) => void) | undefined
];

/**
 * Type representing a the callback signature called when something timesout.
 */
export type ExpirationCallback<Key, Value> = (key: Key, value: Value) => void;

/**
 * @name Es6TimedMap
 * An es6-map-like utility class with time based functions and support.
 *
 * Due to the similar surface area, use the Map doc reference from [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
 */
export default class Es6TimedMap<Key, Value> {
  /**
   * The core map data, used to keep track of the data itself.
   * @private
   */
  private _core = new Map<Key, Value>();

  /**
   * A map of timers where the key is the same key provided
   * to the `_core` map.
   * @private
   */
  private _timers = new Map<Key, Timeout<Key, Value>>();

  /**
   *
   * @param _entries list of entires to pre-populate the timed-map with
   */
  constructor(
    _entries?: Array<
      | [Key, Value, number, ExpirationCallback<Key, Value>]
      | [Key, Value, number]
    > | null
  ) {
    if (!_entries) {
      return;
    }

    if (!Array.isArray(_entries)) {
      throw new Error('Invalid entries provided');
    }

    _entries.forEach(([key, value, expirationTime, expirationCallback]) =>
      this.set(key, value, expirationTime, expirationCallback)
    );
  }

  /**
   * Returns the number of key/value pairs in the `TimedMap` object
   */
  public get size(): number {
    return this._core?.size || 0;
  }

  /**
   * Sets the value for the key in the `Map` object. Returns the `Map` object.
   * @param key the key of the element to add to the `Map` object
   * @param value the value of the element to add to the `Map` object
   * @param expirationTime the time in milliseconds to keep this element in the map.
   * @param expirationCallback an optional callback to execute once the timer expires
   *
   * TODO: verify no memory leaks via stress testing
   * TODO: add alternate call scheme that supports more arguments
   */
  public set(
    key: Key,
    value: Value,
    expirationTime: number,
    expirationCallback?: ExpirationCallback<Key, Value>
  ): Es6TimedMap<Key, Value> {
    this._core.set(key, value);
    this._timers.set(key, [
      setTimeout(() => {
        if (typeof expirationCallback === 'function')
          expirationCallback(key, value);
        if (typeof this.onExpire === 'function') this.onExpire(key, value);
        this._core.delete(key);
        this._timers.delete(key);
      }, expirationTime),
      Date.now(),
      expirationTime,
      expirationCallback
    ]);
    return this;
  }

  /**
   * Removes all key-value pairs from the `TimedMap` object.
   * @params params param object, is optional
   * @params params.triggerExpirationCallback if we are to trigger the expiration callback
   *   for all timers.
   * @params params.triggerOnExpire if we are to trigger the general onExpire callback
   */
  public clear(params?: {
    triggerExpirationCallback?: boolean;
    triggerOnExpire?: boolean;
  }): void {
    const triggerExpirationCallback = !!params?.triggerExpirationCallback;
    const triggerOnExpire = !!params?.triggerOnExpire;

    Array.from(this._timers.entries()).forEach(
      ([key, [timeout, , , expirationCallback]]) => {
        const value = this._core.get(key);
        if (!value) throw new Error('Inconsistent state occured during clear');
        if (
          triggerExpirationCallback &&
          typeof expirationCallback === 'function'
        )
          expirationCallback(key, value);

        if (triggerOnExpire && typeof this.onExpire === 'function')
          this.onExpire(key, value);

        clearTimeout(timeout);
      }
    );
    this._core.clear();
    this._timers.clear();
  }

  /**
   * Returns `true` if the element in the `Map` object existed and has been removed,
   * or `false` if the element does not exist. `has` will return `false` afterwards.
   * @param key the key to remove
   */
  public delete(key: Key): boolean {
    const timer = this._timers.get(key);

    if (timer) {
      const [handler] = timer;
      clearTimeout(handler as NodeJS.Timeout);
      this._timers.delete(key);
    }

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
    callback: (
      value: Value,
      key: Key,
      timedMap: Es6TimedMap<Key, Value>
    ) => void,
    thisArg?: Es6TimedMap<Key, Value>
  ): void {
    return this._core.forEach((value, key) =>
      callback(value, key, thisArg || this)
    );
  }

  /**
   * Returns the value at the given key, if there is one
   * @param key the key to get
   */
  public get(key: Key): Value | undefined {
    return this._core.get(key);
  }
  /**
   * Returns a boolean asserting whether a value has been associated
   * to the `key` in the `Map` object or not.
   */
  public has(key: Key): boolean {
    return this._core.has(key);
  }
  /**
   * Returns a new `Iterator` object that containers **an array of [key, value]**
   * for each element in the `Map` object in insertion order.
   *
   */
  public entries(): IterableIterator<[Key, Value]> {
    return this._core.entries();
  }
  /**
   * Returns a new `Iterator` object that contains the **keys** for each element
   * in the `Map` object in insertion order
   */
  public keys(): IterableIterator<Key> {
    return this._core.keys();
  }
  /**
   * Returns a new `Iterator` object that contains **values** for each element in the `Map` object in
   * insertion order.
   */
  public values(): IterableIterator<Value> {
    return this._core.values();
  }

  /**
   * Event handler triggered whenever an item from the map is expired
   */
  public onExpire: ((key: Key, value: Value) => void) | null = null;

  /**
   * Resets a timer or updates its expiration time
   * @param newtime time to set the timer to
   */
  public touch(key: Key, newtime?: number): boolean {
    const timer = this._timers.get(key);
    const value = this._core.get(key);
    if (!(timer && value)) {
      return false;
    }
    const expirationTime = newtime || timer[2];
    clearInterval(timer[0] as NodeJS.Timeout);
    this.delete(key);
    this.set(key, value, expirationTime, timer[3]);
    return true;
  }

  /**
   * Gets the remaining time for an entry given a key.
   * This is just an estimation - the environment ultimately determines when the removal is executed.
   *
   * @param key the key of an entry in the map
   *
   * @returns The amount of milliseconds left before the entry is ejected, or `undefined` if the key or timer does not exist
   */
  public getTimeLeft(key: Key): number | undefined {
    const timer = this._timers.get(key);
    if (!timer) {
      return undefined;
    }

    const expectedExpirationTime = timer[1] + timer[2];
    return expectedExpirationTime - Date.now();
  }

  public [Symbol.iterator](): IterableIterator<[Key, Value]> {
    return this._core[Symbol.iterator]();
  }

  /**
   * Gets a list of remaining timers.
   *
   * @param order sort key to determine order of timers.  Defaults to insertion order.
   *
   * @returns A list of remaining timers sorted using order
   */

  public timers(
    order?: 'insertion' | 'expiration' | number
  ): IterableIterator<[Key, Timeout<Key, Value>]> {
    if (order === 'expiration' || order === 1) {
      const timers = new Map(
        [...this._timers.entries()].sort((a, b) => a[1][2] - b[1][2])
      );
      return timers.entries();
    }
    return this._timers.entries();
  }
  // TODO: Add time specific methods
  // - touch - update an existing timer with the given time
}

module.exports = Es6TimedMap;
