/**
 * MessageChannel polyfill for Cloudflare Workers
 * This provides the MessageChannel API that React 19 SSR requires
 */

interface MessageEventInit extends EventInit {
  data?: unknown;
  origin?: string;
  lastEventId?: string;
  source?: MessageEventSource | null;
  ports?: MessagePort[];
}

class MessageEvent extends Event {
  readonly data: unknown;
  readonly origin: string;
  readonly lastEventId: string;
  readonly source: MessageEventSource | null;
  readonly ports: readonly MessagePort[];

  constructor(type: string, eventInitDict: MessageEventInit = {}) {
    super(type, eventInitDict);
    this.data = eventInitDict.data;
    this.origin = eventInitDict.origin || "";
    this.lastEventId = eventInitDict.lastEventId || "";
    this.source = eventInitDict.source || null;
    this.ports = Object.freeze(eventInitDict.ports || []);
  }
}

class MessagePort extends EventTarget {
  private _closed = false;
  private _entangledPort: MessagePort | null = null;

  postMessage(message: unknown): void {
    if (this._closed) return;

    // Simulate asynchronous message delivery
    setTimeout(() => {
      if (this._entangledPort && !this._entangledPort._closed) {
        const event = new MessageEvent("message", { data: message });
        this._entangledPort.dispatchEvent(event);
      }
    }, 0);
  }

  start(): void {
    // In this polyfill, ports are always started
  }

  close(): void {
    this._closed = true;
    if (this._entangledPort) {
      this._entangledPort._closed = true;
    }
  }

  _entangle(port: MessagePort): void {
    this._entangledPort = port;
    port._entangledPort = this;
  }
}

class MessageChannel {
  readonly port1: MessagePort;
  readonly port2: MessagePort;

  constructor() {
    this.port1 = new MessagePort();
    this.port2 = new MessagePort();

    // Entangle the ports so they can communicate with each other
    this.port1._entangle(this.port2);
  }
}

// Install the polyfill if MessageChannel is not available
if (typeof globalThis !== "undefined" && !globalThis.MessageChannel) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).MessageChannel = MessageChannel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).MessagePort = MessagePort;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).MessageEvent = MessageEvent;
}

// Also install for other global contexts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const global: any;
if (typeof global !== "undefined" && !global.MessageChannel) {
  global.MessageChannel = MessageChannel;
  global.MessagePort = MessagePort;
  global.MessageEvent = MessageEvent;
}

// For Node.js environment compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const self: any;
if (typeof self !== "undefined" && !self.MessageChannel) {
  self.MessageChannel = MessageChannel;
  self.MessagePort = MessagePort;
  self.MessageEvent = MessageEvent;
}

export { MessageChannel, MessagePort, MessageEvent };
