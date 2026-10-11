import * as THREE from 'three';import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
// Three distinct 3D cat characters: soft toon shading + cartoon outline. Origin = feet; faces +Z.
const OL=new THREE.MeshBasicMaterial({color:'#4a2f26',side:THREE.BackSide}),eyeM=new THREE.MeshBasicMaterial({color:'#2a1a16'});
const grad=(()=>{const t=new THREE.DataTexture(new Uint8Array([85,150,210,255]),4,1,THREE.RedFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;t.needsUpdate=true;return t})();
const toon=c=>new THREE.MeshToonMaterial({color:c,gradientMap:grad}),std=(c,r=.85)=>new THREE.MeshStandardMaterial({color:c,roughness:r});
const outl=(geo,m,w=.045)=>{const a=new THREE.Mesh(geo,m),o=new THREE.Mesh(geo,OL);o.scale.setScalar(1+w);a.add(o);return a};
const at=(o,x,y,z)=>{o.position.set(x,y,z);return o},sph=(r,m,a=14,b=10)=>new THREE.Mesh(new THREE.SphereGeometry(r,a,b),m);
const plaid=(a,b,c)=>{const cv=document.createElement('canvas');cv.width=cv.height=128;const g=cv.getContext('2d');g.fillStyle=a;g.fillRect(0,0,128,128);g.fillStyle=b;for(let i=0;i<4;i++){g.fillRect(0,i*32+6,128,8);g.fillRect(i*32+6,0,8,128)}g.fillStyle=c;for(let i=0;i<4;i++){g.fillRect(0,i*32+20,128,3);g.fillRect(i*32+20,0,3,128)}const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,1);return t};
// each cat has its own body shape, tail and markings so they read as three different characters
const LOOK={
 gray:{body:'#a8a6b3',dark:'#6f6d7c',belly:'#e9e6ef',inner:'#f0a8b4',pad:'#e8909a',sx:1.1,sy:.95,sz:1,head:1.2,tailN:4,tailR:.15,ear:.14,earH:.24},
 white:{body:'#fff3dc',dark:'#e39a4e',belly:'#fffaf0',inner:'#f6b8b0',pad:'#f0a0a8',sx:.9,sy:1.04,sz:1.06,head:1.07,tailN:7,tailR:.1,ear:.15,earH:.34},
 black:{body:'#3a3338',dark:'#1d181b',belly:'#4a4248',inner:'#c98b8b',pad:'#c98b8b',sx:1,sy:1,sz:1.05,head:1.12,tailN:6,tailR:.1,ear:.14,earH:.28}};
function paw(bodyM,pad){const g=new THREE.Group(),p=outl(new THREE.SphereGeometry(.1,20,14),bodyM,.05);p.scale.set(1.08,.66,1.3);g.add(at(p,0,-.185,.035));
 const pd=sph(.04,pad,10,8);pd.scale.set(1.2,.5,1);g.add(at(pd,0,-.245,.045));[-1,0,1].forEach(i=>{const b=sph(.018,pad,8,6);b.scale.y=.5;g.add(at(b,i*.04,-.243,.098-Math.abs(i)*.012))});
 [-.03,.03].forEach(x=>{const l=new THREE.Mesh(new THREE.CapsuleGeometry(.004,.035,3,6),eyeM);l.rotation.x=Math.PI/2;g.add(at(l,x,-.128,.1))});return g}
export function makeCat(kind){
 const L=LOOK[kind],bodyM=toon(L.body),darkM=toon(L.dark),innerM=toon(L.inner),padM=toon(L.pad),root=new THREE.Group();
 const R={kind,L,g:root,ph:Math.random()*6,seed:Math.random()*6,sitK:0,walkK:0,drinkK:0,blinkT:2+Math.random()*3,blink:0,holdKind:'mug',hop:0,meow:0,wig:0,earLag:0,wh:[]};
 const bs=[L.sx,.92*L.sy,1.05*L.sz];R.bs=bs;const body=at(outl(new THREE.SphereGeometry(.42,32,22),bodyM),0,.46,0);body.scale.set(...bs);root.add(body);R.body=body;
 const belly=at(outl(new THREE.SphereGeometry(.28,24,16),toon(L.belly),.03),0,-.05,.3);belly.scale.set(1,1.15,.78);body.add(belly);
 const sx=(y,z)=>Math.sqrt(Math.max(.01,.1764-y*y-z*z))*.98,bar=(x,y,z,h)=>{const b=sph(.06,darkM,10,8);b.scale.set(.3,h,.7);body.add(at(b,x,y,z))};
 if(kind==='white')[-.24,-.1,.04,.18].forEach((z,i)=>[-1,1].forEach(s=>bar(s*sx(.12,z),.12+(i%2)*.03,z,1.9)));
 if(kind==='gray')[-.16,0,.16].forEach(z=>[-1,1].forEach(s=>bar(s*sx(.14,z),.14,z,1.5)));
 R.legs=[[-.2,.24],[.2,.24],[-.22,-.2],[.22,-.2]].map(([x,z])=>{const p=new THREE.Group();p.position.set(x,.24,z);p.add(at(outl(new THREE.CapsuleGeometry(.075,.06,6,12),bodyM,.05),0,-.09,0));p.add(paw(bodyM,padM));
  if(kind==='white'){const r=at(new THREE.Mesh(new THREE.TorusGeometry(.079,.012,6,16),darkM),0,-.06,0);r.rotation.x=Math.PI/2;p.add(r)}root.add(p);return p});
 const tail=new THREE.Group();tail.position.set(0,.34,-.4*L.sz);root.add(tail);R.tail=tail;R.seg=[];let par=tail;
 for(let i=0;i<L.tailN;i++){const s=new THREE.Group();s.position.z=i?-L.tailR*1.1:-.05;const dk=(kind==='white'&&i%2===1)||(kind==='gray'&&i>=L.tailN-2);s.add(outl(new THREE.SphereGeometry(L.tailR*(1-i*.05),16,12),dk?darkM:bodyM,.06));par.add(s);R.seg.push(s);par=s}
 const head=new THREE.Group();head.position.set(0,.98,.1);root.add(head);R.head=head;
 const hm=outl(new THREE.SphereGeometry(.4,32,24),bodyM);hm.scale.set(L.head,.95,1);head.add(hm);
 [-1,1].forEach(s=>{const e=outl(new THREE.ConeGeometry(L.ear,L.earH,16),bodyM,.07);at(e,s*.27,.31+L.earH*.15,-.02);e.rotation.z=-s*.42;head.add(e);const i=new THREE.Mesh(new THREE.ConeGeometry(L.ear*.55,L.earH*.62,16),innerM);at(i,s*.265,.3+L.earH*.14,.04);i.rotation.z=-s*.42;head.add(i);
  if(kind==='white'){const tip=new THREE.Mesh(new THREE.ConeGeometry(L.ear*.4,L.earH*.3,12),darkM);at(tip,s*.27+s*.055,.31+L.earH*.15+L.earH*.38,-.02);tip.rotation.z=-s*.42;head.add(tip);for(let j=0;j<2;j++){const c=new THREE.Mesh(new THREE.ConeGeometry(.05,.14,8),bodyM);at(c,s*(.38+j*.02),-.1-j*.05,.14);c.rotation.z=s*(1.9+j*.3);head.add(c)}}
  R[s<0?'earL':'earR']=e});
 R.eyes=new THREE.Group();head.add(R.eyes);
 if(kind==='white'){[-1,1].forEach(s=>{const a=new THREE.Mesh(new THREE.TorusGeometry(.058,.014,6,14,Math.PI),eyeM);at(a,s*.16,.04,.375);a.rotation.z=Math.PI;head.add(a)})}
 else if(kind==='gray'){[-1,1].forEach(s=>{const e=sph(.062,eyeM,14,10);e.scale.set(1,1.2,.5);at(e,s*.16,.04,.372);R.eyes.add(e);const w=new THREE.MeshBasicMaterial({color:'#fff'});R.eyes.add(at(sph(.02,w,8,6),s*.16+.018,.07,.395));R.eyes.add(at(sph(.01,w,8,6),s*.16-.016,.02,.395))})}
 else{const fr=std('#f2b92e',.5),lens=std('#16110f',.2),cup=std('#fff6e8',.6);[-1,1].forEach(s=>{head.add(at(new THREE.Mesh(new RoundedBoxGeometry(.22,.15,.04,2,.05),fr),s*.16,.05,.385));head.add(at(new THREE.Mesh(new RoundedBoxGeometry(.17,.1,.03,2,.04),lens),s*.16,.05,.405));const c=at(new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.1,18),cup),s*.45,0,0);c.rotation.z=Math.PI/2;head.add(c)});
  head.add(at(new THREE.Mesh(new THREE.BoxGeometry(.08,.025,.025),fr),0,.06,.39));head.add(new THREE.Mesh(new THREE.TorusGeometry(.45,.04,10,28,Math.PI),cup))}
 const nose=at(sph(.03,std(kind==='black'?'#e8a24a':'#e8909a',.6),10,8),0,-.04,.39);nose.scale.set(1.2,.8,.8);head.add(nose);
 R.mouth=at(sph(.05,new THREE.MeshBasicMaterial({color:'#7a2a2a'}),12,8),0,-.11,.375);R.mouth.scale.set(1,.01,.5);head.add(R.mouth);
 [-1,1].forEach(s=>{const m=at(new THREE.Mesh(new THREE.TorusGeometry(.035,.009,6,12,Math.PI),eyeM),s*.034,-.1,.385);m.rotation.z=Math.PI;head.add(m);
  for(let i=0;i<3;i++){const w=at(new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,.26,4),kind==='black'?std('#e9e1d6'):eyeM),s*.46,-.03-i*.04,.3);w.rotation.z=Math.PI/2+s*(i-1)*.18;w.rotation.y=-s*.3;head.add(w);R.wh.push(w)}
  if(kind!=='black'){const b=at(new THREE.Mesh(new THREE.SphereGeometry(.05,10,8),new THREE.MeshBasicMaterial({color:'#f0a090',transparent:true,opacity:.55})),s*.27,-.05,.33);b.scale.set(1,.6,.3);head.add(b)}});
 if(kind==='gray')for(let i=-1;i<=1;i++){const st=at(new THREE.Mesh(new THREE.CapsuleGeometry(.015,.08,4,8),darkM),i*.08,.3,.27);st.rotation.x=-.9;head.add(st)}
 if(kind==='white'){[-1,0,1].forEach(i=>{const st=at(new THREE.Mesh(new THREE.CapsuleGeometry(.017,.1,4,8),darkM),i*.09,.29,.27);st.rotation.x=-.9;st.rotation.z=-i*.25;head.add(st)});[-1,1].forEach(s=>[0,1].forEach(j=>{const c=at(new THREE.Mesh(new THREE.CapsuleGeometry(.012,.07,4,8),darkM),s*(.3+j*.03),-.02-j*.06,.3);c.rotation.z=s*1.2;c.rotation.y=s*.6;head.add(c)}))}
 if(kind!=='white'){const sm=new THREE.MeshStandardMaterial({map:kind==='gray'?plaid('#d9784a','#f6dfb8','#a85a30'):plaid('#a9bfdc','#d6e2f2','#8aa3c4'),roughness:.9});
  const t=at(new THREE.Mesh(new THREE.TorusGeometry(.35,.085,12,30),sm),0,.66,.04);t.rotation.x=Math.PI/2;t.scale.set(1.1*(L.sx>1?1.08:1),1,1);root.add(t);const tl=at(new THREE.Mesh(new RoundedBoxGeometry(.13,.3,.05,2,.02),sm),.15,.5,.39);tl.rotation.z=.12;root.add(tl)}
 const hold=at(new THREE.Group(),0,.62,.46);root.add(hold);R.hold=hold;
 const mug=new THREE.Group();mug.add(new THREE.Mesh(new THREE.CylinderGeometry(.1,.085,.13,16),std(kind==='white'?'#7d9a6a':'#fff3df',.5)));mug.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.088,.088,.01,16),std('#7a4a2e')),0,.06,0));const hd=at(new THREE.Mesh(new THREE.TorusGeometry(.045,.012,6,12,Math.PI),std('#fff3df')),.1,0,0);hd.rotation.z=-Math.PI/2;mug.add(hd);hold.add(mug);R.mug=mug;
 const cake=new THREE.Group();cake.add(new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,.08,3),std('#f6dfa0')));cake.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,.025,3),std('#e8a0a8')),0,.05,0));cake.add(at(sph(.03,std('#c4524a'),10,8),0,.09,0));cake.rotation.y=Math.PI/6;hold.add(cake);R.cake=cake;
 const leaf=at(sph(.12,std('#e9923a'),12,8),0,.02,0);leaf.scale.set(1,.12,1.4);leaf.rotation.set(.5,.4,0);hold.add(leaf);R.leaf=leaf;
 root.scale.setScalar(.85);return R}
export function poseCat(R,t,dt,o={}){
 const k=r=>1-Math.exp(-r*dt),sd=R.seed;R.sitK+=((o.sit||0)-R.sitK)*k(7);R.walkK+=((o.walk||0)-R.walkK)*k(10);R.drinkK+=((o.drink||0)-R.drinkK)*k(8);if(o.hold)R.holdKind=o.hold;
 if(R.meow>0)R.meow-=dt;if(R.wig>0)R.wig-=dt;const mo=R.meow>0?Math.sin(Math.PI*(1-R.meow/.6)):0,wg=R.wig>0?R.wig/.8:0;
 const w=R.walkK,s=R.sitK,d=R.drinkK;if(o.walk>.05)R.ph+=dt*(7+o.walk*5);
 const sw=Math.sin(R.ph),sw2=Math.sin(R.ph*2),A=.8*w*(1-s),br=Math.sin(t*2+sd);
 R.body.position.set(Math.sin(R.ph)*.015*w,.46-.08*s+Math.abs(sw)*.045*w+br*.006,0);R.body.rotation.x=-.2*s+.08*w-.1*mo;R.body.rotation.z=sw*.05*w+Math.sin(t*30)*.08*wg;
 R.body.scale.set(R.bs[0]*(1+.02*sw2*w),R.bs[1]*(1+br*.013-.022*s-.03*sw2*w+.04*mo),R.bs[2]);
 [0,Math.PI,Math.PI,0].forEach((off,i)=>{const li=Math.sin(R.ph+off),L=R.legs[i];L.rotation.x=li*A+(i<2?-1.3*d-.12*s:-1.45*s);L.position.y=.24+Math.max(0,-li)*.05*w*(1-s)});
 R.tail.position.set(.18*s,.34-.2*s,-.4*R.L.sz+.08*s);R.tail.rotation.y=-1.7*s+Math.sin(t*1.3+sd)*.25*(1-s)+sw*.35*w+Math.sin(t*28)*.4*wg;
 const n=R.seg.length;R.seg.forEach((g,i)=>{g.rotation.y=-1.4*s/n+Math.sin(t*2.2-i*.7+sd)*(.14+.25*wg)+sw*.07*w*(i%2?1:-1);g.rotation.x=Math.sin(t*1.7-i*.6+sd)*.07+.04;g.scale.setScalar(1-.18*s)});
 R.head.position.set(0,.98-.07*s+br*.006+Math.abs(sw)*.03*w,.1+.04*mo);const ly=Math.max(-.9,Math.min(.9,o.look||0));R.head.rotation.y+=(ly-R.head.rotation.y)*k(5);
 R.head.rotation.x=.2*d-.25*mo+Math.sin(t*1.5+sd)*.02+.05*w;R.head.rotation.z=Math.sin(t*.8+sd)*.03-sw*.03*w+Math.sin(t*25)*.05*wg;
 const lag=R.head.rotation.y-R.earLag;R.earLag+=lag*k(6);const tw=Math.max(0,Math.sin(t*.7+sd*3)-.93)*9;
 R.earL.rotation.z=.42+tw*.4+lag*.3+Math.abs(sw)*.06*w;R.earR.rotation.z=-.42-tw*.4+lag*.3-Math.abs(sw)*.06*w;
 R.wh.forEach((m,i)=>{m.rotation.x=Math.sin(t*3+i)*.04*(1+mo)});R.mouth.scale.y=.01+mo*1.2;
 R.blinkT-=dt;if(R.blinkT<=0){R.blink=.13;R.blinkT=2.4+Math.random()*3}if(R.blink>0)R.blink-=dt;R.eyes.scale.y=R.blink>0?.1:1;
 R.hold.position.set(0,.62+.1*d-.05*s,.46-.05*d);const dr=d>.05;R.mug.visible=dr?R.holdKind==='mug':R.kind==='white';R.cake.visible=dr&&R.holdKind==='cake';R.leaf.visible=R.kind==='gray'&&!dr}
// small portraits of the real 3D cats for the character picker
export function renderThumbs(ids){
 const r2=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});r2.setSize(360,360);r2.outputColorSpace=THREE.SRGBColorSpace;
 const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight('#fff2dc','#b88a62',2),new THREE.AmbientLight('#ffe4c4',.5));const dl=new THREE.DirectionalLight('#fff0d8',2.2);dl.position.set(2,3,4);sc.add(dl);
 const c2=new THREE.PerspectiveCamera(30,1,.1,30);c2.position.set(.3,1.05,4.6);c2.lookAt(0,.78,0);const out={};
 ids.forEach(id=>{const R=makeCat(id);R.sitK=1;R.blinkT=99;poseCat(R,0,.016,{sit:1});R.g.rotation.y=-.3;sc.add(R.g);r2.render(sc,c2);out[id]=r2.domElement.toDataURL('image/png');sc.remove(R.g)});
 r2.dispose();return out}
