import { FuncSpreadable } from 'monadical';
import isEmpty from 'monadical/isEmpty';
import nonEmptyArray from 'monadical/nonEmptyArray';
import noop from 'monadical/noop';

type EventScope = object | null | undefined;

interface ScopedCallback {
  callback: FuncSpreadable;
  scope: EventScope;
}

interface EventCollection {
  [event: string]: ScopedCallback[];
}

class Dispaccio {
  events!: EventCollection;

  constructor() {
    this.events = {};
  }

  async subscribe(event: string, callback: FuncSpreadable, scope: EventScope = null): Promise<void> {
    if (isEmpty(this.events[event])) {
      this.events[event] = [];
    }

    this.events[event] = [...this.events[event], { callback, scope: scope }];
  }

  async unsubscribe(event: string, callback: FuncSpreadable, scope: EventScope = null): Promise<void> {
    const arr = this.events[event];
    if (nonEmptyArray(arr)) {
      this.events[event] = [...arr.filter(({ callback: cb, scope: sp }) => cb !== callback || scope !== sp)];
    }
  }

  async publish(event: string, ...args: any[]): Promise<void> {
    const arr = this.events[event];
    nonEmptyArray(arr) && arr.forEach(({ scope, callback = noop }) => callback.apply(scope, args));
  }
}

export default Dispaccio;
