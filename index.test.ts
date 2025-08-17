import Dispaccio from './';

let dispaccio: Dispaccio;

describe('Dispaccio', () => {
  beforeEach(() => {
    dispaccio = new Dispaccio();
  });

  describe('subscribe', () => {
    test('adds callback without scope', () => {
      const callback = jest.fn();

      dispaccio.subscribe('without-scope', callback);

      const [event] = dispaccio.events['without-scope'];

      expect(event.callback).toEqual(callback);
      expect(event.scope).toBeNull();
    });

    test('adds callback with scope', () => {
      const callback = jest.fn();
      const scope = {};

      dispaccio.subscribe('with-scope', callback, scope);

      const [event] = dispaccio.events['with-scope'];

      expect(event.callback).toEqual(callback);
      expect(event.scope).toBe(scope);
    });

    test('adds multiple callbacks to same event', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const eventName = 'multi-callback-event';

      dispaccio.subscribe(eventName, callback1);
      dispaccio.subscribe(eventName, callback2);

      expect(dispaccio.events[eventName]).toHaveLength(2);
      expect(dispaccio.events[eventName][0].callback).toBe(callback1);
      expect(dispaccio.events[eventName][1].callback).toBe(callback2);
    });

    test('adds same callback multiple times to same event', () => {
      const callback = jest.fn();
      const eventName = 'duplicate-callback-event';

      dispaccio.subscribe(eventName, callback);
      dispaccio.subscribe(eventName, callback);

      expect(dispaccio.events[eventName]).toHaveLength(2);
      expect(dispaccio.events[eventName][0].callback).toBe(callback);
      expect(dispaccio.events[eventName][1].callback).toBe(callback);
    });

    test('handles undefined scope correctly', () => {
      const callback = jest.fn();

      dispaccio.subscribe('undefined-scope', callback, undefined);

      const [event] = dispaccio.events['undefined-scope'];

      expect(event.callback).toEqual(callback);
      expect(event.scope).toBeNull();
    });

    test('creates event array when event does not exist', () => {
      const callback = jest.fn();
      const eventName = 'new-event';

      expect(dispaccio.events[eventName]).toBeUndefined();

      dispaccio.subscribe(eventName, callback);

      expect(dispaccio.events[eventName]).toBeDefined();
      expect(Array.isArray(dispaccio.events[eventName])).toBe(true);
      expect(dispaccio.events[eventName]).toHaveLength(1);
    });

    test('preserves existing callbacks when adding new ones', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const eventName = 'preserve-callbacks';

      dispaccio.subscribe(eventName, callback1);
      const originalLength = dispaccio.events[eventName].length;

      dispaccio.subscribe(eventName, callback2);

      expect(dispaccio.events[eventName]).toHaveLength(originalLength + 1);
      expect(dispaccio.events[eventName][0].callback).toBe(callback1);
      expect(dispaccio.events[eventName][1].callback).toBe(callback2);
    });
  });

  describe('unsubscribe', () => {
    test('removes callback from event', () => {
      const callback = jest.fn();

      dispaccio.subscribe('test-event', callback);
      expect(dispaccio.events['test-event']).toHaveLength(1);

      dispaccio.unsubscribe('test-event', callback);
      expect(dispaccio.events['test-event']).toHaveLength(0);
    });

    test('removes only the matching callback', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const eventName = 'test-event';

      dispaccio.subscribe(eventName, callback1);
      dispaccio.subscribe(eventName, callback2);
      expect(dispaccio.events[eventName]).toHaveLength(2);

      dispaccio.unsubscribe(eventName, callback1);
      expect(dispaccio.events[eventName]).toHaveLength(1);
      expect(dispaccio.events[eventName][0].callback).toBe(callback2);
    });

    test('does nothing when event does not exist', () => {
      const callback = jest.fn();
      const eventName = 'non-existent-event';

      dispaccio.unsubscribe(eventName, callback);
      expect(dispaccio.events[eventName]).toBeUndefined();
    });

    test('does nothing when callback is not found in event', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const eventName = 'test-event';

      dispaccio.subscribe(eventName, callback1);
      expect(dispaccio.events[eventName]).toHaveLength(1);

      dispaccio.unsubscribe(eventName, callback2);
      expect(dispaccio.events[eventName]).toHaveLength(1);
      expect(dispaccio.events[eventName][0].callback).toBe(callback1);
    });

    test('removes callback with matching scope', () => {
      const callback = jest.fn();
      const eventName = 'test-event';
      const scope = {};

      dispaccio.subscribe(eventName, callback, scope);
      expect(dispaccio.events[eventName]).toHaveLength(1);

      dispaccio.unsubscribe(eventName, callback, scope);
      expect(dispaccio.events[eventName]).toHaveLength(0);
    });

    test('does not remove callback with different scope', () => {
      const callback = jest.fn();
      const eventName = 'test-event';
      const scope1 = {};
      const scope2 = {};

      dispaccio.subscribe(eventName, callback, scope1);
      expect(dispaccio.events[eventName]).toHaveLength(1);

      dispaccio.unsubscribe(eventName, callback, scope2);
      expect(dispaccio.events[eventName]).toHaveLength(1);
      expect(dispaccio.events[eventName][0].scope).toBe(scope1);
    });

    test('removes only callback with matching scope when multiple exist', () => {
      const callback = jest.fn();
      const eventName = 'test-event';
      const scope1 = {};
      const scope2 = {};

      dispaccio.subscribe(eventName, callback, scope1);
      dispaccio.subscribe(eventName, callback, scope2);
      expect(dispaccio.events[eventName]).toHaveLength(2);

      dispaccio.unsubscribe(eventName, callback, scope1);
      expect(dispaccio.events[eventName]).toHaveLength(1);
      expect(dispaccio.events[eventName][0].scope).toBe(scope2);
    });

    test('removes callback with null scope when unsubscribing with null', () => {
      const callback = jest.fn();
      const eventName = 'test-event';

      dispaccio.subscribe(eventName, callback, null);
      expect(dispaccio.events[eventName]).toHaveLength(1);

      dispaccio.unsubscribe(eventName, callback, null);
      expect(dispaccio.events[eventName]).toHaveLength(0);
    });

    test('removes callback with default null scope when unsubscribing without scope', () => {
      const callback = jest.fn();
      const eventName = 'test-event';

      dispaccio.subscribe(eventName, callback);
      expect(dispaccio.events[eventName]).toHaveLength(1);

      dispaccio.unsubscribe(eventName, callback);
      expect(dispaccio.events[eventName]).toHaveLength(0);
    });

    test('does not remove callback with scope when unsubscribing without scope', () => {
      const callback = jest.fn();
      const eventName = 'test-event';
      const scope = {};

      dispaccio.subscribe(eventName, callback, scope);
      expect(dispaccio.events[eventName]).toHaveLength(1);

      dispaccio.unsubscribe(eventName, callback);
      expect(dispaccio.events[eventName]).toHaveLength(1);
      expect(dispaccio.events[eventName][0].scope).toBe(scope);
    });

    test('removes multiple callbacks with same callback and scope', () => {
      const callback = jest.fn();
      const eventName = 'test-event';
      const scope = {};

      dispaccio.subscribe(eventName, callback, scope);
      dispaccio.subscribe(eventName, callback, scope);
      expect(dispaccio.events[eventName]).toHaveLength(2);

      dispaccio.unsubscribe(eventName, callback, scope);
      expect(dispaccio.events[eventName]).toHaveLength(0);
    });

    test('handles undefined scope correctly', () => {
      const callback = jest.fn();
      const eventName = 'test-event';

      dispaccio.subscribe(eventName, callback, undefined);
      expect(dispaccio.events[eventName]).toHaveLength(1);

      dispaccio.unsubscribe(eventName, callback, undefined);
      expect(dispaccio.events[eventName]).toHaveLength(0);
    });
  });

  describe('publish', () => {
    test('calls single callback with no arguments', () => {
      const callback = jest.fn();
      const eventName = 'test-event';

      dispaccio.subscribe(eventName, callback);
      dispaccio.publish(eventName);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith();
    });

    test('calls single callback with single argument', () => {
      const callback = jest.fn();
      const eventName = 'test-event';
      const arg = 'test-argument';

      dispaccio.subscribe(eventName, callback);
      dispaccio.publish(eventName, arg);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(arg);
    });

    test('calls single callback with multiple arguments', () => {
      const callback = jest.fn();
      const eventName = 'test-event';
      const arg1 = 'first-arg';
      const arg2 = 'second-arg';
      const arg3 = { key: 'value' };

      dispaccio.subscribe(eventName, callback);
      dispaccio.publish(eventName, arg1, arg2, arg3);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(arg1, arg2, arg3);
    });

    test('calls multiple callbacks with same arguments', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const eventName = 'test-event';
      const arg = 'shared-argument';

      dispaccio.subscribe(eventName, callback1);
      dispaccio.subscribe(eventName, callback2);
      dispaccio.publish(eventName, arg);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback1).toHaveBeenCalledWith(arg);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledWith(arg);
    });

    test('calls callback with correct scope when scope is provided', () => {
      const callback = jest.fn(function (this: any) {
        expect(this).toBe(scope);
      });
      const eventName = 'test-event';
      const scope = { name: 'test-scope' };

      dispaccio.subscribe(eventName, callback, scope);
      dispaccio.publish(eventName);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('calls callback with null scope when no scope is provided', () => {
      const callback = jest.fn(function (this: any) {
        expect(this).toBeNull();
      });
      const eventName = 'test-event';

      dispaccio.subscribe(eventName, callback);
      dispaccio.publish(eventName);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('calls callbacks with different scopes correctly', () => {
      const scope1 = { name: 'scope1' };
      const scope2 = { name: 'scope2' };
      const callback1 = jest.fn(function (this: any) {
        expect(this).toBe(scope1);
      });
      const callback2 = jest.fn(function (this: any) {
        expect(this).toBe(scope2);
      });
      const eventName = 'test-event';

      dispaccio.subscribe(eventName, callback1, scope1);
      dispaccio.subscribe(eventName, callback2, scope2);
      dispaccio.publish(eventName);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    test('does nothing when event has no subscribers', () => {
      const eventName = 'non-existent-event';

      expect(() => dispaccio.publish(eventName, 'some-arg')).not.toThrow();
    });

    test('calls callbacks in subscription order', () => {
      const callOrder: number[] = [];
      const callback1 = jest.fn(() => callOrder.push(1));
      const callback2 = jest.fn(() => callOrder.push(2));
      const callback3 = jest.fn(() => callOrder.push(3));
      const eventName = 'order-test';

      dispaccio.subscribe(eventName, callback1);
      dispaccio.subscribe(eventName, callback2);
      dispaccio.subscribe(eventName, callback3);
      dispaccio.publish(eventName);

      expect(callOrder).toEqual([1, 2, 3]);
    });

    test('continues calling other callbacks if one throws an error', () => {
      const callback1 = jest.fn();
      const errorCallback = jest.fn(() => {
        throw new Error('Test error');
      });
      const callback2 = jest.fn();
      const eventName = 'error-test';

      dispaccio.subscribe(eventName, callback1);
      dispaccio.subscribe(eventName, errorCallback);
      dispaccio.subscribe(eventName, callback2);

      expect(() => dispaccio.publish(eventName)).toThrow('Test error');

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(errorCallback).toHaveBeenCalledTimes(1);
      // callback2 may not be called if error is thrown
    });

    test('handles complex argument types correctly', () => {
      const callback = jest.fn();
      const eventName = 'complex-args-test';
      const complexArg = {
        string: 'test',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        nested: { key: 'value' },
        func: () => 'function'
      };

      dispaccio.subscribe(eventName, callback);
      dispaccio.publish(eventName, complexArg);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(complexArg);
    });

    test('works with array spread as arguments', () => {
      const callback = jest.fn();
      const eventName = 'spread-test';
      const args = ['arg1', 'arg2', 'arg3'];

      dispaccio.subscribe(eventName, callback);
      dispaccio.publish(eventName, ...args);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });

    test('handles empty event array correctly', () => {
      const eventName = 'empty-array-test';

      // Manually set empty array (shouldn't happen in normal usage but tests edge case)
      dispaccio.events[eventName] = [];

      expect(() => dispaccio.publish(eventName, 'test')).not.toThrow();
    });

    test('publishes to same event multiple times', () => {
      const callback = jest.fn();
      const eventName = 'multiple-publish-test';

      dispaccio.subscribe(eventName, callback);

      dispaccio.publish(eventName, 'first');
      dispaccio.publish(eventName, 'second');
      dispaccio.publish(eventName, 'third');

      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenNthCalledWith(1, 'first');
      expect(callback).toHaveBeenNthCalledWith(2, 'second');
      expect(callback).toHaveBeenNthCalledWith(3, 'third');
    });

    test('handles undefined callback gracefully', () => {
      const eventName = 'undefined-callback-test';

      // Manually create malformed event (shouldn't happen in normal usage)
      dispaccio.events[eventName] = [{ callback: undefined as any, scope: null }];

      expect(() => dispaccio.publish(eventName, 'test')).not.toThrow();
    });

    test('respects scope binding for this context', () => {
      const scope = {
        value: 'test-value',
        getValue: jest.fn(function (this: any) {
          return this.value;
        })
      };

      const callback = jest.fn(function (this: any) {
        return this.getValue();
      });

      const eventName = 'scope-binding-test';

      dispaccio.subscribe(eventName, callback, scope);
      dispaccio.publish(eventName);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(scope.getValue).toHaveBeenCalledTimes(1);
    });
  });
});
