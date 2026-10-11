// Downloads a Project Gutenberg plain-text book ONCE, one at a time, and saves it into public/texts so the site hosts it itself.
import fs from 'node:fs';import path from 'node:path';
const MIRROR=process.env.PG_MIRROR||'https://www.gutenberg.org',dir=path.resolve('public/texts'),sleep=ms=>new Promise(r=>setTimeout(r,ms));let q=Promise.resolve();
export const getBook=id=>{id=String(id);if(!/^\d+$/.test(id))return Promise.resolve(null);const f=path.join(dir,id+'.txt');if(fs.existsSync(f))return Promise.resolve(f);
 const job=q.then(async()=>{if(fs.existsSync(f))return f;for(const u of [`${MIRROR}/cache/epub/${id}/pg${id}.txt`,`${MIRROR}/ebooks/${id}.txt.utf-8`]){try{const r=await fetch(u,{headers:{'User-Agent':'Vaelore/1.0 (personal reading app; one download per book)'}});if(r.ok){const t=await r.text();if(t.length>2000){fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(f,t);await sleep(2000);return f}}}catch{}await sleep(1000)}return null});q=job.catch(()=>{});return job};
