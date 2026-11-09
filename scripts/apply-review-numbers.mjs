// Writes the Google rating numbers typed into the "Update reviews" GitHub form
// into src/data/reviews.json. Used by .github/workflows/update-reviews.yml.
//
// Reads env vars: RATING, COUNT, FIVE, FOUR, THREE, TWO, ONE.
// Local test:  RATING=4.9 COUNT=121 FIVE=116 FOUR=4 THREE=0 TWO=0 ONE=1 node scripts/apply-review-numbers.mjs

import fs from 'node:fs/promises';
import path from 'node:path';

const FILE = path.resolve('src/data/reviews.json');
const errors = [];

const int = (name) => {
  const raw = String(process.env[name] ?? '').trim().replace(/,/g, '');
  if (!/^\d+$/.test(raw)) {
    errors.push(`${name.toLowerCase()} must be a whole number (got "${process.env[name] ?? ''}")`);
    return 0;
  }
  return Number(raw);
};

const ratingRaw = String(process.env.RATING ?? '').trim().replace(',', '.');
const rating = Number(ratingRaw);
if (!/^\d(\.\d)?$/.test(ratingRaw) || rating < 1 || rating > 5) {
  errors.push(`rating must look like 4.9, between 1.0 and 5.0 (got "${process.env.RATING ?? ''}")`);
}

const count = int('COUNT');
const breakdown = { five: int('FIVE'), four: int('FOUR'), three: int('THREE'), two: int('TWO'), one: int('ONE') };
const sum = Object.values(breakdown).reduce((a, b) => a + b, 0);

if (!errors.length) {
  if (sum !== count) errors.push(`the star counts add up to ${sum}, but the total is ${count}. Please re-check both.`);
  const avg = (breakdown.five * 5 + breakdown.four * 4 + breakdown.three * 3 + breakdown.two * 2 + breakdown.one) / (sum || 1);
  if (Math.abs(avg - rating) > 0.15) {
    errors.push(`the star counts give an average of ${avg.toFixed(2)}, which doesn't match the rating ${rating}. Please re-check.`);
  }
}

const data = JSON.parse(await fs.readFile(FILE, 'utf8'));
if (!errors.length && count < data.count - 20) {
  errors.push(`total dropped from ${data.count} to ${count}. If that's really right, change it in reviews.json by hand.`);
}

if (errors.length) {
  console.error('✗ Nothing was changed:\n  - ' + errors.join('\n  - '));
  process.exit(1);
}

const same =
  data.rating === rating && data.count === count && JSON.stringify(data.breakdown) === JSON.stringify(breakdown);
if (same) {
  console.log(`✓ Numbers are already up to date (${count} reviews, ${rating}★). Nothing to change.`);
  process.exit(0);
}

const before = `${data.count} reviews, ${data.rating}★`;
data.rating = rating;
data.count = count;
data.breakdown = breakdown;
data.updatedAt = new Date().toISOString().slice(0, 10);
await fs.writeFile(FILE, JSON.stringify(data, null, 2) + '\n');
console.log(`✓ Updated: ${before} → ${count} reviews, ${rating}★`);
