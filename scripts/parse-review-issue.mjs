// Reads an "Update Google reviews" issue-form submission (from the GitHub event
// payload) and writes RATING/COUNT/FIVE…ONE into $GITHUB_ENV for
// apply-review-numbers.mjs.
//
// - An empty box means "keep the website's current number" (taken from reviews.json).
// - Anything typed is passed on as a single trimmed line (max 20 chars), so the apply
//   step can reject non-numbers with a readable message. Newlines are never passed,
//   which keeps $GITHUB_ENV safe.

import fs from 'node:fs';

const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const body = event.issue?.body ?? '';
const current = JSON.parse(fs.readFileSync('src/data/reviews.json', 'utf8'));

// Issue forms render as "### <label>\n\n<value>" blocks.
const fields = {};
for (const block of body.split(/^###\s+/m).slice(1)) {
  const [label, ...rest] = block.split('\n');
  fields[label.trim()] = rest.join('\n').trim();
}

const map = [
  ['RATING', 'Google rating', current.rating],
  ['COUNT', 'Total number of reviews', current.count],
  ['FIVE', '5★ reviews', current.breakdown.five],
  ['FOUR', '4★ reviews', current.breakdown.four],
  ['THREE', '3★ reviews', current.breakdown.three],
  ['TWO', '2★ reviews', current.breakdown.two],
  ['ONE', '1★ reviews', current.breakdown.one],
];

const lines = [];
for (const [env, label, fallback] of map) {
  const raw = (fields[label] ?? '').replace(/^_No response_$/, '').trim();
  const value = raw === '' ? String(fallback) : raw.split(/\r?\n/)[0].replace(/[^\x20-\x7E★]/g, '').slice(0, 20);
  lines.push(`${env}=${value}`);
  console.log(`${label}: ${raw === '' ? `(empty → keep ${fallback})` : value}`);
}
fs.appendFileSync(process.env.GITHUB_ENV, lines.join('\n') + '\n');
