import Es6TimedMap from '../src';

describe('Es6TimedMap', () => {
  let timedMap: Es6TimedMap<string, string>;
  // TODO: add cross browser/environment checks/logging
  beforeEach(() => {
    timedMap = new Es6TimedMap();
  });

  test('can be created', () => expect(new Es6TimedMap()).toBeTruthy());

  // method/api tests for es6-map coverage
  describe('delete', () => {
    test('exists', () => {
      expect(timedMap.delete).toBeTruthy();
      expect(typeof timedMap.delete === 'function').toBeTruthy();
    });
    test('returns true if item existed and has been removed', () => {
      jest.useFakeTimers();
      timedMap.set('first', 'first-value', 1000);
      expect(timedMap.get('first')).toEqual('first-value');
      timedMap.delete('first');
      expect(timedMap.get('first')).toBeFalsy();
    });
    test('returns false if the element does not exist', () => {
      expect(timedMap.delete('nonexistant')).toBeFalsy();
    });
    test('returns false if the element expired', () => {
      jest.useFakeTimers();
      timedMap.set('first', 'first-value', 50);
      jest.advanceTimersByTime(50);
      expect(timedMap.delete('first')).toBeFalsy();
    });
    // TODO:
    test.todo('returns list of timers with deleted item timer omitted');
  });
  describe('size', () => {
    test('defaults to 0', () => expect(timedMap.size).toEqual(0));
    test('returns size', () => {
      jest.useFakeTimers();
      timedMap
        .set('first', 'first-value', 100)
        .set('second', 'second-value', 300)
        .set('third', 'third-value', 200);
      jest.advanceTimersByTime(50);
      expect(timedMap.size).toEqual(3);
    });
    test('returns number, after a few expires', () => {
      jest.useFakeTimers();
      timedMap
        .set('first', 'first-value', 100)
        .set('second', 'second-value', 300)
        .set('third', 'third-value', 200);
      jest.advanceTimersByTime(100);
      expect(timedMap.size).toEqual(2);
    });
    test('returns 0 after all expire', () => {
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
    test('exists', () => {
      expect(timedMap.clear).toBeTruthy();
      expect(typeof timedMap.clear === 'function').toBeTruthy();
    });
    test('removes all existing entries', () => {
      timedMap.set('first', 'first-value', 1000);
      timedMap.set('two', 'two-value', 1000);
      timedMap.clear();
      expect(timedMap.get('first')).toEqual(undefined);
      expect(timedMap.get('two')).toEqual(undefined);
    });
  });
  describe('get', () => {
    test('exists', () => {
      expect(timedMap.get).toBeTruthy();
      expect(typeof timedMap.get === 'function').toBeTruthy();
    });
    test('returns item', () => {
      timedMap.set('first', 'first-value', 1000);
      expect(timedMap.get('first')).toEqual('first-value');
    });
    test('does not return item', () => {
      expect(timedMap.get('first')).toBeFalsy();
    });
    test('does not return item if past expiration time', () => {
      jest.useFakeTimers();
      timedMap.set('first', 'first-value', 100);
      jest.advanceTimersByTime(100);
      expect(timedMap.get('first')).toBeFalsy();
    });
    test('works with symbols as a key', () => {
      const symTimedMap = new Es6TimedMap<symbol, string>();
      const symKey = Symbol('first');
      symTimedMap.set(symKey, 'first-value', 1000);
      expect(symTimedMap.get(symKey)).toEqual('first-value');
    });
    test('works with objects as a key', () => {
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

    test('returns undefined if timer does not exist', () => {
      const timeLeft = timedMap.getTimeLeft('fake-key');
      expect(timeLeft).toBeUndefined();
    });

    test('returns the correct time left for a valid key', () => {
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
    test('exists', () => {
      expect(timedMap.has).toBeTruthy();
      expect(typeof timedMap.has === 'function').toBeTruthy();
    });
    test('returns true', () => {
      timedMap.set('first', 'first-value', 1000);
      expect(timedMap.has('first')).toEqual(true);
    });
    test('returns false', () => {
      expect(timedMap.has('other')).toEqual(false);
    });
    test('returns false if past expiration time', () => {
      timedMap.set('first', 'first-value', 1000);
      jest.advanceTimersByTime(1001);
      expect(timedMap.has('first')).toEqual(false);
    });
    test('works with symbols as a key', () => {
      const symTimedMap = new Es6TimedMap<symbol, string>();
      const symKey = Symbol('first');
      symTimedMap.set(symKey, 'first-value', 1000);
      expect(symTimedMap.has(symKey)).toEqual(true);
    });
    test('works with objects as a key', () => {
      const objTimedMap = new Es6TimedMap<{ [key: string]: string }, string>();
      const objKey = { thisKey: 'first-key' };
      objTimedMap.set(objKey, 'first-value', 1000);
      expect(objTimedMap.has(objKey)).toEqual(true);
    });
  });
  describe('set', () => {
    test('exists', () => {
      expect(timedMap.set).toBeTruthy();
      expect(typeof timedMap.has === 'function').toBeTruthy();
    });
    test('returns map object, to support chaining', () => {
      expect(timedMap.set('first-key', 'first-value', 100)).toEqual(timedMap);
    });
    // **note** this isn't supported yet, as its too new with TS 4.2
    test('works with symbols as a key', () => {
      const symbolTimedMap = new Es6TimedMap<symbol, string>();
      const mySymbol = Symbol('mine');
      symbolTimedMap.set(mySymbol, 'symbol-value', 100);
      expect(symbolTimedMap.has(mySymbol)).toBeTruthy();
      jest.advanceTimersByTime(500);
      expect(symbolTimedMap.has(mySymbol)).toBeFalsy();
    });
    test('works with objects as a key', () => {
      const objTimedMap = new Es6TimedMap<Record<string, unknown>, string>();
      const myObj = {};
      objTimedMap.set(myObj, 'first-value', 500);
      expect(objTimedMap.get(myObj)).toEqual('first-value');
      jest.advanceTimersByTime(500);
      expect(objTimedMap.get(myObj)).toBeFalsy();
    });
  });
  // iteration methods
  describe('keys', () => {
    test('exists', () => {
      expect(timedMap.keys).toBeTruthy();
      expect(typeof timedMap.keys === 'function').toBeTruthy();
    });
    test('returns an iterator function', () => {
      expect(typeof timedMap.keys()[Symbol.iterator]).toEqual('function');
    });
    test('returns keys in insertion order', () => {
      timedMap
        .set('first-key', 'some-value', 1000)
        .set('second-key', 'some-value', 500);

      expect(Array.from(timedMap.keys())).toEqual(['first-key', 'second-key']);
    });
    test('returns empty array when nothing is added yet', () => {
      expect(Array.from(timedMap.keys())).toEqual([]);
    });
  });
  describe('values', () => {
    test.todo('exists');
    test.todo('returns values in insertion order');
  });
  describe('entries', () => {
    test.todo('exists');
    test.todo('returns entries in insertion order');
  });
  describe('forEach', () => {
    test('exists', () => {
      expect(timedMap.forEach).toBeTruthy();
      expect(typeof timedMap.forEach === 'function').toBeTruthy();
    });
    test('applies this', () => {
      timedMap
        .set('first', 'first-value', 100)
        .set('second', 'second-value', 300)
        .set('third', 'third-value', 200);
      // **note** I get a weird eslint issue warning here without disable
      // eslint-disable-next-line prettier/prettier
      timedMap.forEach((value, key, self) => {
        // only check for this reference
        expect(self === timedMap).toEqual(true);
      }, timedMap);
    });
    test('can be used to iterate', () => {
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
    test('exists', () => {
      expect(timedMap[Symbol.iterator]).toBeTruthy();
      expect(typeof timedMap[Symbol.iterator]).toBe('function');
    });
    test('can be used to iterate', () => {
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
    test('exists', () => {
      expect(timedMap.timers).toBeTruthy();
      expect(typeof timedMap.timers === 'function').toBeTruthy();
    });
    test('returns timers in insertion order', () => {
      const timers = timedMap.timers();
      expect(timers.next().value[0]).toEqual('first');
      expect(timers.next().value[0]).toEqual('second');
      expect(timers.next().value[0]).toEqual('third');
    });
    test('returns timers in expiration order with arguments', () => {
      const timers1 = timedMap.timers('expiration');
      expect(timers1.next().value[0]).toEqual('second');
      expect(timers1.next().value[0]).toEqual('third');
      expect(timers1.next().value[0]).toEqual('first');
      const timers2 = timedMap.timers(1);
      expect(timers2.next().value[0]).toEqual('second');
      expect(timers2.next().value[0]).toEqual('third');
      expect(timers2.next().value[0]).toEqual('first');
    });
    // TODO:
  });

  describe('touch', () => {
    test('exists', () => {
      expect(timedMap.touch).toBeTruthy();
      expect(typeof timedMap.touch === 'function').toBeTruthy();
    });
    test('updates existing timers by the given amount', () => {
      jest.useFakeTimers();

      const onExpire = jest.fn();
      timedMap.set('foo', 'bar', 1000, onExpire);

      jest.advanceTimersByTime(500);
      timedMap.touch('foo', 2000);
      jest.advanceTimersByTime(1000);

      //If timedMap.touch failed, the callback would be triggered
      expect(onExpire).not.toBeCalled();

      jest.runAllTimers();
      expect(onExpire).toBeCalled();
    });
    test('reset existing timer', () => {
      jest.useFakeTimers();

      const onExpire = jest.fn();
      timedMap.set('foo', 'bar', 1000, onExpire);

      jest.advanceTimersByTime(500);
      timedMap.touch('foo');
      jest.advanceTimersByTime(500);
      expect(onExpire).not.toBeCalled();

      jest.advanceTimersByTime(500);
      expect(onExpire).toBeCalled();
    });
    test('fail to update missing key', () => {
      expect(timedMap.touch('foo')).toBeFalsy();
    });
    // TODO:
  });
  describe('onExpire', () => {
    test('does not exist', () => {
      expect(timedMap.onExpire).toBeNull();
    });
    test('returns the item on expiration', () => {
      jest.useFakeTimers();
      timedMap.set('foo', 'bar', 1000);

      const onExpire = jest.fn();
      timedMap.onExpire = onExpire;

      jest.runAllTimers();

      expect(onExpire).toBeCalledWith(
        expect.stringMatching('foo'),
        expect.stringMatching('bar')
      );
    });
  });
});
