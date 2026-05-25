import Es6TimedMap from '../src';

describe('Es6TimedMap', () => {
  let timedMap: Es6TimedMap<string, string>;
  beforeEach(() => {
    timedMap = new Es6TimedMap();
  });
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('can be created', () => expect(new Es6TimedMap()).toBeTruthy());

  describe('constructor', () => {
    it('passed with empty array adds nothing', () => {
      timedMap = new Es6TimedMap([]);
      expect(timedMap.size).toEqual(0);
    });
    it('passed non-array throws error', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => new Es6TimedMap({} as any)).toThrow();
    });
    it('passed with elements', () => {
      timedMap = new Es6TimedMap<string, string>([['key', 'my value', 100]]);
      expect(timedMap.size).toEqual(1);
    });
  });

  describe('delete', () => {
    it('exists', () => {
      expect(timedMap.delete).toBeTruthy();
      expect(typeof timedMap.delete === 'function').toBeTruthy();
    });
    it('returns true if item existed and has been removed', () => {
      jest.useFakeTimers();
      timedMap.set('first', 'first-value', 1000);
      expect(timedMap.get('first')).toEqual('first-value');
      timedMap.delete('first');
      expect(timedMap.get('first')).toBeFalsy();
    });
    it('returns false if the element does not exist', () => {
      expect(timedMap.delete('nonexistant')).toBeFalsy();
    });
    it('returns false if the element expired', () => {
      jest.useFakeTimers();
      timedMap.set('first', 'first-value', 50);
      jest.advanceTimersByTime(50);
      expect(timedMap.delete('first')).toBeFalsy();
    });
  });

  describe('size', () => {
    it('defaults to 0', () => expect(timedMap.size).toEqual(0));
    it('returns size', () => {
      jest.useFakeTimers();
      timedMap
        .set('first', 'first-value', 100)
        .set('second', 'second-value', 300)
        .set('third', 'third-value', 200);
      jest.advanceTimersByTime(50);
      expect(timedMap.size).toEqual(3);
    });
    it('returns number, after a few expires', () => {
      jest.useFakeTimers();
      timedMap
        .set('first', 'first-value', 100)
        .set('second', 'second-value', 300)
        .set('third', 'third-value', 200);
      jest.advanceTimersByTime(100);
      expect(timedMap.size).toEqual(2);
    });
    it('returns 0 after all expire', () => {
      jest.useFakeTimers();
      timedMap
        .set('first', 'first-value', 100)
        .set('second', 'second-value', 300)
        .set('third', 'third-value', 200);
      jest.advanceTimersByTime(2000);
      expect(timedMap.size).toEqual(0);
    });
  });

  describe('clear', () => {
    it('exists', () => {
      expect(timedMap.clear).toBeTruthy();
      expect(typeof timedMap.clear === 'function').toBeTruthy();
    });
    it('removes all existing entries', () => {
      timedMap.set('first', 'first-value', 1000);
      timedMap.set('two', 'two-value', 1000);
      timedMap.clear();
      expect(timedMap.get('first')).toEqual(undefined);
      expect(timedMap.get('two')).toEqual(undefined);
    });
    it('triggers expirationCallback', () => {
      const expirationCallback = jest.fn();
      timedMap.set('first', 'first-value', 1500, expirationCallback);
      timedMap.clear({
        triggerExpirationCallback: true
      });
      expect(expirationCallback).toHaveBeenCalledTimes(1);
    });
    it('triggers onExpire callback', () => {
      const onExpire = jest.fn();
      timedMap.onExpire = onExpire;

      timedMap.set('first', 'first-value', 1500);
      timedMap.clear({
        triggerOnExpire: true
      });
      timedMap.clear({
        triggerOnExpire: false
      });
      expect(onExpire).toHaveBeenCalledTimes(1);
    });
    it('clears timeout correctly', () => {
      jest.useFakeTimers();
      const expireCallback = jest.fn();
      timedMap.set('first', 'first-value', 1000, expireCallback);
      timedMap.clear();
      expect(timedMap.get('first')).toEqual(undefined);
      jest.advanceTimersByTime(1000);
      expect(expireCallback).not.toHaveBeenCalled();
    });
    it('does not throw when value is a falsy empty string', () => {
      const falsyMap = new Es6TimedMap<string, string>();
      falsyMap.set('key', '', 1000);
      expect(() =>
        falsyMap.clear({ triggerExpirationCallback: true })
      ).not.toThrow();
    });
    it('does not throw when value is a falsy zero', () => {
      const falsyMap = new Es6TimedMap<string, number>();
      falsyMap.set('key', 0, 1000);
      expect(() =>
        falsyMap.clear({ triggerExpirationCallback: true })
      ).not.toThrow();
    });
    it('does not throw when value is a falsy false', () => {
      const falsyMap = new Es6TimedMap<string, boolean>();
      falsyMap.set('key', false, 1000);
      expect(() =>
        falsyMap.clear({ triggerExpirationCallback: true })
      ).not.toThrow();
    });
  });

  describe('get', () => {
    it('exists', () => {
      expect(timedMap.get).toBeTruthy();
      expect(typeof timedMap.get === 'function').toBeTruthy();
    });
    it('returns item', () => {
      timedMap.set('first', 'first-value', 1000);
      expect(timedMap.get('first')).toEqual('first-value');
    });
    it('does not return item', () => {
      expect(timedMap.get('first')).toBeFalsy();
    });
    it('does not return item if past expiration time', () => {
      jest.useFakeTimers();
      timedMap.set('first', 'first-value', 100);
      jest.advanceTimersByTime(100);
      expect(timedMap.get('first')).toBeFalsy();
    });
    it('works with symbols as a key', () => {
      const symTimedMap = new Es6TimedMap<symbol, string>();
      const symKey = Symbol('first');
      symTimedMap.set(symKey, 'first-value', 1000);
      expect(symTimedMap.get(symKey)).toEqual('first-value');
    });
    it('works with objects as a key', () => {
      const objTimedMap = new Es6TimedMap<{ [key: string]: string }, string>();
      const objKey = { thisKey: 'first-key' };
      objTimedMap.set(objKey, 'first-value', 1000);
      expect(objTimedMap.get(objKey)).toEqual('first-value');
    });
  });

  describe('getTimeLeft', () => {
    let nativeDateNow: () => number;

    beforeEach(() => {
      nativeDateNow = Date.now;
      Date.now = jest.fn(() => 0);
    });

    afterEach(() => {
      Date.now = nativeDateNow;
    });

    it('returns undefined if timer does not exist', () => {
      const timeLeft = timedMap.getTimeLeft('fake-key');
      expect(timeLeft).toBeUndefined();
    });

    it('returns the correct time left for a valid key', () => {
      timedMap.set('first-key', 'first-value', 2000);

      Date.now = jest.fn(() => 1000);

      let timeLeft = timedMap.getTimeLeft('first-key');
      expect(timeLeft).toEqual(1000);

      Date.now = jest.fn(() => 1500);

      timeLeft = timedMap.getTimeLeft('first-key');
      expect(timeLeft).toEqual(500);
    });
  });

  describe('has', () => {
    it('exists', () => {
      expect(timedMap.has).toBeTruthy();
      expect(typeof timedMap.has === 'function').toBeTruthy();
    });
    it('returns true', () => {
      timedMap.set('first', 'first-value', 1000);
      expect(timedMap.has('first')).toEqual(true);
    });
    it('returns false', () => {
      expect(timedMap.has('other')).toEqual(false);
    });
    it('returns false if past expiration time', () => {
      timedMap.set('first', 'first-value', 1000);
      jest.advanceTimersByTime(1001);
      expect(timedMap.has('first')).toEqual(false);
    });
    it('works with symbols as a key', () => {
      const symTimedMap = new Es6TimedMap<symbol, string>();
      const symKey = Symbol('first');
      symTimedMap.set(symKey, 'first-value', 1000);
      expect(symTimedMap.has(symKey)).toEqual(true);
    });
    it('works with objects as a key', () => {
      const objTimedMap = new Es6TimedMap<{ [key: string]: string }, string>();
      const objKey = { thisKey: 'first-key' };
      objTimedMap.set(objKey, 'first-value', 1000);
      expect(objTimedMap.has(objKey)).toEqual(true);
    });
  });

  describe('set', () => {
    it('exists', () => {
      expect(timedMap.set).toBeTruthy();
      expect(typeof timedMap.has === 'function').toBeTruthy();
    });
    it('returns map object, to support chaining', () => {
      expect(timedMap.set('first-key', 'first-value', 100)).toEqual(timedMap);
    });
    it('works with symbols as a key', () => {
      const symbolTimedMap = new Es6TimedMap<symbol, string>();
      const mySymbol = Symbol('mine');
      symbolTimedMap.set(mySymbol, 'symbol-value', 100);
      expect(symbolTimedMap.has(mySymbol)).toBeTruthy();
      jest.advanceTimersByTime(500);
      expect(symbolTimedMap.has(mySymbol)).toBeFalsy();
    });
    it('works with objects as a key', () => {
      const objTimedMap = new Es6TimedMap<Record<string, unknown>, string>();
      const myObj = {};
      objTimedMap.set(myObj, 'first-value', 500);
      expect(objTimedMap.get(myObj)).toEqual('first-value');
      jest.advanceTimersByTime(500);
      expect(objTimedMap.get(myObj)).toBeFalsy();
    });
    it('works with single setParam', () => {
      expect(
        timedMap.set({
          key: 'first-key',
          value: 'first-value',
          expirationTime: 100
        })
      ).toEqual(timedMap);
    });
    it('throws error if expirationTime is not a number', () => {
      expect(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timedMap.set('first-key', 'value', 'not a number' as any)
      ).toThrow();
    });
    it('throws error if expirationTime is less than 0', () => {
      expect(() => timedMap.set('first-key', 'value', -1)).toThrow();
    });
    it('throws error if expirationCallback is given but not a function', () => {
      expect(() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timedMap.set('first-key', 'value', 100, 'not a function' as any)
      ).toThrow();
    });
  });

  // iteration methods
  describe('keys', () => {
    it('exists', () => {
      expect(timedMap.keys).toBeTruthy();
      expect(typeof timedMap.keys === 'function').toBeTruthy();
    });
    it('returns an iterator function', () => {
      expect(typeof timedMap.keys()[Symbol.iterator]).toEqual('function');
    });
    it('returns keys in insertion order', () => {
      timedMap
        .set('first-key', 'some-value', 1000)
        .set('second-key', 'some-value', 500);

      expect(Array.from(timedMap.keys())).toEqual(['first-key', 'second-key']);
    });
    it('returns empty array when nothing is added yet', () => {
      expect(Array.from(timedMap.keys())).toEqual([]);
    });
  });

  describe('values', () => {
    it('exists', () => {
      expect(timedMap.values).toBeTruthy();
      expect(typeof timedMap.values === 'function').toBeTruthy();
    });
    it('returns an iterator function', () => {
      expect(typeof timedMap.values()[Symbol.iterator]).toEqual('function');
    });
    it('returns keys in insertion order', () => {
      timedMap
        .set('first-key', 'some-value', 1000)
        .set('second-key', 'some-value', 500);

      expect(Array.from(timedMap.values())).toEqual([
        'some-value',
        'some-value'
      ]);
    });
    it('returns empty array when nothing is added yet', () => {
      expect(Array.from(timedMap.values())).toEqual([]);
    });
  });

  describe('entries', () => {
    it('exists', () => {
      expect(timedMap.entries).toBeTruthy();
      expect(typeof timedMap.entries === 'function').toBeTruthy();
    });
    it('returns an iterator function', () => {
      expect(typeof timedMap.entries()[Symbol.iterator]).toEqual('function');
    });
    it('returns keys in insertion order', () => {
      timedMap
        .set('first-key', 'some-value', 1000)
        .set('second-key', 'some-value', 500);

      expect(Array.from(timedMap.entries())).toEqual([
        ['first-key', 'some-value'],
        ['second-key', 'some-value']
      ]);
    });
    it('returns empty array when nothing is added yet', () => {
      expect(Array.from(timedMap.entries())).toEqual([]);
    });
  });

  describe('forEach', () => {
    it('exists', () => {
      expect(timedMap.forEach).toBeTruthy();
      expect(typeof timedMap.forEach === 'function').toBeTruthy();
    });
    it('applies this', () => {
      timedMap
        .set('first', 'first-value', 100)
        .set('second', 'second-value', 300)
        .set('third', 'third-value', 200);

      timedMap.forEach((value, key, self) => {
        // only check for this reference
        expect(self === timedMap).toEqual(true);
      }, timedMap);
    });
    it('can be used to iterate', () => {
      timedMap
        .set('first', 'first-value', 100)
        .set('second', 'second-value', 300)
        .set('third', 'third-value', 200);
      const results: Array<{
        key: string;
        value: string;
      }> = [];
      timedMap.forEach((value, key) => results.push({ key, value }));
      expect(results).toEqual([
        {
          key: 'first',
          value: 'first-value'
        },
        {
          key: 'second',
          value: 'second-value'
        },
        {
          key: 'third',
          value: 'third-value'
        }
      ]);
    });
  });

  describe('supports iteration', () => {
    it('exists', () => {
      expect(timedMap[Symbol.iterator]).toBeTruthy();
      expect(typeof timedMap[Symbol.iterator]).toBe('function');
    });
    it('can be used to iterate', () => {
      timedMap.set('foo', 'bar', 1000);
      for (const [key, value] of timedMap) {
        expect(key).toBe('foo');
        expect(value).toBe('bar');
      }
    });
  });

  // "time" based functions
  describe('timers', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      timedMap.set('first', 'first-value', 1000);
      timedMap.set('second', 'second-value', 50);
      timedMap.set('third', 'third-value', 200);
    });
    it('exists', () => {
      expect(timedMap.timers).toBeTruthy();
      expect(typeof timedMap.timers === 'function').toBeTruthy();
    });
    it('returns timers in insertion order', () => {
      const timers = timedMap.timers();
      expect(timers.next().value[0]).toEqual('first');
      expect(timers.next().value[0]).toEqual('second');
      expect(timers.next().value[0]).toEqual('third');
    });
    it('returns timers in expiration order with arguments', () => {
      const timers1 = timedMap.timers('expiration');
      expect(timers1.next().value[0]).toEqual('second');
      expect(timers1.next().value[0]).toEqual('third');
      expect(timers1.next().value[0]).toEqual('first');
      const timers2 = timedMap.timers(1);
      expect(timers2.next().value[0]).toEqual('second');
      expect(timers2.next().value[0]).toEqual('third');
      expect(timers2.next().value[0]).toEqual('first');
    });
  });

  describe('touch', () => {
    it('exists', () => {
      expect(timedMap.touch).toBeTruthy();
      expect(typeof timedMap.touch === 'function').toBeTruthy();
    });
    it('updates existing timers by the given amount', () => {
      jest.useFakeTimers();

      const onExpire = jest.fn();
      timedMap.set('foo', 'bar', 1000, onExpire);

      jest.advanceTimersByTime(500);
      timedMap.touch('foo', 2000);
      jest.advanceTimersByTime(1000);

      //If timedMap.touch failed, the callback would be triggered
      expect(onExpire).not.toHaveBeenCalled();

      jest.runAllTimers();
      expect(onExpire).toHaveBeenCalled();
    });
    it('reset existing timer', () => {
      jest.useFakeTimers();

      const onExpire = jest.fn();
      timedMap.set('foo', 'bar', 1000, onExpire);

      jest.advanceTimersByTime(500);
      timedMap.touch('foo');
      jest.advanceTimersByTime(500);
      expect(onExpire).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);
      expect(onExpire).toHaveBeenCalled();
    });
    it('fail to update missing key', () => {
      expect(timedMap.touch('foo')).toBeFalsy();
    });
    it('returns true and preserves a falsy empty-string value', () => {
      const falsyMap = new Es6TimedMap<string, string>();
      falsyMap.set('key', '', 1000);
      expect(falsyMap.touch('key')).toBe(true);
      expect(falsyMap.get('key')).toEqual('');
    });
    it('returns true and preserves a falsy zero value', () => {
      const falsyMap = new Es6TimedMap<string, number>();
      falsyMap.set('key', 0, 1000);
      expect(falsyMap.touch('key')).toBe(true);
      expect(falsyMap.get('key')).toEqual(0);
    });
    it('returns true and preserves a falsy false value', () => {
      const falsyMap = new Es6TimedMap<string, boolean>();
      falsyMap.set('key', false, 1000);
      expect(falsyMap.touch('key')).toBe(true);
      expect(falsyMap.get('key')).toEqual(false);
    });
  });

  describe('onExpire', () => {
    it('does not exist', () => {
      expect(timedMap.onExpire).toBeNull();
    });
    it('returns the item on expiration', () => {
      jest.useFakeTimers();
      timedMap.set('foo', 'bar', 1000);

      const onExpire = jest.fn();
      timedMap.onExpire = onExpire;

      jest.runAllTimers();

      expect(onExpire).toHaveBeenCalledWith(
        expect.stringMatching('foo'),
        expect.stringMatching('bar')
      );
    });
  });
});
