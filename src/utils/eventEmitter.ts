type Listener<T = unknown> = (data: T) => void;

interface Events {
  [eventName: string]: Listener[];
}

class EventEmitter {
  private events: Events = {};

  on<T>(eventName: string, listener: Listener<T>): () => void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener as Listener);
    // Return an unsubscribe function
    return () => this.off(eventName, listener);
  }

  off<T>(eventName: string, listener: Listener<T>): void {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName] = this.events[eventName].filter((l) => l !== listener);
  }

  emit<T>(eventName: string, data: T): void {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName].forEach((listener) => listener(data));
  }
}

// Export a singleton instance
export const globalEventEmitter = new EventEmitter();

// Define event payload structure and event name
export interface AddressModalPayload {
  onSuccess: () => void;
}
export const OPEN_ADDRESS_MODAL_EVENT = 'openAddressModalEvent';
