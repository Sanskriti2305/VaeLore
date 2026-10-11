import {useEffect,useRef,useState} from 'react';import {hash,spineColor} from '../lib/text';
const W=2800,H=720,FL=140,CW=560,PER=11,ROWS=4,SL=46;
const CASES=[['to','To Read',260],['reading','Reading',900],['read','Read',1540]];
const OBJ=[{id:'coffee',x:150,l:'☕ Sip coffee'},{id:'chair',x:2440,l:'📖 Sit & read'}];
const FR=[[40,170,100,130,'#6b86a3,#c9a24a'],[155,135,70,90,'#7d8f69,#e9d7b0'],[2330,130,150,110,'#b5654a,#c9962f'],[2520,190,80,110,'#6e4a68,#6b86a3']];
function Avatar(){return(<svg viewBox="0 0 70 130" width="70" height="130"><g className="bob">
 <g className="leg l"><rect x="22" y="86" width="11" height="36" rx="5" fill="#4a3a4a"/><ellipse cx="27" cy="124" rx="10" ry="5" fill="#3b2a1e"/></g>
 <g className="leg r"><rect x="37" y="86" width="11" height="36" rx="5" fill="#4a3a4a"/><ellipse cx="43" cy="124" rx="10" ry="5" fill="#3b2a1e"/></g>
 <rect x="8" y="50" width="11" height="34" rx="5.5" fill="#b05a42"/><rect x="51" y="50" width="11" height="34" rx="5.5" fill="#b05a42"/>
 <path d="M16 48Q35 38 54 48L58 94Q35 102 12 94Z" fill="#c4694e"/><path d="M14 80Q35 88 56 80" stroke="#e9c27a" strokeWidth="3" fill="none"/>
 <circle cx="35" cy="6" r="7" fill="#5b3a29"/><circle cx="35" cy="30" r="17" fill="#f2c6a0"/>
 <path d="M17 29Q19 7 37 8Q54 10 53 29Q46 17 35 17Q24 18 17 29Z" fill="#5b3a29"/>
 <circle cx="29" cy="32" r="1.9" fill="#3b2a1e"/><circle cx="41" cy="32" r="1.9" fill="#3b2a1e"/>
 <ellipse cx="24" cy="38" rx="3.2" ry="2" fill="#f0a090" opacity=".6"/><ellipse cx="46" cy="38" rx="3.2" ry="2" fill="#f0a090" opacity=".6"/>
 <path d="M30 40Q35 44 40 40" stroke="#8a4a3a" strokeWidth="1.6" fill="none" strokeLinecap="round"/></g></svg>)}
export default function Room({shelves,onOpen,paused}){
 const wr=useRef(),me=useRef(),mi=useRef(),x=useRef(380),face=useRef(1),tgt=useRef(null),pend=useRef(null),keys=useRef({}),sit=useRef(false),cam=useRef(0),sc=useRef(1),nearR=useRef(null),ncR=useRef(null),A=useRef({});
 const [near,setNear]=useState(null),[nc,setNc]=useState(null),[sip,setSip]=useState(false),[sitting,setSit]=useState(false);
 const [coffees,setCoffees]=useState(()=>{try{return +localStorage.getItem('v_coffee')||0}catch{return 0}});
 const act=o=>{if(o.id==='coffee'){setSip(true);setCoffees(c=>{const n=c+1;try{localStorage.setItem('v_coffee',n)}catch{}return n});setTimeout(()=>setSip(false),2600)}else{sit.current=true;setSit(true)}};
 A.current={act,onOpen};
 const walkTo=(px,p)=>{tgt.current=px;pend.current=p;if(sit.current){sit.current=false;setSit(false)}};
 useEffect(()=>{let raf,last=performance.now();
  const tick=t=>{const dt=Math.min(.05,(t-last)/1000);last=t;const k=keys.current;let dir=(k.right?1:0)-(k.left?1:0);
   if(dir){tgt.current=null;pend.current=null;if(sit.current){sit.current=false;setSit(false)}}
   else if(tgt.current!=null){const d=tgt.current-x.current;if(Math.abs(d)<6){x.current=tgt.current;tgt.current=null;const p=pend.current;pend.current=null;if(p)p.kind==='book'?A.current.onOpen(p.b):A.current.act(p.o)}else dir=Math.sign(d)}
   if(dir&&!sit.current){x.current=Math.max(60,Math.min(W-60,x.current+dir*dt*300));face.current=dir}
   const s=Math.min(1.6,innerHeight/H),vw=innerWidth/s;cam.current=Math.max(0,Math.min(W-vw,x.current-vw/2));sc.current=s;
   wr.current.style.transform=`scale(${s}) translateX(${-cam.current}px)`;me.current.style.transform=`translateX(${x.current}px)`;mi.current.style.transform=`scaleX(${face.current})`;me.current.dataset.walk=dir&&!sit.current?1:0;
   const n=OBJ.find(o=>Math.abs(o.x-x.current)<70)||null;if(n?.id!==nearR.current?.id){nearR.current=n;setNear(n)}
   const c=CASES.find(([,,cx])=>x.current>cx-30&&x.current<cx+CW+30)?.[0]||null;if(c!==ncR.current){ncR.current=c;setNc(c)}
   raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)},[]);
 useEffect(()=>{const m={ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'};
  const dn=e=>{if(paused||e.target.tagName==='INPUT')return;if(m[e.key]){keys.current[m[e.key]]=true;e.preventDefault()}else if(/^(e|E|Enter)$/.test(e.key)&&nearR.current)A.current.act(nearR.current)};
  const up=e=>{if(m[e.key])keys.current[m[e.key]]=false};addEventListener('keydown',dn);addEventListener('keyup',up);return()=>{removeEventListener('keydown',dn);removeEventListener('keyup',up)}},[paused]);
 const hold=(d,v)=>({onPointerDown:()=>keys.current[d]=v,onPointerUp:()=>keys.current[d]=false,onPointerLeave:()=>keys.current[d]=false});
 const pts=coffees*5+(shelves.read?.length||0)*20+(shelves.reading?.length||0)*5,lvl=1+Math.floor(pts/50);
 return(<div className="fixed inset-0 overflow-hidden select-none" style={{background:'#6b4428'}}>
 <div ref={wr} className="absolute top-0 left-0 origin-top-left" style={{width:W,height:H}} onPointerDown={e=>{if(!e.target.closest('button'))walkTo(e.clientX/sc.current+cam.current,null)}}>
  <div className="wall"/>{FR.map(([l,t,w,h,g],i)=><div key={i} className="frame" style={{left:l,top:t,width:w,height:h,background:`linear-gradient(135deg,${g})`}}/>)}
  <div className="floor"/><div className="rug" style={{left:2210,width:480,bottom:FL-70}}/>
  {CASES.map(([k,label,cx])=>{const bs=shelves[k]||[];return(<div key={k} className={`case ${nc===k?'glow':''}`} style={{left:cx,width:CW,height:ROWS*132+28,bottom:FL-8}}>
   <div className="sign">{label} · {bs.length}</div>
   {Array.from({length:ROWS},(_,r)=><div key={r} className="row">{bs.slice(r*PER,r*PER+PER).map((b,c)=>{const i=r*PER+c;return(<button key={b.id} title={b.t} className={`rbook ${k==='to'&&i===2?'lean':''}`}
     style={{background:spineColor(b.id),height:70+(hash(b.id)*37%38),width:30+hash(b.id)%12,animationDelay:i*60+'ms'}} onClick={()=>walkTo(cx+24+c*SL+SL/2,{kind:'book',b})}>{b.t.slice(0,18)}</button>)})}</div>)}</div>)})}
  <div className="cone"/><div className="lamp"/><div className="lampshade"/>
  <div className="absolute" style={{left:2386,bottom:FL+10,width:128,height:100,borderRadius:'30px 30px 8px 8px',background:'#4f9a92',zIndex:1}}/>
  <button className="absolute z-[4]" style={{left:2370,bottom:FL-10,width:140,height:90}} onClick={()=>walkTo(2440,{kind:'obj',o:OBJ[1]})} aria-label="Reading chair"><div className="ch seat"/><div className="ch arm l"/><div className="ch arm r"/></button>
  <button className="absolute z-[2]" style={{left:80,bottom:FL-10,width:140,height:130}} onClick={()=>walkTo(150,{kind:'obj',o:OBJ[0]})} aria-label="Coffee corner"><div className="tbl"/><span className="absolute left-3 bottom-[62px] text-4xl">🫖</span><span className="absolute left-20 bottom-[62px] text-3xl">☕</span></button>
  <span className="absolute text-7xl" style={{left:2620,bottom:FL-6}}>🪴</span><span className="absolute text-5xl" style={{left:1470,bottom:FL+4}}>🕯️</span>
  {Array.from({length:14},(_,i)=><i key={i} className="mote" style={{left:(i*211)%W,top:80+(i*97)%480,animationDelay:i*.7+'s'}}/>)}
  <div ref={me} className="absolute z-[3]" style={{left:-35,bottom:FL-26,width:70,height:130}}>
   {near&&!sip&&!sitting&&<button className="bubble" onClick={()=>act(near)}>E · {near.l}</button>}
   <div ref={mi} className={`${sitting?'sit':''}`}><Avatar/>{sip&&<div className="mug">☕<i className="steam">≀</i></div>}</div></div>
 </div>
 <div className="pointer-events-none fixed inset-0 z-[4]" style={{boxShadow:'inset 0 0 180px rgba(60,30,10,.5)'}}/>
 <div className="fixed left-4 bottom-4 z-[4] bg-cream/90 border border-gold rounded-xl px-4 py-2 text-sm shadow"><b className="font-display">Cozy level {lvl}</b> · ☕ ×{coffees}
  <div className="h-2 w-40 bg-[#d9c7a0] rounded mt-1"><div className="h-2 bg-gold rounded" style={{width:(pts%50)*2+'%'}}/></div></div>
 <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[4] hidden md:block text-xs bg-cream/80 rounded-full px-4 py-1">← → or A D to walk · E to interact · click the floor to walk · click a book to open it</div>
 <div className="fixed bottom-4 right-4 z-[4] flex gap-2 md:hidden">{[['◀','left'],['▶','right']].map(([t,d])=><button key={d} {...hold(d,true)} className="bg-walnut text-cream w-14 h-14 rounded-full text-xl">{t}</button>)}</div>
 </div>)}
