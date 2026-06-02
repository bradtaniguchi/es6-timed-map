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
 * Type that represents the set methods single argument option
 */
export type SetParams<Key, Value> = {
  key: Key;
  value: Value;
  expirationTime: number;
  expirationCallback?: ExpirationCallback<Key, Value>;
};

/**
 * Type-guard used in conjunection with other checks to verify
 * the given key is a SetParam.
 */
export const isSetParams = <Key, Value>(
  key: Key | SetParams<Key, Value>,
  value?: Value,
  expirationTime?: number,
  expirationCallback?: ExpirationCallback<Key, Value>
): key is SetParams<Key, Value> =>
  !!(
    key &&
    typeof key === 'object' &&
    value === undefined &&
    expirationTime === undefined &&
    expirationCallback === undefined
  );

/**
 * @name Es6TimedMap
 * An es6-map-like utility class with time based functions and support.
 *
 * Due to the similar surface area, use the Map doc reference from [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
 *
 * @example
 * ```ts
 * const map = new Es6TimedMap<string, number>();
 * map.set('score', 42, 5000); // expires in 5 seconds
 * console.log(map.get('score')); // 42
 * ```
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
   * @param _entries list of entries to pre-populate the timed-map with
   *
   * @example
   * ```ts
   * const map = new Es6TimedMap([
   *   ['key1', 'value1', 1000],
   *   ['key2', 'value2', 2000, (k, v) => console.log(`${k} expired`)]
   * ]);
   * ```
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
   * Returns the number of key/value pairs in the `TimedMap` object.
   *
   * @example
   * ```ts
   * const map = new Es6TimedMap<string, number>();
   * map.set('a', 1, 1000);
   * console.log(map.size); // 1
   * ```
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
   * @example
   * ```ts
   * const map = new Es6TimedMap<string, string>();
   * // Positional form:
   * map.set('hello', 'world', 3000, (k, v) => console.log(`${k} expired`));
   * // SetParams object form:
   * map.set({ key: 'foo', value: 'bar', expirationTime: 5000 });
   * // Chained:
   * map.set('a', '1', 1000).set('b', '2', 2000);
   * ```
   */
  public set(args: SetParams<Key, Value>): Es6TimedMap<Key, Value>;
  public set(
    key: Key,
    value: Value,
    expirationTime: number,
    expirationCallback?: ExpirationCallback<Key, Value>
  ): Es6TimedMap<Key, Value>;
  public set(
    key: Key | SetParams<Key, Value>,
    value?: Value,
    expirationTime?: number,
    expirationCallback?: ExpirationCallback<Key, Value>
  ): Es6TimedMap<Key, Value> {
    if (isSetParams(key, value, expirationTime, expirationCallback)) {
      // If the args are given like this, then we are within the "single argument"
      // call and thus need to expand.
      const params = key as SetParams<Key, Value>;
      key = params.key;
      value = params.value;
      expirationTime = params.expirationTime;
      expirationCallback = params.expirationCallback;
    }

    if (typeof expirationTime !== 'number')
      throw new Error('expirationTime is not a number');
    if (expirationTime < 0) throw new Error('expirationTime is less than 0');
    if (expirationCallback && typeof expirationCallback !== 'function')
      throw new Error('expirationCallback is not a function');
    this._core.set(key, value as Value);
    this._timers.set(key, [
      setTimeout(() => {
        if (typeof expirationCallback === 'function')
          expirationCallback(key as Key, value as Value);
        if (typeof this.onExpire === 'function')
          this.onExpire(key as Key, value as Value);
        this._core.delete(key as Key);
        this._timers.delete(key as Key);
      }, expirationTime),
      Date.now(),
      expirationTime,
      expirationCallback
    ]);
    return this;
  }

  /**
   * Removes all key-value pairs from the `TimedMap` object.
   * @param params param object, is optional
   * @param params.triggerExpirationCallback if we are to trigger the expiration callback
   *   for all timers.
   * @param params.triggerOnExpire if we are to trigger the general onExpire callback
   *
   * @example
   * ```ts
   * const map = new Es6TimedMap<string, number>();
   * map.set('a', 1, 1000);
   * // Clear without triggering callbacks:
   * map.clear();
   * // Clear and fire expiration callbacks for all remaining entries:
   * map.clear({ triggerExpirationCallback: true, triggerOnExpire: true });
   * ```
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
        // Use strict undefined check to support falsy values (0, '', false, null)
        if (value === undefined)
          throw new Error('Inconsistent state occurred during clear');
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
   *
   * @example
   * ```ts
   * const map = new Es6TimedMap<string, number>();
   * map.set('a', 1, 1000);
   * map.delete('a'); // true
   * map.delete('a'); // false
   * ```
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
   * Calls `callbackFn` once for each key-value pair present in the `Map` object,
   * in insertion order. If a `thisArg` parameter is provided to `forEach`, it will be used
   * as `this` value for each callback.
   * @param callback
   *
   * @example
   * ```ts
   * const map = new Es6TimedMap<string, number>();
   * map.set('a', 1, 1000).set('b', 2, 2000);
   * map.forEach((value, key) => console.log(key, value));
   * // a 1
   * // b 2
   * ```
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
   * Returns the value at the given key, if there is one.
   * @param key the key to get
   *
   * @example
   * ```ts
   * const map = new Es6TimedMap<string, number>();
   * map.set('score', 99, 5000);
   * map.get('score'); // 99
   * map.get('missing'); // undefined
   * ```
   */
  public get(key: Key): Value | undefined {
    return this._core.get(key);
  }

  /**
   * Returns a boolean asserting whether a value has been associated
   * to the `key` in the `Map` object or not.
   *
   * @example
   * ```ts
   * const map = new Es6TimedMap<string, number>();
   * map.set('a', 1, 1000);
   * map.has('a'); // true
   * map.has('b'); // false
   * ```
   */
  public has(key: Key): boolean {
    return this._core.has(key);
  }

  /**
   * Returns a new `Iterator` object that contains **an array of [key, value]**
   * for each element in the `Map` object in insertion order.
   *
   * @example
   * ```ts
   * const map = new Es6TimedMap<string, number>();
   * map.set('a', 1, 1000).set('b', 2, 2000);
   * for (const [key, value] of map.entries()) {
   *   console.log(key, value);
   * }
   * ```
   */
  public entries(): IterableIterator<[Key, Value]> {
    return this._core.entries();
  }

  /**
   * Returns a new `Iterator` object that contains the **keys** for each element
   * in the `Map` object in insertion order.
   *
   * @example
   * ```ts
   * const map = new Es6TimedMap<string, number>();
   * map.set('a', 1, 1000).set('b', 2, 2000);
   * console.log([...map.keys()]); // ['a', 'b']
   * ```
   */
  public keys(): IterableIterator<Key> {
    return this._core.keys();
  }

  /**
   * Returns a new `Iterator` object that contains **values** for each element in the `Map` object in
   * insertion order.
   *
   * @example
   * ```ts
   * const map = new Es6TimedMap<string, number>();
   * map.set('a', 1, 1000).set('b', 2, 2000);
   * console.log([...map.values()]); // [1, 2]
   * ```
   */
  public values(): IterableIterator<Value> {
    return this._core.values();
  }

  /**
   * Event handler triggered whenever an item from the map is expired.
   *
   * @example
   * ```ts
   * const map = new Es6TimedMap<string, number>();
   * map.onExpire = (key, value) => console.log(`${key} expired with value ${value}`);
   * map.set('x', 10, 500);
   * ```
   */
  public onExpire: ((key: Key, value: Value) => void) | null = null;

  /**
   * Resets a timer or updates its expiration time.
   * Returns `true` if the key existed and was updated, `false` if the key was not found.
   * @param key the key whose timer should be reset or updated
   * @param newtime optional new expiration time in milliseconds; reuses the original time if omitted
   *
   * @example
   * ```ts
   * const map = new Es6TimedMap<string, number>();
   * map.set('a', 1, 1000);
   * map.touch('a');        // reset TTL to original 1000ms
   * map.touch('a', 5000);  // extend TTL to 5000ms
   * map.touch('missing');  // false — key does not exist
   * ```
   */
  public touch(key: Key, newtime?: number): boolean {
    const timer = this._timers.get(key);
    const value = this._core.get(key);
    // Use strict undefined checks to support falsy values (0, '', false, null)
    if (!timer || value === undefined) {
      return false;
    }
    const expirationTime = newtime || timer[2];
    clearTimeout(timer[0] as NodeJS.Timeout);
    this._core.delete(key);
    this._timers.delete(key);
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
   *
   * @example
   * ```ts
   * const map = new Es6TimedMap<string, number>();
   * map.set('a', 1, 5000);
   * const left = map.getTimeLeft('a'); // ~5000ms (slightly less due to elapsed time)
   * map.getTimeLeft('missing');        // undefined
   * ```
   */
  public getTimeLeft(key: Key): number | undefined {
    const timer = this._timers.get(key);
    if (!timer) {
      return undefined;
    }

    const expectedExpirationTime = timer[1] + timer[2];
    return expectedExpirationTime - Date.now();
  }

  /**
   * Allows the map to be directly iterable with `for...of`.
   *
   * @example
   * ```ts
   * const map = new Es6TimedMap<string, number>();
   * map.set('a', 1, 1000).set('b', 2, 2000);
   * for (const [key, value] of map) {
   *   console.log(key, value);
   * }
   * ```
   */
  public [Symbol.iterator](): IterableIterator<[Key, Value]> {
    return this._core[Symbol.iterator]();
  }

  /**
   * Gets a list of remaining timers.
   *
   * @param order sort key to determine order of timers. Defaults to insertion order.
   *   Use `'expiration'` (or `1`) to sort by soonest absolute expiration time.
   *
   * @returns A list of remaining timers sorted using order
   *
   * @example
   * ```ts
   * const map = new Es6TimedMap<string, number>();
   * map.set('a', 1, 5000);
   * map.set('b', 2, 1000);
   * // In order of which expires soonest:
   * for (const [key] of map.timers('expiration')) {
   *   console.log(key); // 'b', then 'a'
   * }
   * ```
   */
  public timers(
    order?: 'insertion' | 'expiration' | number
  ): IterableIterator<[Key, Timeout<Key, Value>]> {
    if (order === 'expiration' || order === 1) {
      const timers = new Map(
        [...this._timers.entries()].sort(
          // Sort by absolute expiration timestamp (start + duration) so that
          // entries which will expire soonest appear first, regardless of their
          // original TTL duration.
          (a, b) => a[1][1] + a[1][2] - (b[1][1] + b[1][2])
        )
      );
      return timers.entries();
    }
    return this._timers.entries();
  }
}

module.exports = Es6TimedMap;
