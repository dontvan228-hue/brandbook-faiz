/* ФАЙЗ · пекарня: прокрутка, меню, копирование цветов, нарисованные макеты носителей и шаблонов */
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG=!!(window.gsap&&window.ScrollTrigger);
const C={choc:'#5c3a28',butter:'#f4deaf',blue:'#a0beda',page:'#fbf4e6',muted:'#765545'};
const FONT_D='Playfair Display,Georgia,serif',FONT_T='Manrope,system-ui,sans-serif';
const LR=+(document.body.dataset.logoRatio||3.832);   // logo width / height

/* smooth scroll */
let lenis=null;
if(window.Lenis&&!reduce){lenis=new Lenis({lerp:.09});
  if(hasG){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}
  else{const r=t=>{lenis.raf(t);requestAnimationFrame(r)};requestAnimationFrame(r);}}
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(!/^#[A-Za-z][\w-]*$/.test(id))return;const el=document.getElementById(id.slice(1));if(!el)return;e.preventDefault();lenis?lenis.scrollTo(el,{offset:-80,duration:1.2}):el.scrollIntoView({behavior:'smooth'});}));

/* nav: solid on scroll, burger, progress */
const nav=$('#nav');const onS=()=>nav.classList.toggle('solid',scrollY>40);addEventListener('scroll',onS,{passive:true});onS();
{const nb=$('#burger'),list=$('#navList');
  const setMenu=on=>{nav.classList.toggle('open',on);nb.setAttribute('aria-expanded',String(on));if(lenis)on?lenis.stop():lenis.start();document.documentElement.style.overflow=on?'hidden':'';};
  nb.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
  list.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false);});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){setMenu(false);nb.focus();}});
  matchMedia('(min-width:961px)').addEventListener('change',e=>{if(e.matches)setMenu(false);});}
{const pr=$('#prog');if(pr){const upd=()=>{const m=document.documentElement.scrollHeight-innerHeight;pr.style.transform=`scaleX(${m>0?Math.min(1,scrollY/m):0})`;};addEventListener('scroll',upd,{passive:true});upd();}}

/* toast + copy colour */
const toast=m=>{const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),1600);};
$$('[data-copy]').forEach(b=>b.addEventListener('click',()=>{const v=b.dataset.copy;const done=()=>toast('Скопировано '+v);try{navigator.clipboard.writeText(v).then(done,()=>toast(v));}catch(e){toast(v);}}));

/* ---------- drawn mockups */
const logo=(cx,cy,w,fill)=>{const h=w/LR;return `<use href="#fl" x="${(cx-w/2).toFixed(1)}" y="${(cy-h/2).toFixed(1)}" width="${w}" height="${h.toFixed(1)}" fill="${fill}"/>`;};
const tx=(x,y,s,t,o={})=>`<text x="${x}" y="${y}" font-family="${o.d?FONT_D:FONT_T}" font-size="${s}" font-weight="${o.w||500}"${o.it?' font-style="italic"':''} fill="${o.c||C.choc}" text-anchor="${o.a||'middle'}"${o.ls?` letter-spacing="${o.ls}"`:''}>${t}</text>`;
const shadow=(cx,cy,rx)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx*.09}" fill="#5c3a28" opacity=".12"/>`;
const svg=(body,bg=C.page,vb='0 0 400 300')=>`<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="100%" height="100%" fill="${bg}"/>${body}</svg>`;
const M={
  bag:()=>svg(`${shadow(200,262,110)}<path d="M150 70 Q150 38 200 38 Q250 38 250 70" fill="none" stroke="${C.choc}" stroke-width="6"/><path d="M110 70 H290 L304 260 H96 Z" fill="${C.butter}" stroke="rgba(92,58,40,.25)"/><path d="M110 70 H290 L292 96 H108 Z" fill="${C.blue}"/>${logo(200,170,150,C.choc)}${tx(200,228,11,'СВЕЖАЯ ВЫПЕЧКА',{ls:3,w:700})}`),
  box:()=>svg(`${shadow(200,262,140)}<path d="M70 120 L200 90 L330 120 L200 150 Z" fill="#b9cfe4"/><path d="M70 120 L200 150 V256 L70 226 Z" fill="${C.blue}"/><path d="M330 120 L200 150 V256 L330 226 Z" fill="#8fb0cf"/><path d="M136 105 L264 135 M200 90 V150" stroke="${C.choc}" stroke-width="3" opacity=".8"/><g transform="matrix(1 .23 0 1 0 0)">${logo(135,168,88,C.choc)}</g><g transform="matrix(1 -.23 0 1 0 0)">${logo(265,262,88,C.choc)}</g>`),
  cup:()=>svg(`${shadow(200,266,70)}<path d="M138 64 H262 L248 262 H152 Z" fill="${C.butter}" stroke="rgba(92,58,40,.25)"/><path d="M130 50 H270 V68 H130 Z" fill="${C.choc}"/><path d="M142 120 H258 L252 200 H148 Z" fill="${C.blue}"/>${logo(200,160,92,C.choc)}`),
  sticker:()=>svg(`<circle cx="200" cy="150" r="104" fill="${C.choc}"/><circle cx="200" cy="150" r="90" fill="none" stroke="${C.butter}" stroke-dasharray="3 6" opacity=".6"/>${logo(200,146,130,C.butter)}${tx(200,196,11,'С ЛЮБОВЬЮ ИЗ ПЕЧИ',{c:C.butter,ls:2.5,w:700})}`,C.blue),
  apron:()=>svg(`<path d="M160 40 Q200 70 240 40" fill="none" stroke="${C.choc}" stroke-width="5"/><path d="M150 48 H250 L262 120 L300 128 V268 H100 V128 L138 120 Z" fill="${C.blue}" stroke="rgba(92,58,40,.25)"/><path d="M100 140 L60 150 M300 140 L340 150" stroke="${C.choc}" stroke-width="5"/>${logo(200,118,96,C.choc)}<rect x="160" y="190" width="80" height="52" rx="6" fill="none" stroke="${C.choc}" stroke-width="2" opacity=".55"/>`),
  cap:()=>svg(`${shadow(200,236,120)}<path d="M96 180 Q100 86 200 82 Q300 86 304 180 Z" fill="${C.choc}"/><path d="M96 180 Q200 196 304 180 L330 210 Q200 236 70 210 Z" fill="#472b1d"/><circle cx="200" cy="84" r="7" fill="#472b1d"/>${logo(200,146,108,C.butter)}`,C.butter),
  sign:()=>svg(`<rect y="0" width="400" height="300" fill="${C.blue}"/><rect x="0" y="210" width="400" height="90" fill="#8fb0cf"/><rect x="60" y="54" width="280" height="88" rx="10" fill="${C.choc}"/>${logo(200,98,210,C.butter)}<rect x="96" y="160" width="208" height="140" fill="${C.page}" stroke="${C.choc}" stroke-width="6"/><path d="M200 160 V300" stroke="${C.choc}" stroke-width="4"/>${tx(200,182,10,'ПЕКАРНЯ · С 8:00',{ls:2.5,w:700})}`),
  menu:()=>svg(`<rect x="70" y="26" width="260" height="250" rx="12" fill="${C.choc}"/>${logo(200,66,140,C.butter)}${['Круассан','Синнабон','Хлеб на закваске','Капучино'].map((n,i)=>`${tx(96,124+i*36,15,n,{c:C.butter,a:'start',d:1})}<path d="M${96+n.length*8} ${120+i*36} H262" stroke="${C.butter}" stroke-dasharray="2 4" opacity=".5"/>${tx(304,124+i*36,14,'— ₽',{c:C.butter,a:'end',w:700})}`).join('')}`,C.blue),
  price:()=>svg(`<rect x="96" y="70" width="208" height="150" rx="10" fill="${C.butter}" stroke="rgba(92,58,40,.25)"/><rect x="96" y="70" width="208" height="34" rx="10" fill="${C.blue}"/><rect x="96" y="92" width="208" height="12" fill="${C.blue}"/>${logo(200,88,70,C.choc)}${tx(200,146,24,'Круассан',{d:1,w:600})}${tx(200,168,11,'сливочное масло · 80 г',{c:C.muted})}${tx(200,204,26,'— ₽',{w:800})}`,C.page),
  post:()=>svg(`<rect x="100" y="0" width="300" height="300" fill="${C.blue}" transform="translate(-50 0)"/>${logo(200,92,180,C.choc)}${tx(200,170,26,'Свежая выпечка',{d:1,w:600})}${tx(200,200,26,'каждое утро',{d:1,it:1})}${tx(200,262,11,'ЕЖЕДНЕВНО С 8:00',{ls:3,w:700})}`,C.page),
  story:()=>svg(`<rect x="132" y="10" width="136" height="242" rx="16" fill="${C.butter}" stroke="rgba(92,58,40,.25)"/><rect x="144" y="20" width="112" height="3" rx="2" fill="rgba(92,58,40,.2)"/><rect x="144" y="20" width="60" height="3" rx="2" fill="${C.choc}"/>${logo(200,64,92,C.choc)}<circle cx="200" cy="140" r="40" fill="${C.blue}"/>${tx(200,206,15,'Сегодня',{d:1,w:600})}${tx(200,224,15,'в витрине',{d:1,it:1})}`,C.page),
  avatar:()=>svg(`<circle cx="200" cy="150" r="96" fill="${C.blue}"/>${logo(200,150,150,C.choc)}`,C.page),
  tMenu:()=>svg(`<rect x="120" y="14" width="160" height="226" fill="${C.butter}" stroke="rgba(92,58,40,.25)"/>${logo(200,46,96,C.choc)}<path d="M136 66 H264" stroke="${C.choc}" opacity=".3"/>${[0,1,2,3,4,5].map(i=>`<rect x="136" y="${82+i*24}" width="${70+((i*37)%40)}" height="7" rx="3" fill="${C.choc}" opacity=".75"/><rect x="246" y="${82+i*24}" width="18" height="7" rx="3" fill="${C.choc}"/>`).join('')}<rect x="120" y="222" width="160" height="18" fill="${C.blue}"/>${tx(200,280,11,'Меню А4 · вертикальное',{c:C.muted})}`,C.page),
  tPrice:()=>svg(`${[0,1,2].map(i=>`<g transform="translate(${70+i*90} 70)"><rect width="80" height="58" rx="6" fill="${C.butter}" stroke="rgba(92,58,40,.25)"/><rect width="80" height="14" rx="6" fill="${C.blue}"/>${logo(40,8,34,C.choc)}<rect x="10" y="24" width="54" height="6" rx="3" fill="${C.choc}"/><rect x="10" y="36" width="34" height="4" rx="2" fill="${C.muted}"/><rect x="48" y="44" width="22" height="7" rx="3" fill="${C.choc}"/></g>`).join('')}${tx(200,182,11,'Ценники 70 × 50 мм · лист А4',{c:C.muted})}`,C.page),
  tFlyer:()=>svg(`<rect x="128" y="20" width="144" height="204" fill="${C.blue}"/>${logo(200,58,104,C.choc)}${tx(200,124,19,'Открылись!',{d:1,w:700})}${tx(200,146,14,'приходите на кофе',{d:1,it:1})}<rect x="150" y="170" width="100" height="26" rx="13" fill="${C.choc}"/>${tx(200,188,10,'АДРЕС · ЧАСЫ',{c:C.butter,ls:2,w:700})}${tx(200,262,11,'Листовка А5',{c:C.muted})}`,C.page)
};
$$('[data-mock]').forEach(el=>{const f=M[el.dataset.mock];if(f)el.innerHTML=f();});

/* reveal */
if(hasG&&!reduce){gsap.registerPlugin(ScrollTrigger);
  $$('.rv').forEach(el=>gsap.from(el,{y:20,opacity:0,duration:.6,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 95%'}}));
  $$('h3.st').forEach(el=>gsap.from(el,{y:16,opacity:0,duration:.5,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 95%'}}));}

const SEC=(document.body.dataset.subnav||'quick logo identity carriers templates').split(/\s+/);
window.initSubnav&&initSubnav({sections:SEC,lenis,reduce});
})();
