import {spineColor,spineHeight} from '../lib/text';
export default function Shelf({label,items,onOpen}){return(<section><h2 className="font-display text-lg text-walnut mx-7 mt-5 -mb-1">{label}</h2>
<div className="shelf">{items.map((b,i)=><button key={b.id} title={b.t} onClick={()=>onOpen(b)} className={`spine ${i===2&&label==='To Read'?'lean':''}`}
 style={{background:spineColor(b.id),height:spineHeight(b.id),animationDelay:i*90+'ms'}}>{b.t.slice(0,22)}</button>)}</div></section>)}
