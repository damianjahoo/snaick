/**
 * Polyfills for missing Web APIs in serverless environments
 * Import this file early to ensure APIs are available before React SSR
 */

// MessageChannel polyfill for React 19 SSR compatibility
import "./message-channel";

// Export for explicit importing if needed
export { MessageChannel, MessagePort, MessageEvent } from "./message-channel";
