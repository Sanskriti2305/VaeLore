import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';import fs from 'node:fs';import {getBook} from './scripts/pg.mjs';
// Dev server: the first time you open a book, it is downloaded once from Project Gutenberg and saved into public/texts (hosted inside your site from then on).
const books={name:'vaelore-books',configureServer(s){s.middlewares.use(async(req,res,next)=>{const m=/^\/texts\/(\d+)\.txt/.exec(req.url||'')||/^\/api\/book\?id=(\d+)/.exec(req.url||'');if(!m)return next();const f=await getBook(m[1]);if(!f){res.statusCode=404;return res.end('not found')}res.setHeader('Content-Type','text/plain; charset=utf-8');res.end(fs.readFileSync(f))})}};
export default defineConfig({plugins:[react(),books]});
