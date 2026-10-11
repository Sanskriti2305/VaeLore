import {useState} from 'react';
const GEN=['fantasy','mystery','romance','science fiction','horror','classics','philosophy','poetry','adventure','history'];
export default function Onboarding({catalog,onDone,toast}){
 const [on,setOn]=useState([]),[read,setRead]=useState([]),[mode,setMode]=useState('read'),[q,setQ]=useState(''),[res,setRes]=useState([]);
 const run=async v=>{let r=[];try{const j=await (await fetch('https://openlibrary.org/search.json?limit=5&fields=key,title,author_name,cover_i&q='+encodeURIComponent(v))).json();
  r=j.docs.map(d=>({id:d.key.replace(/\W/g,''),t:d.title,a:d.author_name?.[0],cover:d.cover_i}))}catch{toast('Open Library unreachable — using the local catalog')}
  if(!r.length)r=catalog.filter(b=>(b.t+b.a).toLowerCase().includes(v.toLowerCase()));setRes(r)};
 const mic=()=>{const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R)return toast('Speech recognition not supported in this browser');
  const r=new R();r.onresult=e=>{const t=e.results[0][0].transcript;setQ(t);run(t)};r.start()};
 const btn='bg-walnut text-cream rounded-lg px-3 py-2';
 return(<div className="fixed inset-0 z-10 bg-black/80 grid place-items-center overflow-auto"><div className="bg-cream rounded-xl p-6 max-w-xl w-[92%]">
 <h2 className="font-display text-xl">What do you love to read?</h2>
 <div>{GEN.map(g=><button key={g} onClick={()=>setOn(o=>o.includes(g)?o.filter(x=>x!==g):[...o,g])} className={`m-1 rounded-lg px-3 py-2 ${on.includes(g)?'bg-gold':'bg-[#c9b88f]'}`}>{g}</button>)}</div>
 <p className="mt-3">Add books (up to 8):</p><div className="mb-2"><button onClick={()=>setMode('read')} className={`rounded px-3 py-1 mr-2 ${mode==='read'?'bg-gold':'bg-[#c9b88f]'}`}>Already read</button><button onClick={()=>setMode('want')} className={`rounded px-3 py-1 ${mode==='want'?'bg-gold':'bg-[#c9b88f]'}`}>Want to read</button></div>
 <button className={btn} onClick={mic}>🎤 Speak a title</button> <input value={q} onChange={e=>setQ(e.target.value)} onBlur={()=>q&&run(q)} placeholder="or type" className="border rounded px-2 py-1"/>
 {res.map(b=><button key={b.id} className="block text-left py-1" onClick={()=>read.length<8&&setRead([...read,{...b,w:mode==='want'}])}>{b.t} — {b.a}</button>)}
 <p className="text-sm my-2">{read.map(b=>(b.w?'📖 ':'✔ ')+b.t).join(', ')}</p><button className={btn} onClick={()=>onDone(on,read)}>Build my shelf</button></div></div>)}
