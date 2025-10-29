import axios from "axios";

const api = axios.create({ baseURL: "/api", timeout: 5000 });

const QUEUE_KEY = "contact_queue_v1";
const METRICS_KEY = "contact_metrics_v1";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  budget?: string;
};
interface QueueItem {
  payload: ContactPayload;
  idempotencyKey: string;
  createdAt: number;
}

function readQueue(): Array<QueueItem> {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) as Array<QueueItem> : [];
  } catch (_e) {
    return [];
  }
}

function writeQueue(q: Array<QueueItem>) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
}

export function getQueueLength() {
  return readQueue().length;
}

export function enqueue(payload: ContactPayload, idempotencyKey: string) {
  const q = readQueue();
  q.push({ payload, idempotencyKey, createdAt: Date.now() });
  writeQueue(q);
}

function popOne(): QueueItem | null {
  const q = readQueue();
  if (q.length === 0) return null;
  const item = q.shift() as QueueItem;
  writeQueue(q);
  return item;
}

interface Metrics {
  ok: number;
  error: number;
  latencies: number[];
}

function readMetrics(): Metrics {
  try {
    const raw = localStorage.getItem(METRICS_KEY);
    return raw ? (JSON.parse(raw) as Metrics) : { ok: 0, error: 0, latencies: [] };
  } catch (_e) {
    return { ok: 0, error: 0, latencies: [] };
  }
}

function writeMetrics(m: Metrics) {
  localStorage.setItem(METRICS_KEY, JSON.stringify(m));
}

export function trackMetric({ ok, latency }: { ok: boolean; latency?: number }) {
  const m = readMetrics();
  if (ok) m.ok = (m.ok || 0) + 1;
  else m.error = (m.error || 0) + 1;
  if (typeof latency === "number") m.latencies.push(latency);
  writeMetrics(m);
}

export function getMetrics() {
  const m = readMetrics();
  const avgLatency = m.latencies.length ? m.latencies.reduce((a: number, b: number) => a + b, 0) / m.latencies.length : 0;
  return { ok: m.ok || 0, error: m.error || 0, avgLatency };
}

async function doPost(payload: ContactPayload, idempotencyKey: string) {
  const t0 = performance.now();
  const res = await api.post("/contact", payload, { headers: { "Idempotency-Key": idempotencyKey } });
  const t1 = performance.now();
  trackMetric({ ok: true, latency: t1 - t0 });
  return res.data;
}

export async function sendContact(payload: ContactPayload, idempotencyKey: string) {
  // If offline, enqueue and return a queued result
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    enqueue(payload, idempotencyKey);
    trackMetric({ ok: false });
    return { status: "queued", local: true };
  }

  const maxRetries = 2;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const t0 = performance.now();
      const res = await api.post("/contact", payload, { headers: { "Idempotency-Key": idempotencyKey }, timeout: 3000 });
      const t1 = performance.now();
      trackMetric({ ok: true, latency: t1 - t0 });
      return res.data;
    } catch (err: unknown) {
      attempt++;
      trackMetric({ ok: false });
      // If offline, enqueue and return queued result.
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        enqueue(payload, idempotencyKey);
        return { status: "queued", local: true };
      }

      if (attempt > maxRetries) {
        // Give up and enqueue for later retry
        enqueue(payload, idempotencyKey);
        return { status: "queued", local: true };
      }
      // simple linear backoff
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
}

export async function flushQueue() {
  // Try to send all queued items sequentially
  while (true) {
    const item = popOne();
    if (!item) break;
    try {
      await doPost(item.payload, item.idempotencyKey);
      // successful sends are tracked inside doPost
    } catch (err) {
      // If failed, re-enqueue and stop to avoid tight loops
      enqueue(item.payload, item.idempotencyKey);
      break;
    }
  }
}

export function initContactQueue() {
  // attempt flush on startup if online
  if (typeof window !== "undefined") {
    window.addEventListener("online", () => {
      flushQueue().catch((e) => console.error("flushQueue error", e));
    });
  }
}

export default { sendContact, enqueue, getQueueLength, getMetrics, initContactQueue };
