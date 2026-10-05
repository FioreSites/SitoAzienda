(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse=matchMedia('(pointer: coarse)').matches;
$('#yr').textContent=new Date().getFullYear();

/* menu */
const nav=$('#nav'),menu=$('#menu'),burger=$('#burger');
const setMenu=o=>{menu.classList.toggle('open',o);nav.classList.toggle('open',o);menu.inert=!o;
 burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Chiudi il menu':'Apri il menu');
 document.documentElement.style.overflow=o?'hidden':''};
burger.onclick=()=>setMenu(!menu.classList.contains('open'));
menu.querySelectorAll('a').forEach(a=>a.onclick=()=>setMenu(false));
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

/* smooth scroll (wheel interpolation, desktop only) */
let target=scrollY,cur=scrollY,raf=0,smooth=!reduce&&!coarse;
const max=()=>document.documentElement.scrollHeight-innerHeight;
function tick(){cur+=(target-cur)*.1;if(Math.abs(target-cur)<.4){cur=target;raf=0}else raf=requestAnimationFrame(tick);scrollTo(0,cur)}
if(smooth){
 addEventListener('wheel',e=>{if(e.ctrlKey||menu.classList.contains('open'))return;e.preventDefault();
  target=Math.max(0,Math.min(max(),target+e.deltaY));if(!raf)raf=requestAnimationFrame(tick)},{passive:false});
 addEventListener('scroll',()=>{if(!raf){target=cur=scrollY}},{passive:true});
}
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
 const id=a.getAttribute('href'),el=id==='#top'?document.body:$(id);if(!el)return;e.preventDefault();
 const y=id==='#top'?0:el.getBoundingClientRect().top+scrollY;
 if(smooth){target=Math.min(max(),y);if(!raf)raf=requestAnimationFrame(tick)}else scrollTo({top:y,behavior:reduce?'auto':'smooth'})}));

/* scroll-linked: nav, hero veil, parallax */
const veil=$('#veil'),heroIn=$('#heroIn'),pars=$$('[data-speed]'),ctaBg=$('#ctaBg'),tones=$$('[data-tone]');
let last=0;
function frame(){
 const y=scrollY,h=innerHeight;
 /* hero darkening: proportional to distance scrolled */
 const p=Math.min(1,y/(h*.85));
 veil.style.opacity=(.18+p*.82).toFixed(3);
 if(!reduce){heroIn.style.transform=`translateY(${y*-.12}px)`;heroIn.style.opacity=Math.max(0,1-p*1.3)}
 /* nav direction + contrast */
 if(!menu.classList.contains('open')){
  nav.classList.toggle('hide',y>last&&y>80);
  if(y<20)nav.classList.remove('hide');
 }
 last=y;
 const probe=tones.filter(s=>{const r=s.getBoundingClientRect();return r.top<=36&&r.bottom>36}).pop();
 nav.classList.toggle('ink',!!probe&&probe.dataset.tone==='light');
 /* parallax */
 if(!reduce){const k=innerWidth<720?.45:1;
  pars.forEach(el=>{const r=el.parentElement.getBoundingClientRect();
   if(r.bottom<-100||r.top>h+100)return;
   el.style.transform=`translate3d(0,${((r.top+r.height/2-h/2)*-el.dataset.speed*k).toFixed(1)}px,0)`});
 }
}
let tk=false;const req=()=>{if(!tk){tk=true;requestAnimationFrame(()=>{tk=false;frame()})}};
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);frame();

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.2});
$$('.rv').forEach((el,i)=>{io.observe(el)});
})();