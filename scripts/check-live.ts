/* Daily liveness check.

   Deliberately forgiving. A failed request does not mark a product as down: it
   leaves the previous record untouched, so a timeout, a cold start or a runner
   with flaky DNS never puts a red mark on his profile. A product only leaves
   the panel by going unseen for STALE_AFTER_DAYS, which is a real outage rather
   than a bad minute.

   Writes data/status.json. The build reads it; it never performs requests. */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SITES, type Status } from '../src/data/sites.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(ROOT, 'data', 'status.json');
const TIMEOUT_MS = 15_000;
const ATTEMPTS = 2;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function load(): Status {
  try {
    return JSON.parse(readFileSync(FILE, 'utf8')) as Status;
  } catch {
    return { checkedAt: today(), sites: {} };
  }
}

async function reachable(url: string): Promise<boolean> {
  for (let i = 0; i < ATTEMPTS; i += 1) {
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { 'user-agent': 'helmy162-profile-readme/1.0 (+https://github.com/helmy162)' },
      });
      // Anything the origin answers counts as serving. A 403 from a bot filter
      // still means the box is up, which is what the panel claims.
      if (res.status < 500) return true;
    } catch {
      /* fall through to the next attempt */
    }
  }
  return false;
}

async function main(): Promise<void> {
  const status = load();
  const now = today();
  const results = await Promise.all(
    SITES.map(async (site) => ({ site, ok: await reachable(site.url) })),
  );

  for (const { site, ok } of results) {
    if (ok) status.sites[site.host] = { lastSeen: now };
    const seen = status.sites[site.host]?.lastSeen ?? 'never';
    console.log(`  ${ok ? 'live' : 'no answer'.padEnd(4)}  ${site.host.padEnd(26)} last seen ${seen}`);
  }
  status.checkedAt = now;

  mkdirSync(dirname(FILE), { recursive: true });
  writeFileSync(FILE, `${JSON.stringify(status, null, 2)}\n`);
  console.log(`\nwrote ${FILE}`);
}

await main();
