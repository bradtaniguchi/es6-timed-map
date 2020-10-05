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
    test.todo('returns true if item existed and has been removed');
    test.todo('returns false if the element does not exist');
    test.todo('returns false if the element expired');
    test.todo('returns false if the element expired');
    // TODO:
  });
  describe.only('size', () => {
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
    test.todo('exists');
    test.todo('returns map object');
    test.todo('removes all existing entries');
    // TODO:
  });
  describe('get', () => {
    test.todo('exists');
    test.todo('returns item');
    test.todo('does not return item');
    test.todo('does not return item if past expiration time');
    test.todo('works with symbols as a key');
    test.todo('works with objects as a key');
    // TODO:
  });
  describe('has', () => {
    test.todo('exists');
    test.todo('returns true');
    test.todo('returns false');
    test.todo('returns false if past expiration time');
    test.todo('works with symbols as a key');
    test.todo('works with objects as a key');
  });
  describe('set', () => {
    test.todo('exists');
    test.todo('returns map object');
    test.todo('works with symbols as a key');
    test.todo('works with objects as a key');
    // TODO:
  });
  // iteration methods
  describe('keys', () => {
    test.todo('exists');
    test.todo('returns keys in insertion order');
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
    test.todo('exists');
    test.todo('applies this');
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
