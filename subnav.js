/* Section subnav shared by every brandbook page: shows the current section's
   subsections (h3.st) under the top bar, highlights the one on screen, jumps on click.
   Usage: initSubnav({sections:['logo','identity'], lenis, reduce}) */
window.initSubnav=function(opts){
  const o=opts||{},lenis=o.lenis||null,reduce=!!o.reduce;
  const nav=document.getElementById('nav'),sn=document.getElementById('subnav');if(!nav||!sn)return;
  const data=(o.sections||[]).map(id=>document.getElementById(id)).filter(Boolean).map(s=>{
    const sts=[...s.querySelectorAll('h3.st')];sts.forEach((h,i)=>{if(!h.id)h.id=s.id+'-'+(i+1);});
    const ey=s.querySelector('.eyebrow');return {s,sts,label:ey?ey.textContent.trim():''};}).filter(d=>d.sts.length);
  const navLinks=[...document.querySelectorAll('#navList a[href^="#"]')];
  let cur=null,act=null;
  const gap=()=>sn.getBoundingClientRect().bottom+18;
  function go(h){if(lenis)lenis.scrollTo(h,{offset:-gap(),duration:1.1});else window.scrollTo({top:h.getBoundingClientRect().top+scrollY-gap(),behavior:reduce?'auto':'smooth'});}
  function build(d){sn.textContent='';const b=document.createElement('b');b.textContent=d.label;sn.appendChild(b);
    d.sts.forEach(h=>{const a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent;a.addEventListener('click',e=>{e.preventDefault();go(h);});sn.appendChild(a);});}
  function place(){sn.style.top=Math.round(nav.getBoundingClientRect().bottom)+'px';}
  function upd(){const y=innerHeight*.3;let d=null;
    for(const x of data){const r=x.s.getBoundingClientRect();if(r.top<=y&&r.bottom>y){d=x;break;}}
    if(d!==cur){cur=d;act=null;if(d)build(d);sn.classList.toggle('on',!!d);}
    navLinks.forEach(a=>{const s=document.querySelector(a.getAttribute('href'));if(!s)return;const r=s.getBoundingClientRect();a.classList.toggle('on',r.top<=y&&r.bottom>y);});
    if(!d)return;let h=null;d.sts.forEach(x=>{if(x.getBoundingClientRect().top<=y+60)h=x;});
    const changed=h!==act;act=h;
    [...sn.querySelectorAll('a')].forEach(a=>{const on=!!h&&a.getAttribute('href')==='#'+h.id;if(a.classList.contains('on')!==on)a.classList.toggle('on',on);
      if(on&&changed)sn.scrollTo({left:a.offsetLeft-(sn.clientWidth-a.offsetWidth)/2,behavior:reduce?'auto':'smooth'});});}
  let q=0;addEventListener('scroll',()=>{if(q)return;q=requestAnimationFrame(()=>{q=0;upd();});},{passive:true});
  addEventListener('resize',()=>{place();upd();});place();upd();
};
