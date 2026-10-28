/* Investor page: smooth scroll, nav, progress, marquee and scroll reveals (calculator and contacts come from kit.js). */
(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG=!!(window.gsap&&window.ScrollTrigger);

/* ---------- smooth scroll */
let lenis=null;
if(window.Lenis&&!reduce){lenis=new Lenis({lerp:.09});
  if(hasG){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}
  else{const r=t=>{lenis.raf(t);requestAnimationFrame(r)};requestAnimationFrame(r);}}
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(!/^#[A-Za-z][\w-]*$/.test(id))return;const el=document.getElementById(id.slice(1));if(!el)return;e.preventDefault();lenis?lenis.scrollTo(el,{duration:1.4,offset:-80}):el.scrollIntoView({behavior:'smooth'});}));

/* ---------- nav, mobile menu, reading progress */
const nav=$('#nav');const onS=()=>nav.classList.toggle('solid',scrollY>innerHeight*.5);addEventListener('scroll',onS,{passive:true});onS();
{const nb=$('#burger'),list=$('#navList');
  const setMenu=on=>{nav.classList.toggle('open',on);nb.setAttribute('aria-expanded',String(on));if(lenis)on?lenis.stop():lenis.start();document.documentElement.style.overflow=on?'hidden':'';};
  nb.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
  list.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false);});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){setMenu(false);nb.focus();}});
  matchMedia('(min-width:961px)').addEventListener('change',e=>{if(e.matches)setMenu(false);});}
{const pr=$('#prog');const upd=()=>{const m=document.documentElement.scrollHeight-innerHeight;pr.style.transform=`scaleX(${m>0?Math.min(1,scrollY/m):0})`;};
  addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();}

/* ---------- cursor */
const cur=$('#cur');
if(cur&&matchMedia('(hover:hover) and (pointer:fine)').matches){let cx=0,cy=0,tx=0,ty=0,raf=0;
  const loop=()=>{cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;cur.style.transform=`translate(${cx}px,${cy}px)`;raf=Math.abs(tx-cx)+Math.abs(ty-cy)>.1?requestAnimationFrame(loop):0;};
  addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(loop);},{passive:true});
  document.addEventListener('pointerover',e=>{cur.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,button,[role=button]')))});}

/* ---------- marquee */
{let h='';for(let k=0;k<2;k++)['Faiz','Quality','Trust','Comfort','Atmosphere','Choice'].forEach(w=>{h+=`<span>${w}<svg viewBox="44 44 344.5 391.25"><use href="#pF"/></svg></span>`;});$$('.marq .mi').forEach(m=>{m.innerHTML=h;});}

/* ---------- welcome intro: the wordmark draws itself in gold, then the greeting */
const NS='http://www.w3.org/2000/svg';
const logo=$('#iwLogo'),strokes=[],fills=[];
if(logo){
  const defs=document.createElementNS(NS,'defs');defs.innerHTML='<clipPath id="iwClip"></clipPath><linearGradient id="iwSheen" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>';logo.appendChild(defs);
  const gF=document.createElementNS(NS,'g'),gS=document.createElementNS(NS,'g');logo.append(gF,gS);
  ['F','A','Y','B','Z'].forEach(k=>{const d=document.getElementById('p'+k).getAttribute('d');
    const f=document.createElementNS(NS,'path');f.setAttribute('d',d);f.setAttribute('fill','url(#gGoldWide)');f.style.opacity=0;gF.appendChild(f);fills.push(f);
    const c=document.createElementNS(NS,'path');c.setAttribute('d',d);$('#iwClip').appendChild(c);
    const st=document.createElementNS(NS,'path');st.setAttribute('d',d);st.setAttribute('fill','none');st.setAttribute('stroke','#f3e3b8');st.setAttribute('stroke-width','1.6');gS.appendChild(st);
    const L=st.getTotalLength();st.style.strokeDasharray=L;st.style.strokeDashoffset=L;strokes.push(st);});
  const sh=document.createElementNS(NS,'g');sh.setAttribute('clip-path','url(#iwClip)');
  sh.innerHTML='<rect id="iwSheenR" x="-300" y="0" width="160" height="500" fill="url(#iwSheen)" transform="skewX(-18)"/>';logo.appendChild(sh);
}
const showLogoFinal=()=>{strokes.forEach(s=>{s.style.strokeDashoffset=0;s.style.opacity=.15});fills.forEach(f=>f.style.opacity=1);};

/* golden dust */
{const cv=$('#idust');if(cv){const ctx=cv.getContext('2d'),DPR=Math.min(2,devicePixelRatio||1);let W=0,H=0,vis=true;
  const rs=()=>{W=cv.width=cv.offsetWidth*DPR;H=cv.height=cv.offsetHeight*DPR};rs();addEventListener('resize',rs);
  new IntersectionObserver(es=>es.forEach(e=>vis=e.isIntersecting)).observe(cv);
  const D=Array.from({length:90},()=>({x:Math.random(),y:Math.random(),r:Math.random()*Math.random()*2.4+.4,v:.0003+Math.random()*.001,p:Math.random()*6}));
  (function loop(t){requestAnimationFrame(loop);if(!vis)return;ctx.clearRect(0,0,W,H);D.forEach(d=>{if(!reduce){d.y-=d.v;d.x+=Math.sin(t/2000+d.p)*.0003;}if(d.y<-.02){d.y=1.02;d.x=Math.random();}
    const a=.25+.4*Math.sin(t/700+d.p*3);ctx.beginPath();ctx.arc(d.x*W,d.y*H,d.r*DPR,0,7);ctx.fillStyle=`rgba(232,207,152,${Math.max(0,a)})`;ctx.fill();});})(0);}}

/* ---------- scroll choreography */
if(hasG&&!reduce){
  gsap.registerPlugin(ScrollTrigger);
  // intro timeline starts as the preloader lifts
  const tl=gsap.timeline({delay:1.9});
  tl.from('.iw-ring',{scale:.7,opacity:0,duration:2.4,ease:'expo.out'},0)
    .to(strokes,{strokeDashoffset:0,duration:2,ease:'power2.inOut',stagger:.14},0.1)
    .to(fills,{opacity:1,duration:.9,ease:'power1.out',stagger:.08},1.6)
    .to(strokes,{opacity:.15,duration:.8},2.1)
    .fromTo('#iwSheenR',{attr:{x:-300}},{attr:{x:1100},duration:1.4,ease:'power2.inOut'},2.4)
    .from('.iw-eyebrow',{y:16,opacity:0,duration:.8,ease:'power3.out'},2.5)
    .from('.iw-l1',{yPercent:60,opacity:0,duration:1,ease:'expo.out'},2.7)
    .from('.iw-l2',{yPercent:60,opacity:0,scale:.9,duration:1.2,ease:'expo.out'},2.95)
    .to('.iw-l2',{backgroundPosition:'200% 0',duration:2.2,ease:'power1.inOut'},3.2)
    .from('.iw-sub',{y:20,opacity:0,duration:.9,ease:'power3.out'},3.3)
    .from('.iw-cue',{y:16,opacity:0,duration:.8,ease:'power3.out'},3.6);
  // periodic sheen across the gold wordmark
  gsap.fromTo('#iwSheenR',{attr:{x:-300}},{attr:{x:1100},duration:1.6,ease:'power2.inOut',repeat:-1,repeatDelay:5,delay:6});
  // scrolling away: the wordmark lifts and fades, the ring keeps turning
  gsap.to('.iw-in',{yPercent:-18,opacity:0,ease:'none',scrollTrigger:{trigger:'#iwel',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.iw-ring',{rotate:60,scale:1.15,opacity:0,ease:'none',scrollTrigger:{trigger:'#iwel',start:'top top',end:'bottom top',scrub:true}});
  gsap.from('#ihero .big-title .ln > span',{yPercent:110,rotate:4,duration:1.2,ease:'expo.out',stagger:.12,scrollTrigger:{trigger:'#ihero',start:'top 70%'}});
  gsap.from('#ihero .lead, #ihero .acts, #ihero .eyebrow',{y:30,opacity:0,duration:1,ease:'power3.out',stagger:.1,scrollTrigger:{trigger:'#ihero',start:'top 60%'}});
  gsap.to('#ihero .ph img',{yPercent:12,scale:1.08,ease:'none',scrollTrigger:{trigger:'#ihero',start:'top top',end:'bottom top',scrub:true}});
  $$('.rv').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
  const skewTo=gsap.quickTo('.marq .mi','skewX',{duration:.4,ease:'power3'});
  ScrollTrigger.create({onUpdate:s=>skewTo(Math.max(-12,Math.min(12,s.getVelocity()/-260)))});
  gsap.fromTo('#road .ln',{scaleX:0,scaleY:0},{scaleX:1,scaleY:1,ease:'none',scrollTrigger:{trigger:'#road',start:'top 80%',end:'bottom 60%',scrub:true}});
  gsap.from('#deal .bgF',{rotate:-20,scale:.7,opacity:0,duration:1.6,ease:'expo.out',scrollTrigger:{trigger:'#deal',start:'top 80%'}});
  gsap.from('footer .huge',{yPercent:30,opacity:0,scale:.9,duration:1.4,ease:'expo.out',scrollTrigger:{trigger:'footer',start:'top 80%'}});
  addEventListener('load',()=>ScrollTrigger.refresh());
} else showLogoFinal();
})();
