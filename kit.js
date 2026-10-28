/* Brand kit: icons, apparel tech pack, template library, layout how-to, payback calculator.
   Loaded before app.js so its reveal / heading animations pick up the generated nodes. */
(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const INK='#02110c',OL='#1a422f',CR='#f3ebd6',GD='#c8b48c',GDK='#8a6b3c',GOLD='url(#gGoldObj)';
const RC='Roboto Condensed',CG='Cormorant Garamond',UF='UnifrakturMaguntia';
const WMR=819.75/391.25, MKR=344.5/391.25;
// logo / mark / text helpers for template SVGs
const wm=(x,y,w,f,o=1)=>`<use href="#wm" x="${x}" y="${y}" width="${w}" height="${(w/WMR).toFixed(2)}" fill="${f}" opacity="${o}"/>`;
const mk=(x,y,h,f,o=1)=>`<use href="#zn" x="${x}" y="${y}" width="${(h*MKR).toFixed(2)}" height="${h}" fill="${f}" opacity="${o}"/>`;
const t=(x,y,s,txt,o={})=>`<text x="${x}" y="${y}" font-family="${o.f||RC}" font-size="${s}" font-weight="${o.w||400}"${o.it?' font-style="italic"':''} fill="${o.c||CR}"${o.a?` text-anchor="${o.a}"`:''}${o.ls?` letter-spacing="${o.ls}"`:''}${o.o?` opacity="${o.o}"`:''}>${txt}</text>`;
const b18=(x,y,c,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect width="30" height="17" rx="3" fill="none" stroke="${c}" stroke-width="1.2"/>${t(15,12.5,10,'18+',{w:800,c,a:'middle'})}</g>`;
const svg=(vb,body)=>`<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;

/* ---------- icons */
const ICONS=[['Часы работы','<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'],
  ['Адрес','<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'],
  ['Консультация','<path d="M4 5h16v10H10l-6 4z"/><path d="M8 9h8M8 12h5"/>'],
  ['Пакет','<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'],
  ['Подарок','<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M4 13h16M12 9v11M12 9c-1.5-3.5-5.5-3.5-5 0M12 9c1.5-3.5 5.5-3.5 5 0"/>'],
  ['Качество','<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>'],
  ['Только 18+','<circle cx="12" cy="12" r="9"/><path d="M8 9.5l1.5-1V15.5M13.6 12a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2zm0 0a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM17.5 10.5v3M16 12h3"/>'],
  ['Телефон','<path d="M6 3h3l2 5-2 1.2a11 11 0 0 0 5.8 5.8L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/>'],
  ['Карта клуба','<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/>'],
  ['Консультант','<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>']];
{const box=$('#icons');if(box)ICONS.forEach(([n,p])=>{const d=document.createElement('div');d.className='ico rv';
  const i=s=>`<svg viewBox="0 0 24 24"${s?` style="width:${s}px;height:${s}px"`:''} aria-hidden="true">${p}</svg>`;
  d.innerHTML=`${i()}<div class="sm">${i(24)}${i(16)}</div><span>${n}</span>`;box.appendChild(d);});}

/* ---------- apparel tech pack */
const tp=$('#tp');
if(tp){
  const COLORS=[{n:'Изумруд',body:OL,ink:CR,seam:'rgba(255,255,255,.14)'},{n:'Чёрный',body:'#151515',ink:CR,seam:'rgba(255,255,255,.12)'},
    {n:'Крем',body:'#e7dec6',ink:OL,seam:'rgba(0,0,0,.14)'},{n:'Ночь и золото',body:INK,ink:GOLD,seam:'rgba(200,180,140,.18)'}];
  const S={item:'tee',side:'front',c:0};
  const G={tee:{
      outline:'M140 30 Q200 70 260 30 L330 52 L392 120 L346 160 L318 136 L318 440 L82 440 L82 136 L54 160 L8 120 L70 52 Z',
      outlineB:'M140 30 Q200 46 260 30 L330 52 L392 120 L346 160 L318 136 L318 440 L82 440 L82 136 L54 160 L8 120 L70 52 Z',
      seams:'M108 40 Q92 90 82 136 M292 40 Q308 90 318 136 M82 426 L318 426 M18 128 L58 150 M382 128 L342 150',
      collar:'M146 33 Q200 82 254 33',collarB:'M146 33 Q200 56 254 33',
      chest:'52',length:'72'},
    hoodie:{
      outline:'M150 44 L72 68 Q44 82 36 132 L10 420 L60 432 L84 190 L84 440 L316 440 L316 190 L340 432 L390 420 L364 132 Q356 82 328 68 L250 44 Z',
      outlineB:'M150 44 L72 68 Q44 82 36 132 L10 420 L60 432 L84 190 L84 440 L316 440 L316 190 L340 432 L390 420 L364 132 Q356 82 328 68 L250 44 Z',
      seams:'M84 418 L316 418 M14 396 L62 408 M386 396 L338 408 M112 56 Q92 120 84 190 M288 56 Q308 120 316 190',
      chest:'58',length:'70'},
    polo:{
      outline:'M150 30 L200 58 L250 30 L330 52 L392 120 L346 160 L318 136 L318 440 L82 440 L82 136 L54 160 L8 120 L70 52 Z',
      outlineB:'M146 30 Q200 44 254 30 L330 52 L392 120 L346 160 L318 136 L318 440 L82 440 L82 136 L54 160 L8 120 L70 52 Z',
      seams:'M108 40 Q92 90 82 136 M292 40 Q308 90 318 136 M82 426 L318 426 M18 128 L58 150 M382 128 L342 150 M82 400 L96 440 M318 400 L304 440'}};
  // polo collar + button placket, drawn over the body
  const poloTop=(c,back)=>back
    ?`<path d="M146 30 Q200 44 254 30 L250 18 Q200 34 150 18 Z" fill="${c.body}" stroke="rgba(0,0,0,.4)" stroke-width="1.5"/>`
    :`<rect x="191" y="58" width="18" height="74" rx="2" fill="${c.body}" stroke="rgba(0,0,0,.35)" stroke-width="1.2"/>${[76,98,120].map(y=>`<circle cx="200" cy="${y}" r="3" fill="none" stroke="${c.seam}" stroke-width="1.5"/>`).join('')}
      <path d="M150 30 L128 46 L178 86 L200 58 Z M250 30 L272 46 L222 86 L200 58 Z" fill="${c.body}" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>`;
  // gold dimension line with end ticks and label
  const dim=(x1,y1,x2,y2,label,dx=0,dy=0)=>{const v=x1===x2;const tk=v?`M${x1-5} ${y1}h10M${x2-5} ${y2}h10`:`M${x1} ${y1-5}v10M${x2} ${y2-5}v10`;
    const lx=(x1+x2)/2+dx,ly=(y1+y2)/2+dy;
    return `<path d="M${x1} ${y1}L${x2} ${y2}${tk}" stroke="#f3e3b8" stroke-width="1.2" fill="none"/><g><rect x="${lx-(label.length*3.6+8)}" y="${ly-10}" width="${label.length*7.2+16}" height="18" rx="9" fill="${INK}" stroke="rgba(243,227,184,.6)"/>${t(lx,ly+3.5,11,label,{c:'#f3e3b8',a:'middle',w:500})}</g>`;};
  const callout=(x,y,tx,ty,n)=>`<path d="M${x} ${y}L${tx} ${ty}" stroke="#b8955c" stroke-width="1.3" stroke-dasharray="3 3"/><circle cx="${tx}" cy="${ty}" r="11" fill="#f3e3b8"/>${t(tx,ty+4,11,n,{c:INK,a:'middle',w:800})}`;
  const SPEC={
    'tee-front':{draw:c=>`${mk(254,86,32,c.ink)}${dim(244,54,244,86,'8 см',-26)}${dim(254,128,282,128,'7 см',0,14)}${callout(282,100,362,86,'1')}`,
      rows:[['1 · Знак «Ф»','Левая сторона груди, 8 см от шва воротника'],['Размер','Высота 7 см'],['Нанесение','Вышивка гладью или шелкография'],['Материал','Хлопок 100 %, кулирная гладь 200–220 г/м²']]},
    'tee-back':{draw:c=>`${wm(141,84,118,c.ink)}<text x="200" y="176" text-anchor="middle" font-family="${UF}" font-size="15" fill="${c.ink==GOLD?GD:c.ink}">Quality · Trust · Comfort</text>${dim(200,38,200,84,'10 см',30)}${dim(141,196,259,196,'26 см',0,16)}${callout(259,110,350,92,'2')}${callout(250,172,350,200,'3')}`,
      rows:[['2 · Логотип','По центру спины, 10 см от шва воротника'],['Размер','Ширина 26 см'],['3 · Строка паттерна','Под логотипом, отступ 3 см, ширина 24 см'],['Нанесение','Шелкография, DTF для малых тиражей']]},
    'hoodie-front':{draw:c=>`<path d="M200 46 L200 440" stroke="${c.seam}" stroke-width="3"/><path d="M200 46 L200 440" stroke="${c.ink==GOLD?GD:c.ink}" stroke-width="1" stroke-dasharray="2 3" opacity=".6"/>${mk(240,96,36,c.ink)}<path d="M102 318 L176 318 L176 404 L96 404 Z M298 318 L224 318 L224 404 L304 404 Z" fill="none" stroke="${c.seam}" stroke-width="2"/><text transform="translate(48 330) rotate(-84)" font-family="${UF}" font-size="18" fill="${c.ink==GOLD?GD:c.ink}">Faiz</text>${dim(232,60,232,96,'14 см',-28)}${dim(240,142,272,142,'9 см',0,14)}${callout(272,112,366,92,'1')}${callout(46,312,-6,268,'2')}`,
      rows:[['1 · Знак «Ф»','Левая сторона груди, 14 см от плечевого шва'],['Размер','Высота 9 см'],['2 · Надпись Faiz','Левый рукав, высота 4 см'],['Нанесение','Вышивка, нить в цвет логотипа'],['Материал','Футер трёхнитка с начёсом 320–360 г/м², молния в цвет']]},
    'hoodie-back':{draw:c=>{const ic=c.ink==GOLD?GD:c.ink;return `<path d="M150 44 Q148 0 200 -2 Q252 0 250 44 Z" fill="${c.body}" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/><path d="M200 -2 L200 44" stroke="${c.seam}" stroke-width="2"/><defs><path id="tpRing" d="M200 200 m-50 0 a50 50 0 1 1 100 0 a50 50 0 1 1 -100 0"/></defs><circle cx="200" cy="200" r="62" fill="none" stroke="${ic}" stroke-width="2"/><circle cx="200" cy="200" r="38" fill="none" stroke="${ic}" stroke-width="1" stroke-dasharray="2 4"/><text font-family="${UF}" font-size="13" fill="${ic}"><textPath href="#tpRing" textLength="300">Faiz · Quality · Trust · Comfort ·</textPath></text>${mk(186,184,32,c.ink)}${dim(138,286,262,286,'30 см',0,0)}${dim(300,50,300,138,'16 см',22)}${callout(250,160,350,120,'1')}`},
      rows:[['1 · Печать','Графический элемент по центру спины, 16 см от воротника'],['Размер','Диаметр 30 см'],['Нанесение','Шелкография, для золота — металлизированная краска'],['Капюшон','Без нанесения, двойной, шнурки в цвет']]},
    'polo-front':{draw:c=>`${mk(250,104,26,c.ink)}<rect x="104" y="106" width="56" height="20" rx="3" fill="${CR}" opacity=".92"/>${t(132,120,9,'ИМЯ',{c:OL,a:'middle',w:700,ls:1})}${dim(244,70,244,104,'8 см',-26)}${dim(250,138,273,138,'6 см',0,14)}${callout(273,110,360,90,'1')}${callout(104,116,40,92,'2')}`,
      rows:[['1 · Знак «Ф»','Левая сторона груди, 8 см ниже плечевого шва'],['Размер','Высота 6 см'],['Нанесение','Вышивка, золотистая нить'],['2 · Бейдж','Правая сторона груди, имя сотрудника'],['Материал','Пике, хлопок 95 % + эластан 5 %, 210–230 г/м²']]},
    'polo-back':{draw:c=>`${wm(152,72,96,c.ink)}${t(200,142,12,'КОНСУЛЬТАНТ',{c:c.ink==GOLD?GD:c.ink,a:'middle',w:700,ls:1.5})}${dim(200,40,200,72,'7 см',30)}${dim(158,166,242,166,'19 см',0,16)}${callout(248,96,350,80,'3')}${callout(240,138,350,140,'4')}`,
      rows:[['3 · Логотип','По центру спины, 7 см от воротника'],['Размер','Ширина 22 см'],['4 · Подпись','«КОНСУЛЬТАНТ» под логотипом, отступ 2 см, ширина 19 см'],['Нанесение','Шелкография или термотрансфер']]}
  };
  const SIZES={tee:[['Размер','S','M','L','XL','XXL'],['Ширина груди','50','52','55','58','61'],['Длина','69','72','74','76','78']],
    hoodie:[['Размер','S','M','L','XL','XXL'],['Ширина груди','56','58','61','64','67'],['Длина','68','70','72','74','76']],
    polo:[['Размер','S','M','L','XL','XXL'],['Ширина груди','51','53','56','59','62'],['Длина','70','72','74','76','78']]};
  const svgEl=$('#tpSvg'),spec=$('#tpSpec'),sizes=$('#tpSizes');
  const render=()=>{const g=G[S.item],c=COLORS[S.c],k=S.item+'-'+S.side,back=S.side==='back';
    const body=`<path d="${back?g.outlineB:g.outline}" fill="${c.body}" stroke="rgba(0,0,0,.4)" stroke-width="1.5"/>
      ${S.item==='hoodie'&&!back?`<path d="M150 44 Q150 6 200 6 Q250 6 250 44 L238 48 Q230 22 200 22 Q170 22 162 48 Z" fill="${c.body}" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/><path d="M162 48 Q170 22 200 22 Q230 22 238 48" fill="none" stroke="${c.seam}" stroke-width="2"/>`:''}
      <path d="${g.seams}" fill="none" stroke="${c.seam}" stroke-width="1.5" stroke-dasharray="${S.item==='tee'?'4 3':'0'}"/>
      ${S.item==='tee'?`<path d="${back?g.collarB:g.collar}" fill="none" stroke="${c.seam}" stroke-width="5"/>`:''}
      ${S.item==='polo'?poloTop(c,back):''}`;
    svgEl.innerHTML=`<g class="fadein">${body}${SPEC[k].draw(c)}</g>`;
    svgEl.setAttribute('aria-label',`Техкарта: ${({tee:'футболка',hoodie:'худи',polo:'поло персонала'})[S.item]}, ${back?'спина':'перед'}, цвет ${c.n}`);
    spec.innerHTML='';SPEC[k].rows.concat([['Цвет изделия / логотипа',`${c.n} / ${c.ink===GOLD?'золото':c.ink===CR?'крем':'олива'}`]]).forEach(([a,b])=>{const tr=document.createElement('tr');const th=document.createElement('th');th.textContent=a;const td=document.createElement('td');td.textContent=b;tr.append(th,td);spec.appendChild(tr);});
    sizes.innerHTML=SIZES[S.item].map((r,i)=>`<tr>${r.map(v=>i?`<td>${v}</td>`:`<th>${v}</th>`).join('')}</tr>`).join('');
    $('#tpCn').textContent=c.n;};
  const seg=(id,key)=>$$(`#${id} button`).forEach(b=>b.addEventListener('click',()=>{S[key]=b.dataset.v;$$(`#${id} button`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
  seg('tpItem','item');seg('tpSide','side');
  const cw=$('#tpColor');COLORS.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.style.background=c.body;b.setAttribute('aria-label',c.n);b.setAttribute('aria-pressed',String(i===0));
    const dot=document.createElement('i');dot.style.background=c.ink===GOLD?'linear-gradient(135deg,#f3e3b8,#8a6b3c)':c.ink;b.appendChild(dot);
    b.addEventListener('click',()=>{S.c=i;$$('#tpColor button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();});cw.appendChild(b);});
  render();
}

/* ---------- layout how-to: one poster built in 4 steps */
{const box=$('#howto');if(box){
  const L=[`<rect width="300" height="400" fill="${INK}"/><circle cx="150" cy="150" r="170" fill="#123726" opacity=".6"/>`,
    `<rect x="24" y="24" width="252" height="352" fill="none" stroke="${GD}" stroke-dasharray="5 4" opacity=".8"/>${[1,2,3].map(i=>`<path d="M${24+i*63} 24V376" stroke="${GD}" opacity=".18"/>`).join('')}${t(12,16,9,'X',{c:GD})}${t(150,16,9,'X = 24',{c:GD,a:'middle'})}`,
    wm(90,48,120,GOLD),
    `${t(24,262,42,'НОВЫЙ',{w:800,ls:1})}${t(24,304,42,'МАГАЗИН',{w:800,ls:1})}<path d="M24 322H84" stroke="${GD}" stroke-width="2"/>${t(24,346,15,'Адрес · дата открытия',{f:CG,it:1,c:GD})}${b18(246,355,CR)}`];
  const CAP=[['Шаг 1 · Фон','Один цвет палитры на весь фон: изумруд, олива или крем.'],['Шаг 2 · Поля и сетка','Поле X = 1/12 ширины со всех сторон, 4 колонки.'],['Шаг 3 · Логотип','Сверху по центру или в левом верхнем углу, не меньше минимума.'],['Шаг 4 · Текст и 18+','Заголовок капсом, акцент курсивом, «18+» в правом нижнем углу.']];
  CAP.forEach(([h,p],i)=>{const f=document.createElement('figure');f.className='rv';
    f.innerHTML=`<div class="fr">${svg('0 0 300 400',L.slice(0,i+1).join(''))}</div><figcaption><b>${h}</b>${p}</figcaption>`;box.appendChild(f);});}}

/* ---------- template library */
{const grid=$('#tGrid');if(grid){
  const lines=(x,y,n,w,step,c,o)=>Array.from({length:n},(_,i)=>`<rect x="${x}" y="${y+i*step}" width="${w*(i%4===3?.6:1)}" height="2.2" rx="1" fill="${c}" opacity="${o}"/>`).join('');
  const T=[
   ['print','Визитка','85 × 55 мм · две стороны','Лицо — логотип на креме. Оборот — имя и контакты на оливе, знак золотой фольгой.',svg('0 0 420 140',
     `<rect x="0" y="5" width="200" height="130" rx="6" fill="${CR}"/>${wm(40,38,120,OL)}${t(100,112,7,'СЕТЬ МАГАЗИНОВ',{c:OL,a:'middle',ls:3})}
      <rect x="220" y="5" width="200" height="130" rx="6" fill="${OL}"/>${mk(236,22,30,GOLD)}${t(236,84,15,'Имя Фамилия',{w:700})}${t(236,99,7,'КОНСУЛЬТАНТ',{c:GD,ls:2})}${t(236,120,8,'+7 000 000-00-00',{o:.75})}${t(404,120,7,'18+',{a:'end',o:.75})}`)],
   ['print','Фирменный бланк','A4 · 210 × 297 мм','Поля 16 мм. Логотип слева вверху, золотая линейка под шапкой, реквизиты в подвале.',svg('0 0 210 297',
     `<rect width="210" height="297" fill="${CR}"/>${mk(150,190,90,OL,.05)}${wm(16,16,48,OL)}${t(194,28,4.5,'Сеть магазинов ФАЙЗ',{c:OL,a:'end',o:.7})}<path d="M16 42H194" stroke="${GD}" stroke-width=".7"/>${t(16,56,4.5,'Исх. № ___ от ___',{c:OL})}${t(16,74,6,'Заголовок письма',{c:OL,w:700})}${lines(16,84,14,178,7,OL,.18)}<path d="M16 200H70" stroke="${OL}" stroke-width=".4"/>${t(16,206,3.8,'Подпись',{c:OL,o:.6})}<path d="M16 276H194" stroke="${GD}" stroke-width=".7"/>${t(16,285,4,'Адрес · телефон · e-mail · ИНН',{c:OL,o:.7})}${t(194,285,4,'18+',{c:OL,a:'end',o:.7})}`)],
   ['print','Карта лояльности','85,6 × 54 мм · пластик','Золото с изумрудным логотипом. Номер — тиснением.',svg('0 0 340 214',
     `<defs><linearGradient id="tplG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9d6a4"/><stop offset=".45" stop-color="#b8955c"/><stop offset=".7" stop-color="#f3e3b8"/><stop offset="1" stop-color="#9c7a45"/></linearGradient></defs><rect width="340" height="214" rx="14" fill="url(#tplG)"/>${mk(196,40,150,INK,.08)}${wm(22,24,110,INK)}${t(22,150,11,'КЛУБНАЯ КАРТА',{c:INK,ls:3,o:.8})}${t(22,182,20,'0000 0000 0000',{c:INK,w:700,ls:2})}${t(318,196,10,'18+',{c:INK,a:'end'})}`)],
   ['print','Подарочный сертификат','210 × 99 мм · евро','Тёмный изумруд, золотая фольга, отрывной корешок с номером.',svg('0 0 420 198',
     `<rect width="420" height="198" rx="8" fill="${INK}" stroke="${GD}" stroke-opacity=".5"/><path d="M130 10V188" stroke="${GD}" stroke-dasharray="4 4" opacity=".5"/>${mk(45,62,70,GOLD)}${t(65,170,8,'№ 000000',{c:GD,a:'middle',ls:2})}${t(156,62,22,'Подарочный',{f:CG,it:1,c:GD})}${t(156,96,28,'СЕРТИФИКАТ',{w:800,ls:2})}${t(156,140,30,'0 000 ₽',{w:800,c:GD})}<path d="M156 156H396" stroke="${GD}" opacity=".35"/>${t(156,176,9,'Действует до ДД.ММ.ГГГГ',{o:.7})}${wm(316,162,80,GD,.9)}${t(396,30,9,'18+',{a:'end',o:.7})}`)],
   ['store','Пломба на пакет','Ø 40 мм · стикер','Закрывает фирменный пакет на кассе. Знак и кольцо слов бренда.',svg('0 0 220 220',
     `<defs><path id="tplSeal" d="M110 110 m-72 0 a72 72 0 1 1 144 0 a72 72 0 1 1 -144 0"/></defs><circle cx="110" cy="110" r="100" fill="${GD}"/><circle cx="110" cy="110" r="88" fill="none" stroke="${INK}" opacity=".4"/><text font-family="${UF}" font-size="17" fill="${INK}"><textPath href="#tplSeal" textLength="440">Faiz · Quality · Trust · Comfort · Choice ·</textPath></text><circle cx="110" cy="110" r="52" fill="${INK}"/>${mk(92,86,48,GOLD)}`)],
   ['store','Ценник','60 × 40 мм','Цена — самый крупный элемент. Название до двух строк, знак «Ф» на оливковой полосе.',svg('0 0 300 190',
     `<rect width="300" height="190" rx="8" fill="${CR}"/><path d="M8 0H64V190H8A8 8 0 0 1 0 182V8A8 8 0 0 1 8 0Z" fill="${OL}"/>${mk(10,70,50,GOLD)}${t(84,38,9,'ЛИНЕЙКА · БРЕНД',{c:GDK,ls:2})}${t(84,66,20,'Название позиции',{c:OL,w:700})}${t(84,86,11,'Краткое описание, объём',{c:OL,o:.7})}${t(84,154,44,'0 000 ₽',{c:OL,w:800})}<circle cx="272" cy="30" r="15" fill="none" stroke="${OL}"/>${t(272,34,10,'18+',{c:OL,a:'middle',w:800})}${Array.from({length:14},(_,i)=>`<rect x="${226+i*4.4}" y="150" width="${i%3?1.2:2.4}" height="24" fill="${OL}"/>`).join('')}`)],
   ['store','Афиша открытия','A3 · 297 × 420 мм','Печать в центре, дата и время — крупно, «18+» в правом нижнем углу.',svg('0 0 297 420',
     `<rect width="297" height="420" fill="${INK}"/><circle cx="148.5" cy="170" r="150" fill="#123726" opacity=".7"/><circle cx="148.5" cy="170" r="120" fill="none" stroke="${GD}" opacity=".45"/><circle cx="148.5" cy="170" r="104" fill="none" stroke="${GD}" opacity=".2" stroke-dasharray="2 5"/>${wm(58,128,181,GOLD)}${t(148.5,262,30,'Открытие',{f:CG,it:1,a:'middle'})}${t(148.5,316,36,'ДД.ММ · 10:00',{w:800,a:'middle',ls:1})}${t(148.5,342,11,'АДРЕС МАГАЗИНА',{c:GD,a:'middle',ls:3})}${t(20,398,9,'ЕЖЕДНЕВНО 10:00–22:00',{o:.7,ls:2})}${b18(247,385,CR)}`)],
   ['store','Табличка «Режим работы»','300 × 200 мм · у входа','Олива и золото, часы — крупно. Обязательная строка о 18+.',svg('0 0 300 200',
     `<rect width="300" height="200" rx="10" fill="${OL}"/><rect x="10" y="10" width="280" height="180" rx="6" fill="none" stroke="${GD}" opacity=".5"/>${mk(26,26,40,GOLD)}${t(76,44,12,'РЕЖИМ РАБОТЫ',{c:GD,ls:3})}${t(76,62,10,'ФАЙЗ',{o:.7,ls:4})}${t(26,112,17,'Ежедневно',{f:CG,it:1})}${t(26,148,36,'10:00 — 22:00',{w:800})}<path d="M26 162H274" stroke="${GD}" opacity=".4"/>${t(26,180,10,'Продажа только лицам старше 18 лет',{o:.75})}`)],
   ['store','Наклейка на дверь','Ø 150 мм · винил','Ставится на входную дверь на уровне глаз.',svg('0 0 220 220',
     `<defs><path id="tplArc" d="M34 110 A76 76 0 0 0 186 110"/></defs><circle cx="110" cy="110" r="104" fill="${INK}" stroke="${GD}" stroke-width="3"/><circle cx="110" cy="110" r="90" fill="none" stroke="${GD}" opacity=".4" stroke-dasharray="2 5"/>${mk(99,32,26,GOLD)}${t(110,130,62,'18+',{w:800,a:'middle'})}<text font-family="${RC}" font-size="9.5" letter-spacing="2" fill="${GD}"><textPath href="#tplArc" startOffset="50%" text-anchor="middle">ТОЛЬКО ДЛЯ СОВЕРШЕННОЛЕТНИХ</textPath></text>`)],
   ['store','Плёнка на витрину','по размеру стекла · матовая','Полоса на высоте 100–160 см: паттерн и логотип. Выше и ниже — прозрачное стекло.',svg('0 0 400 220',
     `<defs><linearGradient id="tplGl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect width="400" height="220" fill="#0b1a14"/><rect width="400" height="220" fill="url(#tplGl)"/><rect y="60" width="400" height="100" fill="${CR}" opacity=".13"/><text x="-20" y="96" font-family="${UF}" font-size="26" fill="${CR}" opacity=".22">Faiz · Quality · Trust · Comfort · Choice · Faiz</text><text x="-60" y="148" font-family="${UF}" font-size="26" fill="${CR}" opacity=".22">Trust · Comfort · Faiz · Quality · Choice · Trust</text>${wm(140,81,120,CR)}${t(12,22,8,'ВИТРИНА',{c:GD,ls:3})}${t(388,206,10,'10:00–22:00 · 18+',{a:'end',o:.8})}<path d="M396 60V160" stroke="${GD}"/>${t(392,114,8,'60 см',{c:GD,a:'end'})}`)],
   ['digital','Пост · ценность','1080 × 1080 px','Цитата курсивом Cormorant на оливе, логотип в углу.',svg('0 0 300 300',
     `<rect width="300" height="300" fill="${OL}"/>${mk(30,30,30,GOLD)}${b18(246,30,CR,.9)}${t(30,124,27,'«Честность продаж',{f:CG,it:1})}${t(30,156,27,'и уверенность',{f:CG,it:1})}${t(30,188,27,'в выборе.»',{f:CG,it:1})}<path d="M30 212H90" stroke="${GD}" stroke-width="2"/>${t(30,234,9,'ЦЕННОСТИ ФАЙЗ',{c:GD,ls:3})}${wm(206,258,70,CR,.85)}`)],
   ['digital','Пост · информация','1080 × 1080 px','Сервисные новости: график, адрес, вакансии. Крем и олива, без фото продукции.',svg('0 0 300 300',
     `<rect width="300" height="300" fill="${CR}"/>${b18(246,26,OL,.9)}${t(30,58,10,'ГРАФИК В ПРАЗДНИКИ',{c:GDK,ls:3})}${[['31.12','10:00–18:00'],['01.01','выходной'],['02.01','12:00–22:00']].map(([d,h],i)=>`${t(30,106+i*40,24,d,{c:OL,w:800})}${t(270,106+i*40,17,h,{c:OL,a:'end',f:CG,it:1})}<path d="M30 ${118+i*40}H270" stroke="${OL}" opacity=".15"/>`).join('')}${wm(30,238,96,OL)}`)],
   ['digital','Пост · фото интерьера','1080 × 1080 px','Интерьер или фасад и изумрудная плашка снизу с логотипом.',svg('0 0 300 300',
     `<image href="img/interior.jpg?v=7" width="300" height="300" preserveAspectRatio="xMidYMid slice"/><rect y="212" width="300" height="88" fill="${INK}" opacity=".88"/>${wm(20,232,92,GOLD)}${t(280,254,14,'Заходите знакомиться',{f:CG,it:1,a:'end'})}${t(280,274,8,'АДРЕС МАГАЗИНА',{c:GD,a:'end',ls:2})}${b18(254,16,CR,.9)}`)],
   ['digital','Слайд презентации','16 : 9 · 1920 × 1080','Тёмный изумруд, заголовок капсом, печать справа. Номер слайда — внизу справа.',svg('0 0 400 225',
     `<rect width="400" height="225" fill="${INK}"/><circle cx="310" cy="112" r="110" fill="#123726" opacity=".6"/>${t(28,40,7,'ФАЙЗ · ПРЕЗЕНТАЦИЯ ДЛЯ ПАРТНЁРОВ',{c:GD,ls:3})}${t(28,98,30,'СТРАТЕГИЯ',{w:800,ls:1})}${t(28,130,30,'РОСТА СЕТИ',{w:800,ls:1})}<path d="M28 146H88" stroke="${GD}" stroke-width="2"/>${t(28,168,10,'Раздел · дата',{o:.7})}<circle cx="310" cy="112" r="70" fill="none" stroke="${GD}" opacity=".6"/><circle cx="310" cy="112" r="56" fill="none" stroke="${GD}" opacity=".3" stroke-dasharray="2 4"/>${mk(298,88,48,GOLD)}${wm(28,196,40,CR,.6)}${t(372,212,9,'01',{c:GD,a:'end'})}`)],
   ['digital','Подпись в письме','600 × 180 px · HTML','Знак, золотая вертикаль, имя и контакты. Без цитат и баннеров.',svg('0 0 400 120',
     `<rect width="400" height="120" rx="8" fill="#fff"/>${mk(20,32,56,OL)}<path d="M80 24V96" stroke="${GD}" stroke-width="2"/>${t(96,44,15,'Имя Фамилия',{c:'#1a1a1a',w:700})}${t(96,62,10,'Консультант · ФАЙЗ',{c:OL})}${t(96,82,10,'+7 000 000-00-00',{c:'#555'})}${t(96,98,9,'Адрес магазина · 18+',{c:'#777'})}`)],
   ['team','Бейдж сотрудника','86 × 54 мм','Имя — крупно, должность — капсом золотом. Одинаковый во всех точках.',svg('0 0 300 190',
     `<rect width="300" height="190" rx="12" fill="${CR}"/><path d="M12 0H288A12 12 0 0 1 300 12V48H0V12A12 12 0 0 1 12 0Z" fill="${OL}"/><rect x="130" y="9" width="40" height="7" rx="3.5" fill="${INK}" opacity=".45"/>${wm(20,14,62,GOLD)}${t(280,34,9,'18+',{a:'end',o:.8})}${t(20,102,32,'Имя',{c:OL,w:800})}${t(20,126,11,'КОНСУЛЬТАНТ',{c:GDK,ls:3})}<path d="M20 146H280" stroke="${OL}" opacity=".15"/>${t(20,172,13,'Спросите меня о линейках',{f:CG,it:1,c:OL})}`)],
   ['team','Поло консультанта','Пике · олива','Форма персонала: знак золотой вышивкой на груди, бейдж с именем, «КОНСУЛЬТАНТ» на спине.',svg('0 0 300 260',
     `<g transform="translate(-6 4) scale(.56)"><path d="M150 30 L200 58 L250 30 L330 52 L392 120 L346 160 L318 136 L318 440 L82 440 L82 136 L54 160 L8 120 L70 52 Z" fill="${OL}"/><rect x="191" y="58" width="18" height="74" rx="2" fill="${OL}" stroke="rgba(0,0,0,.35)"/><path d="M150 30 L128 46 L178 86 L200 58 Z M250 30 L272 46 L222 86 L200 58 Z" fill="${OL}" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>${mk(250,104,26,GOLD)}<rect x="104" y="106" width="56" height="20" rx="3" fill="${CR}"/>${t(132,120,9,'ИМЯ',{c:OL,a:'middle',w:700})}</g>
      <g transform="translate(160 4) scale(.36)"><path d="M146 30 Q200 44 254 30 L330 52 L392 120 L346 160 L318 136 L318 440 L82 440 L82 136 L54 160 L8 120 L70 52 Z" fill="${OL}"/>${wm(152,72,96,GOLD)}${t(200,142,12,'КОНСУЛЬТАНТ',{c:GD,a:'middle',w:700,ls:1.5})}</g>
      ${t(116,252,9,'ПЕРЕД',{c:GD,a:'middle',ls:2})}${t(232,180,9,'СПИНА',{c:GD,a:'middle',ls:2})}`)],
   ['team','Сторис · вакансия','1080 × 1920 px','Тёмный фон, золотая кнопка, знак «Ф» водяным знаком.',svg('0 0 180 320',
     `<rect width="180" height="320" rx="14" fill="${INK}"/><rect x="14" y="14" width="152" height="3" rx="1.5" fill="${CR}" opacity=".25"/><rect x="14" y="14" width="90" height="3" rx="1.5" fill="${CR}"/>${mk(40,150,110,GD,.12)}${b18(138,26,CR,.75)}${t(18,74,19,'Мы ищем',{f:CG,it:1,c:GD})}${t(18,104,20,'КОНСУЛЬТАНТА',{w:800})}${['— обучение по стандарту','— график 2/2','— команда и рост'].map((s,i)=>t(18,136+i*16,9.5,s,{o:.75})).join('')}<rect x="18" y="262" width="144" height="30" rx="15" fill="${GD}"/>${t(90,281,9,'ОТКЛИКНУТЬСЯ',{c:INK,a:'middle',w:700,ls:2})}`)]
  ];
  T.forEach(([cat,title,size,desc,art])=>{const f=document.createElement('figure');f.className='tpl rv';f.dataset.c=cat;
    f.innerHTML=`<div class="tv">${art}</div><figcaption><span>${size}</span><b>${title}</b><small>${desc}</small></figcaption>`;grid.appendChild(f);});
  $$('#tFilter button').forEach(b=>b.addEventListener('click',()=>{const c=b.dataset.c;$$('#tFilter button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    $$('#tGrid .tpl').forEach(f=>{f.hidden=!(c==='all'||f.dataset.c===c);});if(window.ScrollTrigger)ScrollTrigger.refresh();}));}}

/* ---------- partner contacts & KPIs from contacts.js */
{const cfg=window.FAIZ||{},c=cfg.contacts||{},links=[];const clean=v=>String(v||'').trim();
  if(clean(c.email))links.push(['Написать на почту','mailto:'+encodeURIComponent(clean(c.email)).replace('%40','@')+'?subject='+encodeURIComponent('Партнёрство с ФАЙЗ'),clean(c.email)]);
  if(clean(c.telegram)){const tg=clean(c.telegram).replace(/^@|^https?:\/\/t\.me\//,'');if(/^[A-Za-z0-9_]{3,64}$/.test(tg))links.push(['Telegram','https://t.me/'+tg,'@'+tg]);}
  if(clean(c.phone)){const p=clean(c.phone).replace(/[^\d+]/g,'');if(p.length>5)links.push(['Позвонить','tel:'+p,clean(c.phone)]);}
  const mkA=(href,txt,cls)=>{const a=document.createElement('a');a.href=href;a.textContent=txt;if(cls)a.className=cls;if(href.startsWith('https:')){a.target='_blank';a.rel='noopener';}return a;};
  const acts=$('#dealActs'),fc=$('#fContacts');
  links.forEach(([lab,href,show],i)=>{if(acts)acts.appendChild(mkA(href,i?lab:lab+' →',i?'':'main'));if(fc)fc.appendChild(mkA(href,show));});
  if(acts&&!links.length)acts.hidden=true;
  const kp=Array.isArray(cfg.kpi)?cfg.kpi.filter(k=>k&&clean(k.v)&&clean(k.l)):[];
  if(kp.length&&$('#kpis')){$('#kpiWrap').hidden=false;kp.forEach(k=>{const d=document.createElement('div');d.className='rv';const b=document.createElement('b');b.className='gold-text';b.textContent=clean(k.v);const sp=document.createElement('span');sp.textContent=clean(k.l);d.append(b,sp);$('#kpis').appendChild(d);});}}

/* ---------- payback calculator: one series, cumulative cash vs. months */
{const C=$('#calc');if(C){
  const el={inv:$('#cInv'),rev:$('#cRev'),mar:$('#cMar'),opx:$('#cOpx')};
  const money=n=>{const a=Math.abs(n),s=n<0?'−':'';return a>=1e6?s+(a/1e6).toFixed(a>=1e7?0:1).replace('.',',')+' млн ₽':s+Math.round(a/1e3).toLocaleString('ru-RU')+' тыс ₽';};
  const sv=$('#chartSvg'),tip=$('#chartTip');let W=640;const H=300,P={l:64,r:16,t:20,b:34};let data=[],sx,sy;
  const nice=(span)=>{const raw=span/4,p=Math.pow(10,Math.floor(Math.log10(raw)));const m=raw/p;return (m<=1?1:m<=2?2:m<=5?5:10)*p;};
  const draw=()=>{W=sv.clientWidth&&sv.clientWidth<520?400:640;sv.setAttribute('viewBox',`0 0 ${W} ${H}`);const inv=+el.inv.value,rev=+el.rev.value,mar=+el.mar.value/100,opx=+el.opx.value;const pr=rev*mar-opx;
    $('#oInv').textContent=money(inv);$('#oRev').textContent=money(rev);$('#oMar').textContent=el.mar.value+' %';$('#oOpx').textContent=money(opx);
    $('#rProfit').textContent=money(pr);const pay=pr>0?inv/pr:Infinity;$('#rPay').textContent=pr>0?(Math.ceil(pay)+' мес'):'не окупается';
    const N=Math.min(60,Math.max(24,isFinite(pay)?Math.ceil(pay*1.5/6)*6:36));data=Array.from({length:N+1},(_,m)=>-inv+pr*m);
    const lo=Math.min(0,...data),hi=Math.max(0,...data),st=nice(hi-lo||1),y0=Math.floor(lo/st)*st,y1=Math.ceil(hi/st)*st;
    sx=m=>P.l+m/N*(W-P.l-P.r);sy=v=>P.t+(y1-v)/(y1-y0||1)*(H-P.t-P.b);
    let g='';for(let v=y0;v<=y1+1;v+=st)g+=`<path d="M${P.l} ${sy(v)}H${W-P.r}" stroke="rgba(243,235,214,${v===0?.45:.08})"/><text x="${P.l-8}" y="${sy(v)+4}" text-anchor="end" font-size="11" fill="rgba(243,235,214,.55)" font-family="${RC}">${v===0?'0':money(v).replace(' ₽','')}</text>`;
    for(let m=0;m<=N;m+=6)g+=`<text x="${sx(m)}" y="${H-12}" text-anchor="${m===N?'end':'middle'}" font-size="11" fill="rgba(243,235,214,.55)" font-family="${RC}">${m===N?m+' мес':m}</text>`;
    const line=data.map((v,m)=>`${m?'L':'M'}${sx(m).toFixed(1)} ${sy(v).toFixed(1)}`).join('');
    g+=`<path d="${line}L${sx(N)} ${sy(0)}L${sx(0)} ${sy(0)}Z" fill="${GD}" opacity=".1"/><path d="${line}" fill="none" stroke="#e8cf98" stroke-width="2" stroke-linejoin="round"/>`;
    if(isFinite(pay)&&pay<=N){const px=sx(pay),py=sy(0);g+=`<circle cx="${px}" cy="${py}" r="6" fill="#f3e3b8" stroke="${INK}" stroke-width="2"/><text x="${px}" y="${py-14}" text-anchor="${px>W-120?'end':'middle'}" font-size="12" font-weight="700" fill="${CR}" font-family="${RC}">Окупаемость · ${Math.ceil(pay)} мес</text>`;}
    g+=`<path id="cX" d="" stroke="rgba(243,235,214,.35)"/><circle id="cD" r="5" fill="#f3e3b8" stroke="${INK}" stroke-width="2" opacity="0"/><rect x="${P.l}" y="0" width="${W-P.l-P.r}" height="${H}" fill="transparent" id="cHit"/>`;
    sv.innerHTML=g;sv.setAttribute('aria-label',`Накопленный денежный поток за ${N} месяцев: старт ${money(-inv)}, через ${N} мес ${money(data[N])}. ${pr>0?'Окупаемость '+Math.ceil(pay)+' мес.':'При этих вводных точка не окупается.'}`);};
  const hover=e=>{const r=sv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W;const N=data.length-1;let m=Math.round((x-P.l)/(W-P.l-P.r)*N);m=Math.max(0,Math.min(N,m));
    const X=sx(m),Y=sy(data[m]);$('#cX').setAttribute('d',`M${X} ${P.t}V${H-P.b}`);const d=$('#cD');d.setAttribute('cx',X);d.setAttribute('cy',Y);d.setAttribute('opacity',1);
    tip.textContent=`Месяц ${m} · ${money(data[m])}`;tip.style.left=X/W*r.width+'px';tip.style.top=Y/H*r.height+'px';tip.classList.add('on');};
  const leave=()=>{tip.classList.remove('on');const d=$('#cD');if(d)d.setAttribute('opacity',0);const x=$('#cX');if(x)x.setAttribute('d','');};
  sv.addEventListener('pointermove',hover);sv.addEventListener('pointerleave',leave);
  Object.values(el).forEach(i=>i.addEventListener('input',draw));addEventListener('resize',draw);draw();}}
})();
