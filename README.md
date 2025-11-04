<p align="center">
  <img src="https://github.com/agreco/dispaccio/blob/master/logo/logo.png" alt="Dispaccio - Probably the only event dispatcher you'll ever need." width="200" height="200">
</p>

# Dispaccio
_Probably the only event dispatcher you'll ever need._

The purpose of this library is to provide a simple event dispatcher that can be used in any js environment.

## Installation

To install the latest stable version, run either of the following via a terminal:

```shell script
npm install dispaccio
```

or

```shell script
yarn add dispaccio
```

## Usage

Using the library should be straightforward, all that is required is to import the `Dispaccio` class and create an
instance. 

```typescript
import { Dispaccio } from 'dispaccio';

const dispaccio = new Dispaccio();
```
Once the instance is created, you can subscribe, unsubscribe and publish events. Each instance
will maintain its own set of subscribers, so you can have multiple instances of `Dispaccio` if you need to.

### Subscribing to events

To listen to an event, use the `subscribe` method. When an event is dispatched, all subscribers will be notified.
To dispatch an event, use the `publish` method.

```typescript
await dispaccio.subscribe('event-name', ({ data }) => {
  /* do something with data */
});

await dispaccio.subscribe('event-name', ({ data }) => {
  /* do something else with data */
});

await dispaccio.publish('event-name', { data: 'some data' });
```
Arguments passed to the `publish` method will be passed to the callback.

```typescript
await dispaccio.subscribe('event-name', ({ data }, str, num) => {
  /* do something with data, str and num */
});

await dispaccio.publish('event-name', { data: 'some data' }, 'a string', 123);
```

You can also pass a scope to the `subscribe` method, which will be used as the scope to the callback when it is called.

```typescript
const scope1 = { name: 'scope1' };
const scope2 = { name: 'scope2' };

const callback1 = function (data) {
  // will log 'scope1'
  console.log(this.name);
};

const callback2 = function (data) {
  // will log 'scope2'
  console.log(this.name);
};

await dispaccio.subscribe('event-name', callback1, scope1);
await dispaccio.subscribe('event-name', callback2, scope2);

await dispaccio.publish('event-name');
```

**_Note_**: Scopes will only be available to methods, not arrow functions. Arrow functions won't bind to `this`, 
`arguments`, or `super`, hence they should not be used to bind to a scope. See
[this reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) for more
information.

### Unsubscribing from events

To unsubscribe from an event, use the `unsubscribe` method. The `unsubscribe` method takes the same arguments as the
`subscribe` method, and will remove the callback from the set of subscribers. 

```typescript
const callback1 = () => {};
const callback2 = function () {};
const scope = {};

await dispaccio.subscribe('test-event', callback1);
await dispaccio.subscribe('test-event', callback2, scope);
await dispaccio.publish('event-name');
// callback1 and callback2 will be called

await dispaccio.unsubscribe('test-event', callback2, scope);
await dispaccio.publish('event-name');
// callback1 will called but not callback2
```
Make sure to use the same callback when unsubscribing, otherwise the callback will not be removed. The scope will also 
need to be the same if you used one.

## Accessing events
Each instance of `Dispaccio` will maintain a set of events, which you can access by using the `events` property. 

```typescript
const callback1 = () => {};
const callback2 = function () {};
const scope = {};

await dispaccio.subscribe('test-event', callback1);
await dispaccio.subscribe('test-event', callback2, scope);

console.log(dispaccio.events['test-event'].length); // 2;
```
The `events` property is an object mapping each event to a list of callbacks and their scopes, which can be used to
iterate over the events if you needed. 

## Logo

You can find the official logo [on GitHub](https://github.com/agreco/dispaccio/tree/master/logo).

## Change Log

This project adheres to [Semantic Versioning](https://semver.org/).
Every release, along with the migration instructions, is documented on the GitHub [Releases](https://github.com/agreco/dispaccio/releases) page.

## License

[MIT](LICENSE.md)
