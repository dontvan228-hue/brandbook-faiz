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
{const m=$('#mq1');if(m){let s='';for(let k=0;k<2;k++)['Faiz','Quality','Trust','Comfort','Atmosphere','Choice'].forEach(w=>{s+=`<span>${w}<svg viewBox="44 44 344.5 391.25"><use href="#pF"/></svg></span>`;});m.innerHTML=s;}}

/* ---------- scroll choreography */
if(hasG&&!reduce){
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('#ihero .big-title .ln > span',{yPercent:110,rotate:4,duration:1.2,ease:'expo.out',stagger:.12,delay:.15});
  gsap.from('#ihero .lead, #ihero .acts, #ihero .eyebrow',{y:30,opacity:0,duration:1,ease:'power3.out',stagger:.1,delay:.5});
  gsap.to('#ihero .ph img',{yPercent:12,scale:1.08,ease:'none',scrollTrigger:{trigger:'#ihero',start:'top top',end:'bottom top',scrub:true}});
  $$('.rv').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
  const skewTo=gsap.quickTo('.marq .mi','skewX',{duration:.4,ease:'power3'});
  ScrollTrigger.create({onUpdate:s=>skewTo(Math.max(-12,Math.min(12,s.getVelocity()/-260)))});
  gsap.fromTo('#road .ln',{scaleX:0,scaleY:0},{scaleX:1,scaleY:1,ease:'none',scrollTrigger:{trigger:'#road',start:'top 80%',end:'bottom 60%',scrub:true}});
  gsap.from('#deal .bgF',{rotate:-20,scale:.7,opacity:0,duration:1.6,ease:'expo.out',scrollTrigger:{trigger:'#deal',start:'top 80%'}});
  gsap.from('footer .huge',{yPercent:30,opacity:0,scale:.9,duration:1.4,ease:'expo.out',scrollTrigger:{trigger:'footer',start:'top 80%'}});
  addEventListener('load',()=>ScrollTrigger.refresh());
}
})();
