import Es6TimedMap from '../src/es6-timed-map';

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
      timedMap.set('foo', 'bar', 1000);
      expect(timedMap.delete('foo')).toBeTruthy();
    });
    test('returns false if the element does not exist', () => {
      expect(timedMap.delete('foo')).toBeFalsy();
    });
    test('returns false if the element expired', () => {
      jest.useFakeTimers();
      timedMap.set('foo', 'bar', 1000);
      jest.advanceTimersByTime(1000);
      expect(timedMap.delete('foo')).toBeFalsy();
    });
    // TODO:
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
      expect(typeof timedMap.clear == 'function').toBeTruthy();
    });
    test.todo('returns map object');
    test('removes all existing entries', () => {
      timedMap.set('foo', 'bar', 1000);
      timedMap.clear();
      expect(timedMap.size).toEqual(0);
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
    // TODO:
  });
  describe('has', () => {
    test('exists', () => {
      expect(timedMap.has).toBeTruthy();
      expect(typeof timedMap.has === 'function').toBeTruthy();
    });
    test('returns true', () => {
      timedMap.set('foo', 'bar', 1000);
      expect(timedMap.has('foo')).toBeTruthy();
    });
    test('returns false', () => {
      expect(timedMap.has('baz')).toBeFalsy();
    });
    test('returns false if past expiration time', () => {
      jest.useFakeTimers();
      timedMap.set('foo', 'bar', 1000);

      jest.advanceTimersByTime(1000);
      expect(timedMap.has('foo')).toBeFalsy();
    });
    test('works with symbols as a key', () => {
      const symTimedMap = new Es6TimedMap<symbol, string>();
      const symKey = Symbol('foo');

      symTimedMap.set(symKey, 'bar', 1000);
      expect(symTimedMap.has(symKey)).toBeTruthy();
    });
    test('works with objects as a key', () => {
      const objTimedMap = new Es6TimedMap<{ [key: string]: string }, string>();
      const objKey = { thisKey: 'first-key' };

      objTimedMap.set(objKey, 'bar', 1000);
      expect(objTimedMap.has(objKey)).toBeTruthy();
    });
  });
  describe('set', () => {
    test('exists', () => {
      expect(timedMap.set).toBeTruthy();
      expect(typeof timedMap.set === 'function').toBeTruthy();
    });
    test.todo('returns map object');
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
    // TODO:
  });
  // iteration methods
  describe('keys', () => {
    test('exists', () => {
      expect(timedMap.keys).toBeTruthy();
      expect(typeof timedMap.keys === 'function').toBeTruthy();
    });
    test.todo('returns keys in insertion order');
  });
  describe('values', () => {
    test('exists', () => {
      expect(timedMap.values).toBeTruthy();
      expect(typeof timedMap.values === 'function').toBeTruthy();
    });
    test.todo('returns values in insertion order');
  });
  describe('entries', () => {
    test('exists', () => {
      expect(timedMap.entries).toBeTruthy();
      expect(typeof timedMap.entries === 'function').toBeTruthy();
    });
    test.todo('returns entries in insertion order');
  });
  describe('forEach', () => {
    test('exists', () => {
      expect(timedMap.forEach).toBeTruthy();
      expect(typeof timedMap.forEach === 'function').toBeTruthy();
    });
    test('applies this', () => {
      const thatMap = new Es6TimedMap<string, string>();
      timedMap.set('foo', 'bar', 1000);
      timedMap.forEach((key, value, map) => {
        expect(map).toEqual(thatMap);
      }, thatMap);
    });
    test.todo('can be used to iterate');
  });
  describe('supports iteration', () => {
    test.todo('exists');
    test.todo('can be used to iterate');
  });

  // "time" based functions
  describe('timers', () => {
    test.todo('exists');
    test.todo('returns timers in insertion order');
    test.todo('returns timers in expiration order');
    test.todo('returns timers in expiration order');
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
