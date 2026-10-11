// Vercel serverless function: GET /api/book?id=1342  -> plain text of that Project Gutenberg book (fetched once, then cached by the host's CDN)
const M=process.env.PG_MIRROR||'https://www.gutenberg.org';
export default async function handler(req,res){
  const id=String(req.query?.id||'');
  if(!/^\d{1,7}$/.test(id))return res.status(400).send('bad id');
  for(const u of [`${M}/cache/epub/${id}/pg${id}.txt`,`${M}/ebooks/${id}.txt.utf-8`]){
    try{const r=await fetch(u,{headers:{'User-Agent':'Vaelore/1.0 (reading app; responses are cached)'}});
      if(r.ok){const t=await r.text();if(t.length>2000){res.setHeader('Content-Type','text/plain; charset=utf-8');res.setHeader('Cache-Control','public, max-age=3600, s-maxage=31536000, stale-while-revalidate=86400');return res.status(200).send(t)}}}catch{}
  }
  res.status(404).send('not found');
}
