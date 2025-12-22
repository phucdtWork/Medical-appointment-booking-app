import { EventEmitter } from "events";

// Simple singleton event bus for server-side events (SSE)
const eventBus = new EventEmitter();

export default eventBus;
