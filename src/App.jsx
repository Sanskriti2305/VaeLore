import {useEffect,useState} from 'react';import {supabase,configured} from './lib/supabase';import Shelf from './components/Shelf';import Onboarding from './components/Onboarding';import Reader from './components/Reader';import Finder from './components/Finder';import Room from './components/Room3D';
const LABELS=[['to','To Read'],['reading','Reading'],['read','Read']];
const hint=m=>/anonymous/i.test(m)?'Anonymous sign-ins are turned off. In Supabase: Authentication → Sign In / Providers → turn on "Allow anonymous sign-ins".':
 /relation|does not exist|schema cache|column/i.test(m)?'The database tables are missing or outdated. In Supabase: SQL Editor → paste supabase/schema.sql → Run.':
 /fetch|network/i.test(m)?'Cannot reach Supabase. Check the Project URL in .env, your internet, and restart npm run dev.':'';
export default function App(){
 const [cat,setCat]=useState([]),[uid,setUid]=useState(null),[S,setS]=useState({status:{},extra:{},progress:{},bookmarks:{},interests:[],onboarded:false,is_public:false}),
  [ready,setReady]=useState(false),[onb,setOnb]=useState(false),[find,setFind]=useState(false),[open,setOpen]=useState(null),[msg,setMsg]=useState(''),[shared,setShared]=useState(null),[mode,setMode]=useState('room'),[err,setErr]=useState('');
 const toast=m=>{setMsg(m);setTimeout(()=>setMsg(''),4000)};const sid=new URLSearchParams(location.search).get('s');
 useEffect(()=>{(async()=>{try{
  setCat(await (await fetch('/data/catalog.json')).json());
  if(!configured)throw new Error('NOENV');
  if(sid){const {data,error}=await supabase.from('shelves').select('status,extra').eq('user_id',sid).eq('is_public',true).maybeSingle();if(error)throw error;setShared(data||{status:{},extra:{}})}
  else{let {data:{session}}=await supabase.auth.getSession();if(!session){const r=await supabase.auth.signInAnonymously();if(r.error)throw r.error;session=r.data.session}
   setUid(session.user.id);const {data,error}=await supabase.from('shelves').select('*').eq('user_id',session.user.id).maybeSingle();if(error)throw error;
   if(data)setS(s=>({...s,...data}));setOnb(!data?.onboarded)}
 }catch(e){setErr(e.message||String(e))}setReady(true)})()},[]);
 const save=async n=>{setS(n);if(uid){const {error}=await supabase.from('shelves').upsert({...n,user_id:uid,updated_at:new Date().toISOString()});if(error)toast(error.message+' '+hint(error.message))}};
 const done=(interests,read)=>{const status={},extra={};read.forEach(b=>{status[b.id]=b.w?'to':'read';extra[b.id]=b});
  cat.filter(b=>!status[b.id]&&!S.status[b.id]).sort((a,b)=>b.g.filter(g=>interests.includes(g)).length-a.g.filter(g=>interests.includes(g)).length).slice(0,8).forEach(b=>status[b.id]='to');
  save({...S,status:{...S.status,...status},extra:{...S.extra,...extra},interests,onboarded:true});setOnb(false)};
 const view=shared||S,book=id=>(view.extra?.[id])||cat.find(b=>String(b.id)===String(id))||{id,t:'Book '+id};
 const openBook=b=>{if(shared)return window.open('https://www.gutenberg.org/ebooks/'+b.id);if(S.status[b.id]==='to')save({...S,status:{...S.status,[b.id]:'reading'}});setOpen(b)};
 const bm=id=>S.bookmarks?.[id]||[],toggleBm=(id,p)=>save({...S,bookmarks:{...S.bookmarks,[id]:bm(id).includes(p)?bm(id).filter(x=>x!==p):[...bm(id),p].sort((a,b)=>a-b)}});
 const share=async()=>{await save({...S,is_public:true});const u=location.origin+'/?s='+uid;navigator.clipboard?.writeText(u);toast('Link copied: '+u)};
 const keep=async()=>{const {error}=await supabase.auth.linkIdentity({provider:'google'});if(error)toast(error.message)};
 const nb='bg-walnut text-cream rounded-lg px-3 py-2';
 if(!ready)return <p className="p-8 font-display">Dusting the shelves…</p>;
 if(err)return(<div className="p-8 max-w-xl"><h1 className="font-display text-3xl text-walnut mb-3">Vaelore needs one more setup step</h1>
  <p className="mb-3">{err==='NOENV'?'Your .env file is missing or has placeholder values. Create a file named .env in the project folder with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (from Supabase → Project Settings → API), then stop and restart npm run dev.':err}</p>
  <p className="mb-3 font-semibold">{hint(err)}</p><button className={nb} onClick={()=>location.reload()}>Try again</button></div>);
 return(<div><header className={`${mode==='room'?'fixed top-0 inset-x-0 z-[5] pointer-events-none':''} flex flex-wrap justify-between items-center gap-2 px-7 py-4`}><h1 className="font-display text-4xl font-extrabold text-walnut">Vaelore</h1>
  {!shared&&<nav className="flex gap-2 flex-wrap pointer-events-auto"><button className={nb} onClick={()=>setFind(true)}>🔎 Find a book</button><button className={nb} onClick={share}>Share my shelf</button><button className={nb} onClick={keep}>Save My Shelf</button><button className={nb} onClick={()=>setOnb(true)}>My interests</button></nav>}</header>
  {mode==='room'?<Room onFail={()=>setMode('shelf')} paused={!!(onb||find||open)} onOpen={openBook} shelves={Object.fromEntries(LABELS.map(([k])=>[k,Object.keys(view.status).filter(i=>view.status[i]===k).map(book)]))}/>:LABELS.map(([k,l])=><Shelf key={k} label={l} onOpen={openBook} items={Object.keys(view.status).filter(i=>view.status[i]===k).map(book)}/>)}
  {onb&&!shared&&<Onboarding catalog={cat} onDone={done} toast={toast}/>}
  {find&&<Finder catalog={cat} status={S.status} toast={toast} onClose={()=>setFind(false)} onAdd={b=>save({...S,status:{...S.status,[b.id]:'to'}})}/>}
  {open&&<Reader book={open} progress={S.progress[open.id]} bookmarks={bm(open.id)} onBookmark={p=>toggleBm(open.id,p)} onProgress={p=>save({...S,progress:{...S.progress,[open.id]:p}})} onClose={()=>setOpen(null)}
   onFinish={()=>{save({...S,status:{...S.status,[open.id]:'read'}});setOpen(null)}}/>}
  {msg&&<div className="fixed bottom-3 left-1/2 -translate-x-1/2 bg-walnut text-cream px-4 py-2 rounded-lg z-20">{msg}</div>}</div>)}
