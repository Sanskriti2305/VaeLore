// One-time build script. Run locally: node scripts/build-catalog.mjs
// Uses the Gutendex API (Project Gutenberg catalog API); nothing is fetched from Gutenberg at runtime.
import fs from 'node:fs';
const MIRROR = process.env.PG_MIRROR || 'https://www.gutenberg.org'; // prefer an official mirror: gutenberg.org/help/mirroring.html
const sleep = ms => new Promise(r => setTimeout(r, ms));
let url = 'https://gutendex.com/books?languages=en&copyright=false&sort=popular', out = [];
while (url && out.length < 600) {
  const j = await (await fetch(url)).json();
  for (const b of j.results) {
    if (!b.authors.length || b.authors.some(a => a.death_year == null || a.death_year > 1965)) continue;
    const s = (b.subjects || []).join(' ').toLowerCase();
    const g = ['fantasy','mystery','romance','science fiction','horror','philosophy','poetry','adventure','history'].filter(k => s.includes(k));
    out.push({ id: b.id, t: b.title, a: b.authors[0].name.split(', ').reverse().join(' '), g: g.length ? g : ['classics'] });
  }
  url = j.next; await sleep(1000);
}
out = out.slice(0, 600);
fs.writeFileSync('public/data/catalog.json', JSON.stringify(out));
for (const b of out.slice(0, 40)) { // slow, one at a time
  const f = `public/texts/${b.id}.txt`; if (fs.existsSync(f)) continue; // resumable
  const r = await fetch(`${MIRROR}/cache/epub/${b.id}/pg${b.id}.txt`);
  if (r.ok) fs.writeFileSync(`public/texts/${b.id}.txt`, await r.text());
  console.log(b.id, r.status); await sleep(5000);
}
