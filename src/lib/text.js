export const reflow=t=>{const a=t.indexOf('*** START'),z=t.indexOf('*** END');if(a>=0)t=t.slice(t.indexOf('\n',a)+1,z>0?z:undefined);
 return t.split(/\r?\n\s*\r?\n/).map(p=>p.replace(/\s*\r?\n\s*/g,' ').trim()).filter(Boolean)};
export const paginate=ps=>{const pages=[];let cur=[],n=0;ps.forEach(p=>{cur.push(p);n+=p.length;if(n>=1800){pages.push(cur);cur=[];n=0}});if(cur.length)pages.push(cur);return pages};
export const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const COL=['#7d8f69','#b5654a','#c9962f','#6b86a3','#6e4a68'];
export const hash=id=>[...String(id)].reduce((a,c)=>a+c.charCodeAt(0),0);
export const spineColor=id=>COL[hash(id)%5];export const spineHeight=id=>120+(hash(id)*37%60);
