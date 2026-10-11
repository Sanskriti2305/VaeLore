import {useState} from 'react';
export default function Finder({catalog,status,onAdd,onClose,toast}){
 const [q,setQ]=useState('');const m=q.trim()?catalog.filter(b=>(b.t+' '+b.a+' '+b.g.join(' ')).toLowerCase().includes(q.toLowerCase())):catalog.slice(0,10);
 const mic=()=>{const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R)return toast('Speech recognition isn\'t supported in this browser — try Chrome or Edge');
  const r=new R();r.onresult=e=>setQ(e.results[0][0].transcript.replace(/[.]$/,''));r.start();toast('Listening…')};
 return(<div className="fixed inset-0 z-10 bg-black/80 grid place-items-center"><div className="bg-cream rounded-xl p-6 max-w-xl w-[92%] max-h-[85vh] overflow-auto">
  <h2 className="font-display text-xl mb-2">Find a book for your shelf</h2>
  <div className="flex gap-2 mb-3"><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Title, author or genre" className="flex-1 border rounded px-3 py-2"/><button onClick={mic} className="bg-walnut text-cream rounded px-3">🎤</button></div>
  {m.length===0&&<p>No match in the catalog.</p>}
  {m.map(b=><div key={b.id} className="flex justify-between items-center py-1 border-b border-[#c9b88f]"><span>{b.t}<br/><small>{b.a}</small></span>
   {status[b.id]?<small>on your shelf</small>:<button onClick={()=>{onAdd(b);toast('Added "'+b.t+'" to To Read')}} className="bg-gold rounded px-3 py-1">+ Add</button>}</div>)}
  <button onClick={onClose} className="mt-3 bg-walnut text-cream rounded px-4 py-2">Done</button></div></div>)}
