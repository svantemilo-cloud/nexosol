const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 40;

type Bucket = { n: number; t: number };
const buckets = new Map<string, Bucket>();

function prune(now: number) {
  if (buckets.size <= 2000) return;
  buckets.forEach((v, k) => {
    if (now - v.t > WINDOW_MS) buckets.delete(k);
  });
}

/** Simple in-memory limiter (per server instance). Not a hard guarantee under scale-out. */
export function allowSubmissionFromClient(key: string): boolean {
  const now = Date.now();
  prune(now);
  const e = buckets.get(key);
  if (!e || now - e.t > WINDOW_MS) {
    buckets.set(key, { n: 1, t: now });
    return true;
  }
  if (e.n >= MAX_PER_WINDOW) return false;
  e.n += 1;
  return true;
}
