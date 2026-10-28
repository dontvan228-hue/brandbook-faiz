(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const NS='http://www.w3.org/2000/svg';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG=!!(window.gsap&&window.ScrollTrigger);
const toast=(m)=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),1600)};

/* ---------- smooth scroll */
let lenis=null;
if(window.Lenis&&!reduce){ lenis=new Lenis({lerp:.09});
  if(hasG){ lenis.on('scroll',ScrollTrigger.update); gsap.ticker.add(t=>lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0);}
  else { const r=t=>{lenis.raf(t);requestAnimationFrame(r)};requestAnimationFrame(r);} }
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(!/^#[A-Za-z][\w-]*$/.test(id))return;const el=document.getElementById(id.slice(1));if(!el)return;e.preventDefault();lenis?lenis.scrollTo(el,{duration:1.4}):el.scrollIntoView({behavior:'smooth'});}));

/* ---------- nav */
const nav=$('#nav'); const onS=()=>nav.classList.toggle('solid',scrollY>innerHeight*.6); addEventListener('scroll',onS,{passive:true}); onS();

/* ---------- cursor */
const cur=$('#cur');
if(matchMedia('(hover:hover) and (pointer:fine)').matches){let cx=0,cy=0,tx=0,ty=0,raf=0;
  const loop=()=>{cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;cur.style.transform=`translate(${cx}px,${cy}px)`;raf=Math.abs(tx-cx)+Math.abs(ty-cy)>.1?requestAnimationFrame(loop):0;};
  addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(loop);},{passive:true});
  document.addEventListener('pointerover',e=>{cur.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,button,[role=button],.var,.sw,.stk')))});}

/* ---------- hero seal */
const SEAL={r1:{txt:'Faiz · Quality · Trust · Comfort · Faiz · Quality · Trust · Comfort · ',r:372,el:'#hR1'},
            r2:{txt:'ФАЙЗ · КАЧЕСТВО · ДОВЕРИЕ · КОМФОРТ · АТМОСФЕРА · ВЫБОР · ',r:268,el:'#hR2'},
            r4:{txt:'БРЕНДБУК · ФИРМЕННЫЙ СТИЛЬ · 2026 · БРЕНДБУК · ФИРМЕННЫЙ СТИЛЬ · 2026 · БРЕНДБУК · ФИРМЕННЫЙ СТИЛЬ · 2026 · ',r:450,el:'#hR4'}};
const CH=[];
function buildRing(key){const R=SEAL[key];const g=$(R.el);g.innerHTML='';const chars=[...R.txt];
  const els=chars.map(c=>{const t=document.createElementNS(NS,'text');t.textContent=c===' '?' ':c;t.setAttribute('text-anchor','middle');g.appendChild(t);return t;});
  const w=els.map(t=>{try{return t.getComputedTextLength()||10}catch(e){return 10}});const tot=w.reduce((s,x)=>s+x,0);
  let acc=0;els.forEach((t,i)=>{const a=(acc+w[i]/2)/tot*360;acc+=w[i];CH.push({t,a,r:R.r,ring:key,rnd:Math.random(),rnd2:Math.random()});
    t.setAttribute('transform',`rotate(${a}) translate(0 ${-R.r})`);});}
const ticksG=$('#hR3');
for(let i=0;i<180;i++){const l=document.createElementNS(NS,'line');const long=i%15===0;l.setAttribute('x1',0);l.setAttribute('x2',0);l.setAttribute('y1',-422);l.setAttribute('y2',long?-406:-414);
  l.setAttribute('stroke',long?'rgba(232,207,152,.85)':'rgba(200,180,140,.35)');l.setAttribute('stroke-width',long?2:1);l.setAttribute('transform',`rotate(${i*2})`);ticksG.appendChild(l);}
[[426,.35],[318,.22],[226,.18]].forEach(([r,o])=>{const c=document.createElementNS(NS,'circle');c.setAttribute('r',r);c.setAttribute('fill','none');c.setAttribute('stroke',`rgba(200,180,140,${o})`);ticksG.appendChild(c);});
const hFline=$('#hFline');hFline.setAttribute('d',$('#pF').getAttribute('d'));const HFL=hFline.getTotalLength();hFline.style.strokeDasharray=HFL;hFline.style.strokeDashoffset=HFL;
const H={intro:reduce?1:0,spin:[0,0,0,0],boost:0,mx:0,my:0,tx:0,ty:0,out:0};
const cl01=x=>Math.min(1,Math.max(0,x));
function introAt(p){
  CH.forEach(o=>{const d=o.ring==='r1'?0:(o.ring==='r2'?.12:.22);const k=cl01((p-d-o.rnd*.25)/.45);const e=1-Math.pow(1-k,4);
    const a=o.a+(1-e)*(o.rnd2-.5)*240, r=o.r*(1+(1-e)*(1.2+o.rnd));
    o.t.setAttribute('transform',`rotate(${a}) translate(0 ${-r}) rotate(${(1-e)*(o.rnd-.5)*180})`);o.t.style.opacity=e;});
  hFline.style.strokeDashoffset=HFL*(1-cl01((p-.05)/.55));
  const f=cl01((p-.55)/.25);$('#hFfill').setAttribute('opacity',f);hFline.style.opacity=1-f*.9;
  ['#hR3','#hDisc','#hDiscLine','#hHalo'].forEach((s,i)=>{$(s).style.opacity=cl01((p-i*.06)/.5);});
  $('#hSheen').setAttribute('x',-400+cl01((p-.78)/.22)*760);}
let sheenT=0;
const HE={r1:$('#hR1'),r2:$('#hR2'),r3:$('#hR3'),r4:$('#hR4'),f:$('#hF'),seal:$('#sealIn'),sheen:$('#hSheen')};
let heroVis=true;new IntersectionObserver(es=>es.forEach(e=>heroVis=e.isIntersecting)).observe($('#hero'));
function startHero(){['r1','r2','r4'].forEach(buildRing);introAt(H.intro);
  if(hasG&&!reduce){gsap.to(H,{intro:1,duration:3.6,ease:'power2.inOut',delay:1.9,onUpdate:()=>introAt(H.intro)});}else introAt(1);
  const tick=(t)=>{requestAnimationFrame(tick);if(!heroVis)return;const sp=reduce?0:1;H.boost*=.95;H.spin[0]+=(.05+H.boost)*sp;H.spin[1]-=(.08+H.boost*1.3)*sp;H.spin[2]+=(.02+H.boost*.4)*sp;H.spin[3]-=(.03+H.boost*.6)*sp;
    H.mx+=(H.tx-H.mx)*.06;H.my+=(H.ty-H.my)*.06;const o=H.out;
    const tr=(d,s)=>`translate(${H.mx*d} ${H.my*d}) rotate(${s}) scale(${1+o*d/28})`;
    HE.r1.setAttribute('transform',tr(14,H.spin[0]));HE.r2.setAttribute('transform',tr(8,H.spin[1]));
    HE.r3.setAttribute('transform',tr(22,H.spin[2]));HE.r4.setAttribute('transform',tr(28,H.spin[3]));
    HE.f.setAttribute('transform',`translate(${H.mx*-6} ${H.my*-6}) scale(${.78*(1+o*.3)}) translate(-216.25 -239.6)`);
    HE.seal.style.transform=`rotateY(${H.mx*.9}deg) rotateX(${-H.my*.9}deg)`;
    if(H.intro>=1)[HE.r1,HE.r2,HE.r3,HE.r4].forEach(el=>el.style.opacity=Math.max(0,1-o*1.5));
    // periodic sheen after intro
    if(H.intro>=1&&!reduce){sheenT=(sheenT+1)%420;HE.sheen.setAttribute('x',-400+Math.min(1,sheenT/70)*760);}
    };requestAnimationFrame(tick);
  const hero=$('#hero');
  hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();H.tx=((e.clientX-r.left)/r.width-.5)*16;H.ty=((e.clientY-r.top)/r.height-.5)*16;});
  hero.addEventListener('pointerleave',()=>{H.tx=H.ty=0});
  $('#sealWrap').addEventListener('click',()=>{H.boost=5;sheenT=0;});
}
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(startHero);

/* dust */
const cv=$('#dust'),dctx=cv.getContext('2d');let DW=0,DH=0;const D=[];const DPR=Math.min(2,devicePixelRatio||1);
const rsz=()=>{DW=cv.width=cv.offsetWidth*DPR;DH=cv.height=cv.offsetHeight*DPR};rsz();addEventListener('resize',rsz);
for(let i=0;i<110;i++)D.push({x:Math.random(),y:Math.random(),r:Math.random()*Math.random()*2.6+.4,v:.0004+Math.random()*.0012,p:Math.random()*6});
(function dl(t){requestAnimationFrame(dl);if(!heroVis)return;dctx.clearRect(0,0,DW,DH);D.forEach(d=>{if(!reduce){d.y-=d.v*(1+H.boost*2);d.x+=Math.sin(t/2000+d.p)*.0003;}if(d.y<-.02){d.y=1.02;d.x=Math.random()}
  const a=.3+.45*Math.sin(t/700+d.p*3);dctx.beginPath();dctx.arc(d.x*DW,d.y*DH,d.r*DPR,0,7);dctx.fillStyle=`rgba(232,207,152,${Math.max(0,a)})`;dctx.fill();});})(0);

/* marquees */
const mqHTML=()=>{let s='';for(let k=0;k<2;k++){['Faiz','Quality','Trust','Comfort','Atmosphere','Choice'].forEach(w=>{s+=`<span>${w}<svg viewBox="44 44 344.5 391.25"><use href="#pF"/></svg></span>`});}return s};
['#mq1','#mq2','#mq3'].forEach(s=>{$(s).innerHTML=mqHTML()});

/* ---------- logo story: build drawable paths */
const ds=$('#drawSvg'); const parts=['F','A','Y','B','Z'];
const gStroke=document.createElementNS(NS,'g'), gFill=document.createElementNS(NS,'g');
ds.append(gFill,gStroke);
const strokes=[],fills=[];
parts.forEach(k=>{const d=document.getElementById('p'+k).getAttribute('d');
  const f=document.createElementNS(NS,'path');f.setAttribute('d',d);f.setAttribute('fill','url(#gGoldWide)');f.style.opacity=0;gFill.appendChild(f);fills.push(f);
  const s=document.createElementNS(NS,'path');s.setAttribute('d',d);s.setAttribute('fill','none');s.setAttribute('stroke','#f3e3b8');s.setAttribute('stroke-width','1.4');gStroke.appendChild(s);strokes.push(s);
  const L=s.getTotalLength();s.style.strokeDasharray=L;s.style.strokeDashoffset=L;s.dataset.l=L;});
const caps=[["01.1","Основной логотип","Шрифтовое написание названия и фирменный знак в одной связке."],
            ["01.2","Фирменный знак","Буква Ф с шипами — самостоятельная пиктограмма для иконок, аватаров и тиснения."],
            ["01.3","Шрифтовой логотип","Написание «АЙЗ» продолжает знак и вместе с ним образует название."]];
let capI=-1; const setCap=i=>{if(i===capI)return;capI=i;const c=caps[i];$('#capK').textContent=c[0];$('#capV').textContent=c[1];$('#capD').textContent=c[2];
  if(hasG) gsap.fromTo('.story .cap > *',{y:18,opacity:0},{y:0,opacity:1,stagger:.06,duration:.5,overwrite:true});};
const STY={draw:(hasG&&!reduce)?0:1,scr:0};
const sm=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2, c01=x=>Math.min(1,Math.max(0,x));
function storyRender(){
  const draw=STY.draw, fill=c01((draw-.6)/.4), p=STY.scr;
  strokes.forEach((s,i)=>{const L=+s.dataset.l;const local=c01(draw*1.35-i*.08);s.style.strokeDashoffset=L*(1-local);s.style.opacity=1-fill*.85;});
  const S=sm(c01((p-.12)/.18))*(1-sm(c01((p-.8)/.14)));
  fills.forEach((f,i)=>{const isF=i===0;f.setAttribute('transform',`translate(${isF?-50*S:50*S} 0)`);
    let o=fill; if(p>.34&&p<.56) o=fill*(isF?1:.12); else if(p>=.56&&p<.78) o=fill*(isF?.12:1); f.style.opacity=o;});
  strokes.forEach((s,i)=>s.setAttribute('transform',`translate(${i===0?-50*S:50*S} 0)`));
  setCap(p>.34&&p<.56?1:(p>=.56&&p<.78?2:0));
}
function storyAt(p){STY.scr=p;storyRender();}
storyRender();

/* ---------- construction toggles */
['Safe','Grid'].forEach(k=>$('#tg'+k).addEventListener('click',e=>{const on=e.currentTarget.getAttribute('aria-pressed')!=='true';e.currentTarget.setAttribute('aria-pressed',String(on));$('#board').classList.toggle('show-'+k.toLowerCase(),on);}));

/* ---------- variation tilt */
$$('.var').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  c.style.transform=`rotateY(${(x-.5)*14}deg) rotateX(${(.5-y)*10}deg)`;c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%');});
  c.addEventListener('pointerleave',()=>c.style.transform='');});
const pressable=(el,fn)=>{el.addEventListener('click',fn);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn(e);}});};
$$('.mcard').forEach(c=>pressable(c,()=>{const on=c.classList.toggle('fix');c.setAttribute('aria-pressed',String(on));}));

/* ---------- palette */
const PAL=[["Тёмный изумруд","#02110c"],["Оливковый","#1a422f"],["Кремовый","#f3ebd6"],["Шампань","#c8b48c"]];
const rgb=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
const cmyk=([r,g,b])=>{r/=255;g/=255;b/=255;const k=1-Math.max(r,g,b);if(k>=1)return[0,0,0,100];return[(1-r-k)/(1-k),(1-g-k)/(1-k),(1-b-k)/(1-k),k].map(x=>Math.round(x*100))};
const pal=$('#pal');
PAL.forEach(([n,h])=>{const c=rgb(h),light=(c[0]*.3+c[1]*.59+c[2]*.11)>140;const b=document.createElement('button');b.className='sw';b.style.background=h;b.style.color=light?'#02110c':'#f3ebd6';
  const k=cmyk(c);b.innerHTML=`<span class="cp">Копировать</span><span class="in"><span class="nm">${n}</span><span class="hx">${h.toUpperCase()}</span><span class="cd">R${c[0]} G${c[1]} B${c[2]} · C${k[0]} M${k[1]} Y${k[2]} K${k[3]}</span></span>`;
  b.setAttribute('aria-label',`${n}, ${h}. Нажмите, чтобы скопировать`);
  b.addEventListener('click',()=>{const done=()=>toast('Скопировано '+h.toUpperCase());try{navigator.clipboard.writeText(h.toUpperCase()).then(done,()=>toast(h.toUpperCase()))}catch(e){toast(h.toUpperCase())}});
  pal.appendChild(b);});

/* ---------- type tester */
const tOut=$('#tOut'),tIn=$('#tIn'),tSz=$('#tSz');let tf='head';
const upd=()=>{tOut.textContent=tIn.value||' ';tOut.style.fontSize=tSz.value+'px';tOut.style.fontFamily=`var(--f-${tf})`;tOut.style.fontWeight=tf==='head'?700:500;tOut.style.fontStyle=tf==='acc'?'italic':'normal';};
tIn.addEventListener('input',upd);tSz.addEventListener('input',upd);
$$('.tester .seg .pill').forEach(b=>b.addEventListener('click',()=>{tf=b.dataset.f;$$('.tester .seg .pill').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));upd();}));upd();

/* ---------- pattern */
const words=['Faiz','Quality','Trust','Comfort','Atmosphere','Style','Choice'];
const wmSvg='<svg viewBox="44 44 819.75 391.25"><use href="#pF"/><use href="#pA"/><use href="#pY"/><use href="#pB"/><use href="#pZ"/></svg>';
$$('#patt .row').forEach((r,i)=>{let h='';for(let k=0;k<4;k++){words.forEach((w,j)=>{h+=`<span>${w}</span>`;if((j+i)%3===0)h+=`<span>${wmSvg}</span>`;});}r.innerHTML=h;r.style.transform=`translateX(${-200*i}px)`;});
$$('[data-tone]').forEach(b=>{if(b.tagName!=='BUTTON')return;b.addEventListener('click',()=>{$('#patt').dataset.tone=b.dataset.tone;$$('button[data-tone]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));});});

/* ---------- carriers: drawn mockups */
const sc=(id,svg)=>{$(id).innerHTML=svg};
sc('#scBag',`<svg viewBox="0 0 400 320" style="width:70%;height:auto" class="mk">
  <ellipse cx="200" cy="300" rx="120" ry="10" fill="rgba(0,0,0,.45)"/>
  <path d="M150 90 C150 40 250 40 250 90" fill="none" stroke="#c8b48c" stroke-width="6"/>
  <path d="M110 92 L290 92 L304 296 L96 296 Z" fill="#1a422f"/>
  <path d="M290 92 L320 104 L330 290 L304 296 Z" fill="#12311f"/>
  <path d="M110 92 L290 92 L292 108 L108 108 Z" fill="#245a40"/>
  <svg x="160" y="150" width="80" height="94" viewBox="44 44 344.5 391.25" style="fill:url(#gGoldObj)"><use href="#pF"/></svg>
  <text x="200" y="272" text-anchor="middle" font-family="Roboto Condensed" font-size="11" letter-spacing="5" fill="#c8b48c">ФАЙЗ</text></svg>`);
sc('#scCert',`<div class="shine" style="width:72%;aspect-ratio:2/1;border-radius:8px;background:#02110c;box-shadow:0 30px 60px rgba(0,0,0,.5);display:grid;grid-template-columns:1fr 1.4fr;align-items:center;border:1px solid rgba(200,180,140,.5);transform:rotate(-4deg)">
  <div style="display:grid;place-items:center;height:100%;border-right:1px dashed rgba(200,180,140,.4)"><svg viewBox="44 44 344.5 391.25" style="width:46%;fill:url(#gGoldObj)"><use href="#pF"/></svg></div>
  <div style="padding:8%"><div style="font-family:var(--f-acc);font-style:italic;color:#c8b48c;font-size:clamp(14px,1.6vw,22px)">Подарочный</div><div style="font-weight:800;letter-spacing:.12em;text-transform:uppercase;font-size:clamp(16px,2vw,28px);color:#f3ebd6">сертификат</div>
  <div style="height:1px;background:rgba(200,180,140,.4);margin:10% 0 6%"></div><svg viewBox="44 44 819.75 391.25" style="width:46%;fill:#c8b48c"><use href="#pF"/><use href="#pA"/><use href="#pY"/><use href="#pB"/><use href="#pZ"/></svg></div></div>`);

/* sign flicker */
const sign=$('#sign');
const lightUp=()=>{if(sign.dataset.done)return;sign.dataset.done=1;const seq=[1,0,1,0,0,1];seq.forEach((s,i)=>setTimeout(()=>sign.classList.toggle('lit',!!s),i*110+80));};
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)lightUp()}),{threshold:.5}).observe(sign);
{const fl=$('#flip');pressable(fl,()=>{const on=fl.classList.toggle('on');fl.setAttribute('aria-pressed',String(on));});}

/* stickers */
const board=$('#stickers');
const ST=[
 `<svg width="150" height="150" viewBox="0 0 150 150"><circle cx="75" cy="75" r="72" fill="#1a422f" stroke="#c8b48c" stroke-width="3"/><svg x="45" y="38" width="60" height="70" viewBox="44 44 344.5 391.25" style="fill:url(#gGoldObj)"><use href="#pF"/></svg></svg>`,
 `<svg width="220" height="90" viewBox="0 0 220 90"><rect width="220" height="90" rx="16" fill="#f3ebd6"/><svg x="26" y="16" width="168" height="58" viewBox="44 44 819.75 391.25" style="fill:#1a422f"><use href="#pF"/><use href="#pA"/><use href="#pY"/><use href="#pB"/><use href="#pZ"/></svg></svg>`,
 `<svg width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="26" fill="#02110c" stroke="#c8b48c" stroke-width="2"/><svg x="34" y="26" width="52" height="68" viewBox="44 44 344.5 391.25" style="fill:#f3ebd6"><use href="#pF"/></svg></svg>`,
 `<svg width="170" height="170" viewBox="0 0 170 170"><defs><path id="sc1" d="M85,85 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0"/></defs><circle cx="85" cy="85" r="82" fill="#c8b48c"/><text font-family="UnifrakturMaguntia" font-size="19" fill="#02110c"><textPath href="#sc1" textLength="360">Faiz · Trust · Comfort · Choice ·</textPath></text><svg x="64" y="60" width="42" height="50" viewBox="44 44 344.5 391.25" style="fill:#02110c"><use href="#pF"/></svg></svg>`,
 `<svg width="200" height="80" viewBox="0 0 200 80"><rect width="200" height="80" rx="40" fill="#1a422f"/><text x="100" y="52" text-anchor="middle" font-family="UnifrakturMaguntia" font-size="36" fill="#f3ebd6">Quality</text></svg>`,
 `<svg width="140" height="140" viewBox="0 0 140 140"><circle cx="70" cy="70" r="68" fill="#f3ebd6"/><text x="70" y="82" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-size="34" fill="#1a422f">с 2026</text></svg>`
];
let stkZ=20;
const pos=[[6,10,-8],[30,48,5],[58,12,-4],[70,48,9],[18,62,6],[44,20,-12]];
ST.forEach((s,i)=>{const d=document.createElement('div');d.className='stk';d.innerHTML=s;d.style.left=pos[i][0]+'%';d.style.top=pos[i][1]+'%';d.style.transform=`rotate(${pos[i][2]}deg)`;board.appendChild(d);
  let sx,sy,ox,oy;d.addEventListener('pointerdown',e=>{if(e.button>0)return;try{d.setPointerCapture(e.pointerId)}catch(_){}sx=e.clientX;sy=e.clientY;ox=d.offsetLeft;oy=d.offsetTop;d.style.zIndex=++stkZ;
    const mv=ev=>{const bw=board.clientWidth-d.offsetWidth,bh=board.clientHeight-d.offsetHeight;d.style.left=Math.max(0,Math.min(bw,ox+ev.clientX-sx))+'px';d.style.top=Math.max(0,Math.min(bh,oy+ev.clientY-sy))+'px';};
    const up=()=>{d.removeEventListener('pointermove',mv);['pointerup','pointercancel','lostpointercapture'].forEach(t=>d.removeEventListener(t,up));};d.addEventListener('pointermove',mv);['pointerup','pointercancel','lostpointercapture'].forEach(t=>d.addEventListener(t,up));});});

/* ---------- seal constructor */
const ringIn=$('#ringIn'),ringTP=$('#ringB textPath');
ringIn.addEventListener('input',()=>{let v=ringIn.value.trim()||'ФАЙЗ';if(!/[·•]\s*$/.test(v))v+=' ·';ringTP.textContent=(v+' ').repeat(Math.max(1,Math.ceil(46/v.length))).trim();});
/* ---------- manifesto words */
const man=$('#manifest');{const words=man.textContent.split(' ');man.textContent='';words.forEach((w,i)=>{const sp=document.createElement('span');sp.className='w';sp.textContent=w;man.appendChild(sp);if(i<words.length-1)man.appendChild(document.createTextNode(' '));});}
const mw=$$('#manifest .w');

/* ---------- 3D merch rail */
const RAIL_ITEMS=[
  {type:'hoodie',body:'#121212',logo:'#efe9dc',name:'Худи на молнии',cn:'Чёрный',photo:'img/merch/hoodie.jpg',desc:'Оверсайз-худи на молнии с крупным логотипом на груди. Плотный футер, капюшон, карманы-кенгуру.'},
  {type:'tee',body:'#141414',logo:'#efe9dc',name:'Футболка',cn:'Чёрный',desc:'Хлопковая футболка свободного кроя с логотипом на груди.'},
  {type:'hoodie',body:'#1a422f',logo:'#efe9dc',name:'Худи на молнии',cn:'Изумруд',desc:'Худи в фирменном изумрудном цвете с кремовым логотипом.'},
  {type:'tee',body:'#e7dec6',logo:'#1a422f',name:'Футболка',cn:'Крем',desc:'Кремовая футболка с логотипом в оливковом цвете.'},
  {type:'tee',body:'#1a422f',logo:'#e3d2a6',name:'Футболка',cn:'Изумруд',desc:'Изумрудная футболка с логотипом цвета шампань.'}
];
const ACC=[{id:'cap',name:'Бейсболка',type:'Головные уборы',sizes:['S–M','L–XL'],def:'L–XL',desc:'Шестипанельная кепка с объёмной вышивкой логотипа. Регулируемый ремешок сзади.'},
           {id:'tote',name:'Шоппер',type:'Сумки',sizes:['Единый'],def:'Единый',desc:'Хлопковый шоппер с длинными ручками и печатью логотипа по центру.'},
           {id:'mug',name:'Кружка',type:'Посуда',sizes:['330 мл','450 мл'],def:'330 мл',desc:'Керамическая кружка с матовым покрытием и логотипом на лицевой стороне.'}];
const CLOTH_SIZES=['XS','S','M','L','XL','XXL'];

/* sheet */
const sheet=$('#sheet');let shSel=null,shFocus=null;
function openSheet(o){shFocus=document.activeElement;shSel={...o,s:o.def||'M'};drawSheet(true);sheet.classList.add('on');sheet.setAttribute('aria-hidden','false');lenis&&lenis.stop();setTimeout(()=>$('#shX').focus(),60);}
function drawSheet(img){const o=shSel;
  $('#shEy').textContent='Мерч ФАЙЗ · '+o.type;$('#shTitle').textContent=o.name+(o.cn?' · '+o.cn:'');$('#shDesc').textContent=o.desc;
  if(img){const pic=$('#shPic');pic.textContent='';const im=document.createElement('img');im.src=o.src;im.alt=o.name+' ФАЙЗ';pic.appendChild(im);
    if(o.note){const n=document.createElement('span');n.className='note';n.textContent=o.note;pic.appendChild(n);}}
  $('#shSzName').textContent=o.s;
  const szBox=$('#shSizes'),hadFocus=szBox.contains(document.activeElement);szBox.textContent='';
  o.sizes.forEach(s=>{const b=document.createElement('button');b.type='button';b.className='sz';b.textContent=s;b.setAttribute('aria-pressed',String(s===o.s));
    b.addEventListener('click',()=>{shSel.s=s;drawSheet(false);});szBox.appendChild(b);if(hadFocus&&s===o.s)b.focus();});
  $('#shSum').textContent=`Выбрано: ${o.name}${o.cn?' · '+o.cn:''} · ${o.s}`;}
function closeSheet(){if(!sheet.classList.contains('on'))return;sheet.classList.remove('on');sheet.setAttribute('aria-hidden','true');lenis&&lenis.start();shFocus&&shFocus.focus&&shFocus.focus({preventScroll:true});}
$('#shX').addEventListener('click',closeSheet);$('#shBd').addEventListener('click',closeSheet);
addEventListener('keydown',e=>{if(!sheet.classList.contains('on'))return;
  if(e.key==='Escape'){closeSheet();return;}
  if(e.key==='Tab'){const f=[...sheet.querySelectorAll('button:not([disabled])')];if(!f.length)return;const a=f[0],z=f[f.length-1];
    if(!sheet.contains(document.activeElement)){e.preventDefault();a.focus();}
    else if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}
    else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}});
// accessories (real photos)
$$('[data-acc]').forEach(b=>b.addEventListener('click',()=>{const a=ACC[+b.dataset.acc];openSheet({name:a.name,type:a.type,desc:a.desc,sizes:a.sizes,def:a.def,src:`img/merch/${a.id}.jpg`});}));

/* scrubber: caterpillar slider with arrows, shared by both merch galleries */
const ARR_L='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',ARR_R='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
function scrubber(root,{n,label,names,onSeek,onEnd,onStep}){
  root.textContent='';
  const mk=(tag,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;return e;};
  const prev=mk('button','arr');prev.type='button';prev.setAttribute('aria-label','Предыдущая вещь');prev.innerHTML=ARR_L;
  const next=mk('button','arr');next.type='button';next.setAttribute('aria-label','Следующая вещь');next.innerHTML=ARR_R;
  const tr=mk('div','scrub');tr.tabIndex=0;tr.setAttribute('role','slider');tr.setAttribute('aria-label',label);tr.setAttribute('aria-valuemin','1');tr.setAttribute('aria-valuemax',String(n));
  const segs=[];for(let i=0;i<n;i++){const sg=mk('i');segs.push(sg);tr.appendChild(sg);}
  const th=mk('span','th');tr.appendChild(th);
  const cnt=mk('span','cnt');
  root.append(prev,tr,next,cnt);
  let p=0,idx=-1,dragging=false;
  const pad=v=>String(v).padStart(2,'0');
  function set(v,i){p=Math.max(0,Math.min(1,v));if(i==null)i=Math.round(p*(n-1));
    const W=tr.clientWidth,sw=segs[0].offsetWidth||W/n;th.style.width=sw+'px';th.style.transform=`translate(${p*(W-sw)}px,-50%)`;
    const at=p*(n-1);segs.forEach((sg,k)=>{const d=Math.abs(k-at);sg.style.height=(4+9*Math.max(0,1-d/1.5))+'px';sg.classList.toggle('near',d<1.5);});
    if(i!==idx){idx=i;cnt.textContent=`${pad(i+1)} / ${pad(n)}`;tr.setAttribute('aria-valuenow',String(i+1));tr.setAttribute('aria-valuetext',names[i]||String(i+1));prev.disabled=i<=0;next.disabled=i>=n-1;}}
  const seekX=x=>{const r=tr.getBoundingClientRect(),sw=segs[0].offsetWidth||r.width/n;onSeek(Math.max(0,Math.min(1,(x-r.left-sw/2)/Math.max(1,r.width-sw))));};
  tr.addEventListener('pointerdown',e=>{if(e.button>0)return;e.preventDefault();dragging=true;tr.classList.add('drag');try{tr.setPointerCapture(e.pointerId)}catch(_){}seekX(e.clientX);});
  tr.addEventListener('pointermove',e=>{if(dragging)seekX(e.clientX);});
  const end=()=>{if(!dragging)return;dragging=false;tr.classList.remove('drag');onEnd();};
  ['pointerup','pointercancel','lostpointercapture'].forEach(t=>tr.addEventListener(t,end));
  tr.addEventListener('keydown',e=>{const k=e.key;if(k==='ArrowRight'||k==='ArrowUp'){e.preventDefault();onStep(1);}else if(k==='ArrowLeft'||k==='ArrowDown'){e.preventDefault();onStep(-1);}
    else if(k==='Home'){e.preventDefault();onStep(-n);}else if(k==='End'){e.preventDefault();onStep(n);}});
  prev.addEventListener('click',()=>onStep(-1));next.addEventListener('click',()=>onStep(1));
  addEventListener('resize',()=>set(p,idx));
  set(0);return {set};}

/* 3D rail */
(function(){
const cv=$('#railCv'); if(!window.THREE){$('#railLoad').textContent='3D недоступно в этом браузере';return;}
let renderer;try{renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});}catch(e){$('#railLoad').textContent='3D недоступно в этом браузере';return;}
renderer.setPixelRatio(Math.min(2,devicePixelRatio||1));renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
const scene=new THREE.Scene();
const pm=new THREE.PMREMGenerator(renderer);if(THREE.RoomEnvironment)scene.environment=pm.fromScene(new THREE.RoomEnvironment(),0.04).texture;
const cam=new THREE.PerspectiveCamera(30,1,0.1,100);
const key=new THREE.DirectionalLight(0xfff1d6,1.1);key.position.set(-2,3,4);scene.add(key);
const rim=new THREE.DirectionalLight(0x7fe0b0,.6);rim.position.set(3,1,-3);scene.add(rim);
scene.add(new THREE.AmbientLight(0xffffff,.18));
const GAP=1.95,N=RAIL_ITEMS.length,RAILY=0.36;
// rail
const gold=new THREE.MeshStandardMaterial({color:0xc8a86a,metalness:1,roughness:.28});
const rail=new THREE.Mesh(new THREE.CylinderGeometry(.028,.028,GAP*(N-1)+4,24),gold);rail.rotation.z=Math.PI/2;rail.position.set(GAP*(N-1)/2,RAILY,0);scene.add(rail);
[-2+0.02,GAP*(N-1)+2-0.02].forEach(x=>{const c=new THREE.Mesh(new THREE.SphereGeometry(.05,20,16),gold);c.position.set(x,RAILY,0);scene.add(c);});
// fabric bump
const nz=document.createElement('canvas');nz.width=nz.height=256;{const c=nz.getContext('2d'),d=c.createImageData(256,256);for(let i=0;i<256*256;i++){const x=i%256,y=(i/256)|0;const v=128+40*Math.sin(x*1.6)*Math.sin(y*.8)+Math.random()*50-25;d.data[i*4]=d.data[i*4+1]=d.data[i*4+2]=v;d.data[i*4+3]=255;}c.putImageData(d,0,0);}
const bump=new THREE.CanvasTexture(nz);bump.wrapS=bump.wrapT=THREE.RepeatWrapping;bump.repeat.set(10,10);
// outlines (right halves, top -> bottom)
const OUT={tee:[[0,-.11],[.09,-.07],[.16,0],[.3,-.03],[.46,-.08],[.6,-.18],[.78,-.36],[.71,-.45],[.64,-.52],[.47,-.42],[.47,-.8],[.48,-1.2],[.47,-1.46],[.3,-1.48],[0,-1.49]],
           hoodie:[[0,.34],[.12,.32],[.22,.24],[.27,.11],[.29,-.02],[.42,-.08],[.55,-.14],[.66,-.3],[.76,-.6],[.84,-1.0],[.89,-1.3],[.87,-1.43],[.72,-1.45],[.7,-1.3],[.62,-.85],[.53,-.56],[.53,-1.0],[.54,-1.4],[.5,-1.56],[.3,-1.58],[0,-1.58]]};
function outline(type){const r=OUT[type];const pts=[...r,...r.slice(1,-1).reverse().map(([x,y])=>[-x,y])];
  const curve=new THREE.CatmullRomCurve3(pts.map(([x,y])=>new THREE.Vector3(x,y,0)),true,'centripetal');return curve.getSpacedPoints(360).slice(0,-1).map(v=>[v.x,v.y]);}
function inside(poly,x,y){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c;}return c;}
function nearest(poly,x,y){let best=1e9,bx=0,by=0;for(let i=0;i<poly.length;i++){const [ax,ay]=poly[i],[cx,cy]=poly[(i+1)%poly.length];const dx=cx-ax,dy=cy-ay;let t=((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy);t=Math.max(0,Math.min(1,t));const px=ax+t*dx,py=ay+t*dy,d=(px-x)**2+(py-y)**2;if(d<best){best=d;bx=px;by=py;}}return [bx,by,Math.sqrt(best)];}
function surface(type){const poly=outline(type);let minx=1e9,maxx=-1e9,miny=1e9,maxy=-1e9;poly.forEach(([x,y])=>{minx=Math.min(minx,x);maxx=Math.max(maxx,x);miny=Math.min(miny,y);maxy=Math.max(maxy,y);});
  const NX=110,NY=Math.round(NX*(maxy-miny)/(maxx-minx));const W=maxx-minx,H=maxy-miny;
  const pos=[],uv=[],ins=[],idx=[];const R=type==='hoodie'?.16:.13,T=type==='hoodie'?.12:.085;
  for(let j=0;j<=NY;j++)for(let i=0;i<=NX;i++){let x=minx+W*i/NX,y=miny+H*j/NY;const inn=inside(poly,x,y);let d;
    const [bx,by,dist]=nearest(poly,x,y);if(!inn){x=bx;y=by;d=0;}else d=dist;
    const k=Math.min(1,d/R);let z=T*(1-(1-k)*(1-k));
    const torso=Math.abs(x)<.5?1:Math.max(0,1-(Math.abs(x)-.5)/.12);
    z+=torso*.06*Math.cos(x*1.9)*k; z+=(.007*Math.sin(y*13+x*5)+.004*Math.sin(x*21-y*7))*k;
    if(type==='hoodie'&&Math.abs(x)<.2&&y>-.2) z-=.05*k*(1-Math.abs(x)/.2);
    pos.push(x,y,z);uv.push((x-minx)/W,(y-miny)/H);ins.push(inn);}
  for(let j=0;j<NY;j++)for(let i=0;i<NX;i++){const a=j*(NX+1)+i,b=a+1,c=a+NX+1,d=c+1;if(ins[a]||ins[b]||ins[c])idx.push(a,b,c);if(ins[b]||ins[d]||ins[c])idx.push(b,d,c);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
  return {g,box:{minx,maxx,miny,maxy,W,H}};}
const SURF={tee:surface('tee'),hoodie:surface('hoodie')};
const LP=['pF','pA','pY','pB','pZ'].map(id=>new Path2D(document.getElementById(id).getAttribute('d')));
function skin(it,front){const {box}=SURF[it.type];const CW=1024,CH=Math.round(CW*box.H/box.W);const c=document.createElement('canvas');c.width=CW;c.height=CH;const x=c.getContext('2d');
  const X=u=>(u-box.minx)/box.W*CW,Y=v=>(box.maxy-v)/box.H*CH,S=CW/box.W;
  x.fillStyle=it.body;x.fillRect(0,0,CW,CH);
  const light=parseInt(it.body.slice(1,3),16)>120;const line=light?'rgba(0,0,0,.18)':'rgba(255,255,255,.07)',dark=light?'rgba(0,0,0,.12)':'rgba(0,0,0,.45)';
  x.lineWidth=3;x.strokeStyle=line;
  if(it.type==='hoodie'){
    if(front){x.fillStyle=dark;x.beginPath();x.ellipse(X(0),Y(.1),.17*S,.2*S,0,0,7);x.fill();
      x.strokeStyle=light?'rgba(0,0,0,.35)':'rgba(255,255,255,.18)';x.lineWidth=4;x.beginPath();x.moveTo(X(0),Y(-.12));x.lineTo(X(0),Y(-1.54));x.stroke();
      x.lineWidth=3;x.strokeStyle=line;x.beginPath();x.moveTo(X(-.3),Y(-.98));x.lineTo(X(.3),Y(-.98));x.lineTo(X(.38),Y(-1.34));x.lineTo(X(-.38),Y(-1.34));x.closePath();x.stroke();
      x.lineWidth=4;x.strokeStyle=light?'rgba(0,0,0,.2)':'rgba(200,200,200,.18)';[-.07,.07].forEach(dx=>{x.beginPath();x.moveTo(X(dx),Y(-.08));x.quadraticCurveTo(X(dx*1.6),Y(-.3),X(dx*1.2),Y(-.48));x.stroke();});}
    x.fillStyle=dark;x.fillRect(X(-.54),Y(-1.47),(1.08)*S,.1*S);
    [[.7,-1.32],[-.89,-1.32]].forEach(([u,v])=>{x.fillRect(X(u),Y(v),.19*S,.12*S);});
  }else{
    if(front){x.strokeStyle=light?'rgba(0,0,0,.3)':'rgba(255,255,255,.12)';x.lineWidth=10;x.beginPath();x.moveTo(X(-.165),Y(0));x.quadraticCurveTo(X(0),Y(-.2),X(.165),Y(0));x.stroke();}
    x.strokeStyle=line;x.lineWidth=3;x.beginPath();x.moveTo(X(-.47),Y(-1.4));x.lineTo(X(.47),Y(-1.4));x.stroke();
    [[.64,-.46],[-.64,-.46]].forEach(()=>{});
  }
  if(front){const w=it.type==='hoodie'?.86:.62,cy=it.type==='hoodie'?-.55:-.42;const s=w*S/787.75;
    x.save();x.translate(X(-w/2),Y(cy)-359.25*s/2);x.scale(s,s);x.translate(-60,-60);x.fillStyle=it.logo;LP.forEach(p=>x.fill(p));x.restore();}
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t;}
function hanger(){const g=new THREE.Group();
  const bar=new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(-.45,-.03,0),new THREE.Vector3(0,.16,0),new THREE.Vector3(.45,-.03,0)),40,.018,10,false);
  g.add(new THREE.Mesh(bar,gold));
  const stem=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,.17,10),gold);stem.position.set(0,.165,0);g.add(stem);
  const hook=new THREE.Mesh(new THREE.TorusGeometry(.045,.008,10,30,Math.PI*1.35),gold);hook.position.set(0,RAILY-.0,0);hook.rotation.z=-Math.PI*.18;hook.rotation.y=Math.PI/2;g.add(hook);
  return g;}
const groups=[];
RAIL_ITEMS.forEach((it,i)=>{const pivot=new THREE.Group();pivot.position.set(i*GAP,RAILY,0);scene.add(pivot);
  const g=new THREE.Group();g.position.y=-RAILY;pivot.add(g);
  const hg=hanger();hg.position.y=-.02;g.add(hg);
  const top=new THREE.Group();top.position.y=it.type==='hoodie'?-.1:-.04;g.add(top);
  const {g:geo}=SURF[it.type];
  const mF=new THREE.MeshStandardMaterial({map:skin(it,true),roughness:.92,metalness:0,bumpMap:bump,bumpScale:.0025});
  const mB=new THREE.MeshStandardMaterial({map:skin(it,false),roughness:.95,metalness:0,bumpMap:bump,bumpScale:.0025});
  const f=new THREE.Mesh(geo,mF);const b=new THREE.Mesh(geo,mB);b.scale.z=-1;mB.side=THREE.DoubleSide;mF.side=THREE.DoubleSide;
  top.add(f,b);
  f.userData.i=i;b.userData.i=i;
  const hit=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.9),new THREE.MeshBasicMaterial({visible:false}));hit.position.set(i*GAP,-.55,0);hit.userData.i=i;scene.add(hit);
  groups.push({pivot,it,yaw:Math.PI*.44,target:Math.PI*.44,hold:false,meshes:[f,b],hit,sw:Math.random()*6,back:0});});
const SIDE=Math.PI*.44;
// camera / navigation: drag the rail, use the scrubber, arrows or keyboard
let pos=0,posV=0,camX=0;
function size(){const r=cv.getBoundingClientRect();renderer.setSize(r.width,r.height,false);cam.aspect=r.width/r.height;cam.updateProjectionMatrix();}
size();addEventListener('resize',size);
const clampP=v=>Math.max(0,Math.min(N-1,v));
const goTo=i=>{pos=clampP(Math.round(i));};
// pixels on screen per one step between garments, so the rail follows the finger exactly
const pxPerStep=()=>{const r=cv.getBoundingClientRect();const z=cam.position.z||5.4;return Math.max(1,r.width/(2*z*Math.tan(THREE.MathUtils.degToRad(cam.fov/2))*cam.aspect)*GAP);};
let curI=-1;
const scr=scrubber($('#railCtl'),{n:N,label:'Одежда на штанге',names:RAIL_ITEMS.map(it=>it.name+' · '+it.cn),
  onSeek:p=>{pos=p*(N-1);},onEnd:()=>goTo(pos),onStep:d=>goTo(Math.round(pos)+d)});
// interaction
let visible=true;
const ray=new THREE.Raycaster(),mp=new THREE.Vector2();
let held=null,holdT=0,downT=0,downX=0,downY=0,moved=false,drag=null,downG=null;
function pick(e){const r=cv.getBoundingClientRect();mp.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(mp,cam);
  const hit=ray.intersectObjects(groups.map(g=>g.hit),false)[0];return hit?groups[hit.object.userData.i]:null;}
function releaseHold(){if(!held)return;const g=held;held=null;g.hold=false;cv.classList.remove('hold');g.back=performance.now()+1400;}
cv.addEventListener('pointerdown',e=>{if(e.button>0)return;downT=performance.now();downX=e.clientX;downY=e.clientY;moved=false;downG=pick(e);
  drag={startPos:pos,lastX:e.clientX,lastT:downT,v:0,active:false,id:e.pointerId};
  clearTimeout(holdT);if(downG)holdT=setTimeout(()=>{if(!moved&&drag){held=downG;held.hold=true;held.target=0;cv.classList.add('hold');}},220);});
addEventListener('pointermove',e=>{
  if(!drag){if(!visible||e.target!==cv||e.pointerType!=='mouse')return;cv.style.cursor=pick(e)?'pointer':'grab';return;}
  const dx=e.clientX-downX,dy=e.clientY-downY;
  if(!drag.active){
    if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)){drag.active=true;moved=true;clearTimeout(holdT);releaseHold();cv.classList.add('drag');try{cv.setPointerCapture(drag.id)}catch(_){}}
    else{if(Math.abs(dy)>10)moved=true;return;}}
  const now=performance.now();pos=Math.max(-.35,Math.min(N-1+.35,drag.startPos-dx/pxPerStep()));
  drag.v=(e.clientX-drag.lastX)/Math.max(1,now-drag.lastT);drag.lastX=e.clientX;drag.lastT=now;});
addEventListener('pointerup',()=>{if(!drag)return;clearTimeout(holdT);const d=drag;drag=null;cv.classList.remove('drag');
  if(d.active){goTo(pos-Math.max(-1.4,Math.min(1.4,d.v*180/pxPerStep())));return;}            // fling to the nearest garment
  const wasHeld=!!held;releaseHold();
  if(!moved&&downG&&performance.now()-downT<700){const i=groups.indexOf(downG);if(i!==Math.round(pos)&&!wasHeld)goTo(i);else open3d(downG);}});
addEventListener('pointercancel',()=>{clearTimeout(holdT);if(drag&&drag.active)goTo(pos);drag=null;releaseHold();cv.classList.remove('drag');});
// horizontal trackpad swipe moves the rail; vertical wheel keeps scrolling the page
let wT=0;cv.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)<=Math.abs(e.deltaY))return;e.preventDefault();pos=Math.max(-.35,Math.min(N-1+.35,pos+e.deltaX/pxPerStep()));clearTimeout(wT);wT=setTimeout(()=>goTo(pos),140);},{passive:false});
cv.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();goTo(Math.round(pos)+1);}else if(e.key==='ArrowLeft'){e.preventDefault();goTo(Math.round(pos)-1);}
  else if(e.key==='Enter'||e.key===' '){e.preventDefault();open3d(groups[clampP(Math.round(pos))]);}});
function open3d(g){const it=g.it;let src=it.photo,note='';
  if(!src){src=snapshot(g);note='3D-превью · фото появится после съёмки';}
  openSheet({name:it.name,cn:it.cn,type:'Одежда',desc:it.desc,sizes:CLOTH_SIZES,def:'M',src,note});}
function snapshot(g){const keep={yaw:g.yaw,x:cam.position.x,y:cam.position.y,z:cam.position.z,bg:scene.background};
  g.pivot.rotation.y=0;g.pivot.rotation.z=0;scene.background=new THREE.Color(0xe9e7e2);
  const r=cv.getBoundingClientRect(),asp=r.width/r.height;const dist=(g.it.type==='hoodie'?2.2:2.0)/Math.tan(THREE.MathUtils.degToRad(cam.fov/2))/2*Math.max(1,1/asp);
  groups.forEach(o=>o.pivot.visible=o===g);rail.visible=false;
  cam.position.set(g.pivot.position.x,-.45,dist);cam.lookAt(g.pivot.position.x,-.5,0);renderer.render(scene,cam);
  const url=cv.toDataURL('image/jpeg',.9);
  groups.forEach(o=>o.pivot.visible=true);rail.visible=true;scene.background=keep.bg;g.yaw=keep.yaw;return url;}
// loop
new IntersectionObserver(es=>es.forEach(en=>visible=en.isIntersecting)).observe(cv);
$('#railLoad').remove();
let last=performance.now();
(function tick(now){requestAnimationFrame(tick);if(!visible)return;const dt=Math.min(.05,(now-last)/1000);last=now;
  if(!drag||!drag.active){if(pos<0||pos>N-1)pos+= (clampP(pos)-pos)*Math.min(1,dt*10);}
  posV+=(pos-posV)*Math.min(1,dt*(drag&&drag.active?20:7));camX=posV*GAP;
  const asp=cam.aspect;const z=asp<.8?8.2:(asp<1.2?6.4:5.4);
  cam.position.set(camX,-.2,z);cam.lookAt(camX,-.58,0);
  const ci=Math.max(0,Math.min(N-1,Math.round(posV)));if(ci!==curI){curI=ci;$('#railName').textContent=RAIL_ITEMS[ci].name+' · '+RAIL_ITEMS[ci].cn;$('#railType').textContent=RAIL_ITEMS[ci].type==='hoodie'?'Худи':'Футболка';}
  scr.set(clampP(posV)/(N-1),ci);
  groups.forEach(g=>{if(!g.hold&&g.back&&now>g.back){g.target=SIDE;g.back=0;}
    g.yaw+=(g.target-g.yaw)*Math.min(1,dt*(g.hold?5:2.4));
    g.sw+=dt;const swing=reduce?0:Math.sin(g.sw*1.3)*.025*(1-Math.min(1,Math.abs(g.target-g.yaw)));
    g.pivot.rotation.y=g.yaw;g.pivot.rotation.z=swing+(g.target-g.yaw)*.05;});
  renderer.render(scene,cam);})(last);
})();


/* ---------- accessories gallery: swipe / drag / scrubber */
(()=>{
const track=$('#track'),items=$$('#track .item');if(!track||!items.length)return;
const maxS=()=>Math.max(1,track.scrollWidth-track.clientWidth);
const nearest=sl=>{if(sl<=2)return 0;if(sl>=maxS()-2)return items.length-1;const c=sl+track.clientWidth/2;let b=0,bd=1e9;items.forEach((it,i)=>{const d=Math.abs(it.offsetLeft+it.offsetWidth/2-c);if(d<bd){bd=d;b=i;}});return b;};
const toItem=(i,smooth=true)=>{i=Math.max(0,Math.min(items.length-1,i));const it=items[i];track.scrollTo({left:Math.max(0,Math.min(maxS(),it.offsetLeft-(track.clientWidth-it.offsetWidth)/2)),behavior:smooth&&!reduce?'smooth':'auto'});};
const hs=scrubber($('#hsCtl'),{n:items.length,label:'Аксессуары и полиграфия',names:items.map(it=>{const b=it.querySelector('.meta b');return b?b.textContent:'';}),
  onSeek:p=>{track.classList.add('seek');track.scrollLeft=p*maxS();},onEnd:()=>{track.classList.remove('seek');toItem(nearest(track.scrollLeft));},onStep:d=>toItem(nearest(track.scrollLeft)+d)});
const sync=()=>hs.set(track.scrollLeft/maxS(),nearest(track.scrollLeft));
track.addEventListener('scroll',sync,{passive:true});addEventListener('resize',sync);
// mouse drag (touch already swipes natively)
let hd=null,suppress=0;
track.querySelectorAll('img').forEach(im=>im.draggable=false);
track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button>0)return;hd={x:e.clientX,sl:track.scrollLeft,moved:false,id:e.pointerId,v:0,lx:e.clientX,lt:performance.now()};});
track.addEventListener('pointermove',e=>{if(!hd)return;const dx=e.clientX-hd.x;
  if(!hd.moved&&Math.abs(dx)>6){hd.moved=true;track.classList.add('drag');try{track.setPointerCapture(hd.id)}catch(_){}}
  if(hd.moved){track.scrollLeft=hd.sl-dx;const n=performance.now();hd.v=(e.clientX-hd.lx)/Math.max(1,n-hd.lt);hd.lx=e.clientX;hd.lt=n;}});
const hdEnd=()=>{if(!hd)return;const d=hd;hd=null;if(!d.moved)return;track.classList.remove('drag');suppress=performance.now()+80;toItem(nearest(track.scrollLeft-Math.max(-track.clientWidth*.6,Math.min(track.clientWidth*.6,d.v*220))));};
['pointerup','pointercancel','lostpointercapture'].forEach(t=>track.addEventListener(t,hdEnd));
// a drag must not count as a click on the photo underneath
track.addEventListener('click',e=>{if(performance.now()<suppress){e.preventDefault();e.stopPropagation();}},true);
sync();
})();

/* ---------- store tour */
(()=>{
const app=document.getElementById('tour'); if(!app) return;
const S=[
  {id:'facade',name:'Фасад',zone:'Улица',img:'img/facade.jpg?v=5',f:[.46,.6],
   text:'Неоновая вывеска, панорамные витрины и узор из фирменных завитков. Дверь подсвечена — заходите.',
   door:{x:37.4,y:39.5,w:17.3,h:54.5},spots:[]},
  {id:'main',name:'Главный зал',zone:'Зал',img:'img/interior.jpg?v=5',f:[.5,.5],
   text:'Стеклянные стеллажи с подсветкой каждой полки. Весь ассортимент стоит на виду.',
   spots:[{x:35,y:60,to:'counter',label:'Стойка'},{x:80,y:40,to:'shelves',label:'Стеллажи'},
          {x:23,y:11,info:'Над стеллажами — перечень разделов магазина, чтобы сразу найти нужное.'}]},
  {id:'counter',name:'Стойка',zone:'Касса',img:'img/counter.jpg?v=5',f:[.5,.38],
   text:'Брендированная стойка с подсвеченным логотипом. Покупки упаковывают в фирменные пакеты ФАЙЗ.',
   spots:[{x:58,y:13,info:'Логотип на панели с контурной подсветкой.'},
          {x:12,y:30,info:'Стена с крупной типографикой в фирменном зелёном.'},
          {x:55,y:38,to:'shelves',label:'К стеллажам'},
          {x:22,y:55,info:'Фирменные пакеты ФАЙЗ — чёрные, с логотипом.'}]},
  {id:'shelves',name:'Стеллажи',zone:'Ассортимент',img:'img/shelves.jpg?v=5',f:[.5,.45],
   text:'Позиции разложены по линейкам, подсветка по краю полки делает каждую позицию читаемой.',
   spots:[{x:40,y:34,info:'Флаконы расставлены по брендам.'},{x:48,y:66,to:'consult',label:'Консультация'}]},
  {id:'consult',name:'Консультация',zone:'Сервис',img:'img/consult.jpg?v=5',f:[.5,.45],
   text:'Консультант поможет подобрать нужное и объяснит разницу между линейками.',
   spots:[{x:52,y:41,info:'Подбор прямо у витрины: консультант показывает линейки и объясняет разницу.'},{x:84,y:30,to:'lifestyle',label:'Зона отдыха'}]},
  {id:'lifestyle',name:'Зона отдыха',zone:'Отдых',img:'img/lifestyle.jpg?v=5',f:[.5,.55],
   text:'Кресло, столик и вид на улицу через витрину с логотипом. Место, где можно не спешить.',
   spots:[{x:55,y:66,info:'Мягкое кресло и столик — можно присесть и спокойно рассмотреть покупку.',left:true},{x:86,y:42,to:'main',label:'Обратно в зал',left:true}]}
];
const idx=id=>S.findIndex(s=>s.id===id), N=S.length-1, $t=id=>document.getElementById(id);
const L=[0,1].map(i=>{const el=$t('tL'+i);return{el,blur:el.querySelector('.blur'),stage:el.querySelector('.stage'),inner:el.querySelector('.inner'),img:el.querySelector('img'),spots:el.querySelector('.spots'),x:0,y:0,w:0,h:0,scene:-1}});
const rd=matchMedia('(prefers-reduced-motion: reduce)').matches, dims={}, ready={};
let cur=0,at=-1,busy=false,moved=false,down=null,inView=false;
S.forEach(s=>{ready[s.id]=new Promise(res=>{const im=new Image();im.onload=()=>{dims[s.id]=[im.naturalWidth,im.naturalHeight];res()};im.onerror=()=>{dims[s.id]=[1600,1000];res()};im.src=s.img;})});
function fit(l,keep){const s=S[l.scene];if(!s)return;const [iw,ih]=dims[s.id]||[1600,1000];const vw=app.clientWidth,vh=app.clientHeight;
  const contain=vw/vh>1.05&&iw/ih<1;const sc=contain?Math.min(vw/iw,vh/ih):Math.max(vw/iw,vh/ih);
  l.w=iw*sc;l.h=ih*sc;l.el.classList.toggle('contain',contain);l.stage.style.width=l.w+'px';l.stage.style.height=l.h+'px';
  if(!keep){l.x=vw/2-s.f[0]*l.w;l.y=vh/2-s.f[1]*l.h;}clamp(l);place(l);}
function clamp(l){const vw=app.clientWidth,vh=app.clientHeight;l.x=l.w<=vw?(vw-l.w)/2:Math.min(0,Math.max(vw-l.w,l.x));l.y=l.h<=vh?(vh-l.h)/2:Math.min(0,Math.max(vh-l.h,l.y));}
function place(l){l.stage.style.transform=`translate3d(${l.x}px,${l.y}px,0)`;}
const pannable=l=>l.w>app.clientWidth+2||l.h>app.clientHeight+2;
function build(l,i){const s=S[i];l.scene=i;l.img.src=s.img;l.img.alt=s.name;l.blur.style.backgroundImage=`url(${s.img})`;l.spots.innerHTML='';
  if(s.door){const d=document.createElement('button');d.className='door';d.setAttribute('aria-label','Войти в магазин');
    Object.assign(d.style,{left:s.door.x+'%',top:s.door.y+'%',width:s.door.w+'%',height:s.door.h+'%'});d.innerHTML='<span class="tag">Нажмите, чтобы войти</span>';
    d.addEventListener('click',e=>{if(moved)return;e.stopPropagation();enter();});l.spots.appendChild(d);}
  s.spots.forEach(p=>{const b=document.createElement('button');b.className='spot'+(p.info?' info':'')+(p.left?' left':'');b.style.left=p.x+'%';b.style.top=p.y+'%';
    {const dot=document.createElement('span');dot.className='dot';const tg=document.createElement('span');tg.className='tag';tg.textContent=p.info?p.info:p.label+' →';b.append(dot,tg);}
    if(p.info){b.setAttribute('aria-label',p.info);b.addEventListener('click',e=>{if(moved)return;e.stopPropagation();const o=b.classList.contains('open');l.spots.querySelectorAll('.open').forEach(x=>x.classList.remove('open'));if(!o)b.classList.add('open');});}
    else{b.setAttribute('aria-label','Перейти: '+p.label);b.addEventListener('click',e=>{if(moved)return;e.stopPropagation();go(idx(p.to),{origin:[p.x,p.y]});});}
    l.spots.appendChild(b);});}
function ui(i){const s=S[i],card=$t('tCard');card.classList.add('out');
  setTimeout(()=>{$t('tEy').textContent=i===0?'Улица · вход с тротуара':`${s.zone} · точка ${String(i).padStart(2,'0')}`;
    $t('tTitle').textContent=i===0?'Добро пожаловать в ФАЙЗ':s.name;$t('tDesc').textContent=s.text;
    $t('tGo').textContent=i===0?'Войти внутрь →':(i===N?'Начать заново →':'Дальше →');
    $t('tCount').textContent=`${String(i).padStart(2,'0')} / ${String(N).padStart(2,'0')}`;
    $t('tPrev').disabled=i===0;$t('tNext').disabled=i===N;
    app.querySelectorAll('.stop').forEach((b,k)=>b.classList.toggle('cur',k===i));
    const c=app.querySelector('.stop.cur');if(c){const r=$t('tRail');r.scrollTo({left:c.offsetLeft-r.clientWidth/2+c.clientWidth/2,behavior:rd?'auto':'smooth'});}
    card.classList.remove('out');},at<0?0:260);}
let hintT;function hint(){const l=L[cur],h=$t('tHint');app.classList.toggle('grab',pannable(l));clearTimeout(hintT);h.classList.remove('show');
  if(pannable(l)&&S[l.scene].id!=='facade'&&inView){h.classList.add('show');hintT=setTimeout(()=>h.classList.remove('show'),2400);}}
async function show(i,origin,isEnter){if(busy||i===at)return;busy=true;await ready[S[i].id];
  const out=L[cur],inn=L[1-cur];build(inn,i);fit(inn);const T=rd?0:1;
  inn.inner.style.transition='none';inn.inner.style.transformOrigin='50% 50%';inn.inner.style.transform=`scale(${rd?1:1.1})`;
  inn.el.style.transition='none';inn.el.style.opacity=0;inn.el.classList.add('on');void inn.el.offsetWidth;
  if(at>=0){const [ox,oy]=origin||[50,50];out.inner.style.transformOrigin=`${ox}% ${oy}%`;
    out.inner.style.transition=`transform ${isEnter?1.2:.95}s cubic-bezier(.6,.05,.4,1)`;out.inner.style.transform=`scale(${rd?1:(isEnter?3:1.35)})`;
    out.el.style.transition=`opacity ${.7*T+.01}s ease ${isEnter?.55*T:.3*T}s`;out.el.style.opacity=0;out.el.classList.remove('on');
    if(isEnter&&!rd){const f=$t('tFlash'),r=out.stage.getBoundingClientRect(),a=app.getBoundingClientRect();
      f.style.setProperty('--fx',(r.left-a.left+r.width*ox/100)+'px');f.style.setProperty('--fy',(r.top-a.top+r.height*oy/100)+'px');
      f.animate([{opacity:0},{opacity:.95,offset:.55},{opacity:0}],{duration:1500,easing:'ease-in-out'});}}
  const d=at<0?0:(isEnter?.75:.4)*T;inn.el.style.transition=`opacity ${.8*T+.01}s ease ${d}s`;inn.el.style.opacity=1;
  inn.inner.style.transition=`transform ${1.5*T+.01}s cubic-bezier(.2,.7,.2,1) ${d}s`;inn.inner.style.transform='scale(1)';
  cur=1-cur;at=i;ui(i);
  setTimeout(()=>{out.inner.style.transition='none';out.inner.style.transform='scale(1)';out.el.style.opacity='';busy=false;hint();},(d+.9)*1000*T+30);}
function go(i,o={}){i=Math.max(0,Math.min(N,i));show(i,o.origin,false);}
function enter(){const d=S[0].door;show(1,[d.x+d.w/2,d.y+d.h/2],true);}
function step(dir){if(at===0&&dir>0)return enter();if(at===N&&dir>0)return go(0);go(at+dir,{origin:dir>0?[70,50]:[30,50]});}
S.forEach((s,k)=>{const b=document.createElement('button');b.className='stop';{const n=document.createElement('i');n.textContent=String(k).padStart(2,'0');b.append(n,document.createTextNode(s.name));}
  b.addEventListener('click',()=>{if(at===0&&k>0){if(k===1)enter();else show(k,[S[0].door.x+8,66],true);}else go(k);});$t('tRail').appendChild(b);});
$t('tGo').addEventListener('click',()=>step(1));$t('tNext').addEventListener('click',()=>step(1));$t('tPrev').addEventListener('click',()=>step(-1));
addEventListener('keydown',e=>{if(!inView||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||document.querySelector('#sheet.on'))return;
  const ae=document.activeElement;if(ae&&(/INPUT|TEXTAREA|SELECT/.test(ae.tagName)||ae.isContentEditable))return;
  if(e.key==='ArrowRight')step(1);else if(e.key==='ArrowLeft')step(-1);});
app.addEventListener('pointerdown',e=>{if(e.button>0||e.target.closest('.card,.rail,.ttop'))return;const l=L[cur];down={x:e.clientX,y:e.clientY,lx:l.x,ly:l.y,pan:pannable(l)};moved=false;});
addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.abs(dx)+Math.abs(dy)>6){moved=true;if(down.pan)app.classList.add('grabbing');}
  if(down.pan&&moved){const l=L[cur];l.x=down.lx+dx;l.y=down.ly+dy;clamp(l);place(l);$t('tHint').classList.remove('show');}});
addEventListener('pointerup',e=>{if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;
  if(!down.pan&&moved&&Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy))step(dx<0?1:-1);
  if(!moved)L[cur].spots.querySelectorAll('.open').forEach(x=>x.classList.remove('open'));
  app.classList.remove('grabbing');down=null;setTimeout(()=>{moved=false},0);});
addEventListener('pointercancel',()=>{down=null;moved=false;app.classList.remove('grabbing');});
if(window.ResizeObserver)new ResizeObserver(()=>{L.forEach(l=>l.scene>=0&&fit(l,true));}).observe(app);
new IntersectionObserver(es=>es.forEach(en=>{inView=en.isIntersecting;if(inView)hint();}),{threshold:.4}).observe(app);
show(0);
})();

/* ---------- GSAP choreography */
if(hasG&&!reduce){
  gsap.registerPlugin(ScrollTrigger);
  // hero: scroll pushes rings outward and spins them
  ScrollTrigger.create({trigger:'#hero',start:'top top',end:'bottom top',scrub:true,onUpdate:s=>{H.out=s.progress;H.boost=Math.max(H.boost,Math.min(3,Math.abs(s.getVelocity())/900));}});
  gsap.to('#sealWrap',{yPercent:16,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('#hero .hud',{opacity:0,y:-40,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'40% top',scrub:true}});
  // split headings into letters
  $$('h2.h').forEach(h2=>{const lines=[];let buf='';h2.childNodes.forEach(n=>{if(n.nodeName==='BR'){lines.push(buf);buf='';}else buf+=n.textContent;});lines.push(buf);
    h2.setAttribute('aria-label',lines.map(l=>l.trim()).join(' '));h2.textContent='';
    lines.forEach((ln,li)=>{if(li)h2.appendChild(document.createElement('br'));ln.trim().split(/\s+/).filter(Boolean).forEach((w,wi)=>{if(wi)h2.appendChild(document.createTextNode(' '));
      const wd=document.createElement('span');wd.className='wd';wd.setAttribute('aria-hidden','true');[...w].forEach(c=>{const ch=document.createElement('span');ch.className='ch';ch.textContent=c;wd.appendChild(ch);});h2.appendChild(wd);});});});
  // marquee skews with scroll speed
  const skewTo=gsap.quickTo('.marq .mi','skewX',{duration:.4,ease:'power3'});
  ScrollTrigger.create({onUpdate:s=>skewTo(Math.max(-12,Math.min(12,s.getVelocity()/-260)))});
  // big title
  gsap.from('.big-title .ln > span',{yPercent:110,rotate:4,duration:1.2,ease:'expo.out',stagger:.12,scrollTrigger:{trigger:'.big-title',start:'top 85%'}});
  gsap.to('#ttl2',{backgroundPosition:'200% 0',ease:'none',scrollTrigger:{trigger:'#welcome',start:'top bottom',end:'bottom top',scrub:true}});
  // reveals
  $$('.rv').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
  $$('h2.h').forEach(el=>gsap.from(el.querySelectorAll('.ch'),{yPercent:110,rotateX:-80,opacity:0,duration:1,ease:'expo.out',stagger:.025,scrollTrigger:{trigger:el,start:'top 90%'}}));
  // palette liquid reveal
  gsap.from('#pal .sw',{clipPath:'inset(100% 0% 0% 0%)',duration:1.3,ease:'expo.inOut',stagger:.12,scrollTrigger:{trigger:'#pal',start:'top 80%'}});
  // variation logos zoom in
  $$('.var svg').forEach(s=>gsap.from(s,{scale:.6,opacity:0,rotate:-6,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:s,start:'top 90%'}}));
  // seal section spins in
  gsap.from('#seal',{rotate:-120,scale:.6,opacity:0,duration:1.6,ease:'expo.out',scrollTrigger:{trigger:'#seal',start:'top 85%'}});
  // footer glow loop
  gsap.to('footer .huge svg',{filter:'drop-shadow(0 0 24px rgba(232,207,152,.45))',duration:2,yoyo:true,repeat:-1,ease:'sine.inOut'});
  // magnetic pills
  $$('.pill').forEach(b=>{const xT=gsap.quickTo(b,'x',{duration:.4}),yT=gsap.quickTo(b,'y',{duration:.4});b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();xT((e.clientX-r.left-r.width/2)*.3);yT((e.clientY-r.top-r.height/2)*.4)});b.addEventListener('pointerleave',()=>{xT(0);yT(0)});});
  // carriers scenes: soft parallax on mockups
  $$('.item .scene').forEach(s=>s.addEventListener('pointermove',e=>{const r=s.getBoundingClientRect();gsap.to(s.firstElementChild,{x:(e.clientX-r.left-r.width/2)*.05,y:(e.clientY-r.top-r.height/2)*.05,rotateY:(e.clientX-r.left-r.width/2)*.02,duration:.6});}));

  // manifesto word lighting
  ScrollTrigger.create({trigger:man,start:'top 80%',end:'bottom 45%',scrub:true,onUpdate:s=>{const n=Math.round(s.progress*mw.length);mw.forEach((w,i)=>w.style.opacity=i<n?1:.22)}});
  // toc rows
  gsap.from('.toc a',{x:-60,opacity:0,duration:.9,ease:'power3.out',stagger:.12,scrollTrigger:{trigger:'.toc',start:'top 85%'}});
  // logo story
  ScrollTrigger.create({trigger:'#story',start:'top 85%',once:true,onEnter:()=>gsap.to(STY,{draw:1,duration:2.2,ease:'power2.inOut',onUpdate:storyRender})});
  ScrollTrigger.create({trigger:'#story',start:'top top',end:'bottom bottom',scrub:.6,onUpdate:s=>storyAt(s.progress)});
  gsap.fromTo('#drawSvg',{scale:.9},{scale:1.04,ease:'none',scrollTrigger:{trigger:'#story',start:'top bottom',end:'bottom bottom',scrub:true}});
  // cards
  gsap.from('.var',{y:80,opacity:0,rotateX:-18,duration:1,ease:'power3.out',stagger:.1,scrollTrigger:{trigger:'.vars',start:'top 85%'}});
  gsap.from('.mcard',{y:60,opacity:0,duration:.8,ease:'power3.out',stagger:.07,scrollTrigger:{trigger:'.mis',start:'top 85%'}});
  gsap.from('.combo',{scale:.7,opacity:0,duration:.8,ease:'back.out(1.6)',stagger:.08,scrollTrigger:{trigger:'.combos',start:'top 90%'}});
  gsap.from('.tcard',{y:60,opacity:0,duration:.9,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:'.types',start:'top 88%'}});
  // pattern rows follow scroll
  $$('#patt .row').forEach((r,i)=>{const dir=+r.dataset.dir;gsap.fromTo(r,{x:dir>0?-600-i*120:-200-i*80},{x:dir>0?-100-i*120:-700-i*80,ease:'none',scrollTrigger:{trigger:'#patt',start:'top bottom',end:'bottom top',scrub:true}})});
  gsap.from('#patt .over svg',{scale:.6,opacity:0,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'#patt',start:'top 70%'}});
  // seal rotation (time + scroll boost)
  let rot=0,boost=0;ScrollTrigger.create({trigger:'#seal',start:'top bottom',end:'bottom top',onUpdate:s=>{boost=Math.min(6,Math.abs(s.getVelocity())/300)}});
  gsap.ticker.add(()=>{rot+=.12+boost;boost*=.92;$('#ringA').setAttribute('transform',`rotate(${rot} 250 250)`);$('#ringB').setAttribute('transform',`rotate(${-rot*.7} 250 250)`)});
  gsap.from('.stk',{scale:0,rotate:-40,duration:.8,ease:'back.out(2)',stagger:.08,scrollTrigger:{trigger:'#stickers',start:'top 80%'}});
  // footer
  gsap.from('footer .huge',{yPercent:30,opacity:0,scale:.9,duration:1.4,ease:'expo.out',scrollTrigger:{trigger:'footer',start:'top 80%'}});
  addEventListener('load',()=>ScrollTrigger.refresh());
} else { mw.forEach(w=>w.style.opacity=1); }

/* rotate seal without gsap */
if(!hasG&&!reduce){let r=0;(function sp(){r+=.12;const a=$('#ringA'),b=$('#ringB');a&&a.setAttribute('transform',`rotate(${r} 250 250)`);b&&b.setAttribute('transform',`rotate(${-r*.7} 250 250)`);requestAnimationFrame(sp)})();}
})();
