/* Soft, time-based motion. No renderer or module fetch needed. */
(()=>{
 const hero=document.querySelector('.hero'),land=document.querySelector('.scene-landscape'),front=document.querySelector('.scene-front');
 if(!hero||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 let tx=0,ty=0,x=0,y=0,frame=0,last=0,visible=true;
 const fine=matchMedia('(pointer:fine)').matches;
 function tick(t){
  const dt=Math.min((t-last)/1000||.016,.05);last=t;
  const ease=1-Math.exp(-dt*2.6);x+=(tx-x)*ease;y+=(ty-y)*ease;
  land.style.transform=`translate3d(${x*10}px,${y*7}px,0)`;
  front.style.transform=`translate3d(${x*15}px,${y*10+Math.sin(t/2600)*2}px,0)`;
  if(visible&&!document.hidden)frame=requestAnimationFrame(tick);else frame=0;
 }
 function start(){if(!frame&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}}
 if(fine){hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();tx=(e.clientX-r.left)/r.width*2-1;ty=(e.clientY-r.top)/r.height*2-1;},{passive:true});hero.addEventListener('pointerleave',()=>{tx=0;ty=0;});}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start();},{threshold:0}).observe(hero);
 document.addEventListener('visibilitychange',start);
 start();
})();
/* One entrance per card; hover is handled on a separate inner element. */
(()=>{
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('motion-visible');observer.unobserve(entry.target);}},{threshold:.08});
 function watch(){document.querySelectorAll('.package-card:not(.motion-ready),.character:not(.motion-ready)').forEach((card,n)=>{card.style.setProperty('--entrance-delay',`${Math.min(n%3,2)*90}ms`);card.classList.add('motion-ready');observer.observe(card);});}
 watch();new MutationObserver(watch).observe(document.querySelector('#package-grid'),{childList:true});
})();
