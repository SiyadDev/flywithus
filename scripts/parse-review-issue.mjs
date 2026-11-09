// Reads an "Update Google reviews" issue-form submission (from the GitHub event
// payload) and writes RATING/COUNT/FIVE…ONE into $GITHUB_ENV for
// apply-review-numbers.mjs. Anything that isn't a plain number is passed on
// empty, so the apply step rejects it with a readable message.

import fs from 'node:fs';

const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const body = event.issue?.body ?? '';

// Issue forms render as "### <label>\n\n<value>" blocks.
const fields = {};
for (const block of body.split(/^###\s+/m).slice(1)) {
  const [label, ...rest] = block.split('\n');
  fields[label.trim()] = rest.join('\n').trim();
}

const map = {
  RATING: 'Google rating',
  COUNT: 'Total number of reviews',
  FIVE: '5★ reviews',
  FOUR: '4★ reviews',
  THREE: '3★ reviews',
  TWO: '2★ reviews',
  ONE: '1★ reviews',
};

const lines = [];
for (const [env, label] of Object.entries(map)) {
  const raw = (fields[label] ?? '').replace(/^_No response_$/, '').trim();
  const safe = /^[0-9][0-9.,]{0,9}$/.test(raw) ? raw : '';
  lines.push(`${env}=${safe}`);
  if (!safe) console.log(`"${label}" is empty or not a number`);
}
fs.appendFileSync(process.env.GITHUB_ENV, lines.join('\n') + '\n');
console.log(lines.join('  '));
