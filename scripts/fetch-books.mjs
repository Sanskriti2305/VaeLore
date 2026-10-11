import fs from 'node:fs';import {getBook} from './pg.mjs';
const cat=JSON.parse(fs.readFileSync('public/data/catalog.json','utf8'));
for(const b of cat.slice(0,40)){const f=await getBook(b.id);console.log(String(b.id).padEnd(6),b.t,f?'✓':'FAILED')}
