const header=document.querySelector('.nav-shell');const menu=document.querySelector('.menu');const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;menu?.addEventListener('click',()=>{const open=header.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});header?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{header.classList.remove('open');menu?.setAttribute('aria-expanded','false');if(menu)menu.textContent='☰'}));
document.querySelectorAll('.service-list details,.faq details').forEach(item=>item.addEventListener('toggle',()=>{if(!item.open)return;const scope=item.closest('.service-list,.faq');scope?.querySelectorAll('details').forEach(other=>{if(other!==item)other.open=false})}));
document.querySelectorAll('video').forEach(video=>{video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;video.play().catch(()=>{});video.addEventListener('pause',()=>{if(!document.hidden)video.play().catch(()=>{})})});
if(!reduce){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -8%'});document.querySelectorAll('section:not(.hero) > .wrap, .deployment, .price-card, .video-rail article, .process-grid article').forEach((el,i)=>{el.classList.add('reveal');if(i%4)el.classList.add(`reveal-delay-${i%4}`);observer.observe(el)});let ticking=false;addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{document.documentElement.style.setProperty('--hero-shift',`${Math.min(scrollY*.12,90)}px`);ticking=false})},{passive:true});document.querySelectorAll('.button').forEach(button=>button.addEventListener('pointermove',event=>{const r=button.getBoundingClientRect();button.style.transform=`translate(${(event.clientX-r.left-r.width/2)*.08}px,${(event.clientY-r.top-r.height/2)*.08}px)`}));document.querySelectorAll('.button').forEach(button=>button.addEventListener('pointerleave',()=>{button.style.transform=''}))}
const spotifyLaunch=document.querySelector('.spotify-launch');const spotifyPanel=document.querySelector('.spotify-panel');const spotifyCard=spotifyPanel?.querySelector('.spotify-card');const closeSpotify=()=>{if(!spotifyPanel)return;spotifyPanel.hidden=true;spotifyCard?.classList.remove('is-floating','is-dragging');if(spotifyCard){spotifyCard.style.left='';spotifyCard.style.top='';spotifyCard.style.right='';spotifyCard.style.bottom=''}spotifyLaunch?.setAttribute('aria-expanded','false')};spotifyLaunch?.addEventListener('click',()=>{if(!spotifyPanel)return;spotifyPanel.hidden=false;spotifyLaunch.setAttribute('aria-expanded','true');spotifyPanel.querySelector('.spotify-close')?.focus()});spotifyPanel?.querySelectorAll('[data-spotify-close]').forEach(button=>button.addEventListener('click',closeSpotify));spotifyPanel?.querySelector('.spotify-float-toggle')?.addEventListener('click',event=>{spotifyCard?.classList.add('is-floating');event.currentTarget.textContent='Reproduciendo mientras navegas ✓'});let spotifyDragging=false;let spotifyStartX=0;let spotifyStartY=0;let spotifyStartLeft=0;let spotifyStartTop=0;spotifyCard?.querySelector('.spotify-drag-handle')?.addEventListener('pointerdown',event=>{if(!spotifyCard.classList.contains('is-floating'))return;spotifyDragging=true;spotifyStartX=event.clientX;spotifyStartY=event.clientY;const box=spotifyCard.getBoundingClientRect();spotifyStartLeft=box.left;spotifyStartTop=box.top;spotifyCard.classList.add('is-dragging');spotifyCard.setPointerCapture?.(event.pointerId)});spotifyCard?.addEventListener('pointermove',event=>{if(!spotifyDragging)return;spotifyCard.style.left=`${Math.max(8,Math.min(innerWidth-spotifyCard.offsetWidth-8,spotifyStartLeft+event.clientX-spotifyStartX))}px`;spotifyCard.style.top=`${Math.max(8,Math.min(innerHeight-spotifyCard.offsetHeight-8,spotifyStartTop+event.clientY-spotifyStartY))}px`;spotifyCard.style.right='auto';spotifyCard.style.bottom='auto'});spotifyCard?.addEventListener('pointerup',event=>{spotifyDragging=false;spotifyCard.classList.remove('is-dragging');spotifyCard.releasePointerCapture?.(event.pointerId)});addEventListener('keydown',event=>{if(event.key==='Escape')closeSpotify()});


// ── MorphText Auto-Generator / Configurator ──
document.querySelectorAll('.morph-text-wrapper').forEach(wrapper => {
  const wordsAttr = wrapper.getAttribute('data-words');
  const intervalAttr = parseInt(wrapper.getAttribute('data-interval') || '2800', 10);
  if (!wordsAttr) return;
  try {
    const words = JSON.parse(wordsAttr);
    if (!Array.isArray(words) || words.length === 0) return;
    const rotator = wrapper.querySelector('.morph-word-rotator');
    if (!rotator) return;
    
    rotator.innerHTML = '';
    const wordDuration = intervalAttr / 1000;
    const totalDuration = wordDuration * words.length;

    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'morph-word';
      span.textContent = w;
      span.style.animationDelay = (i * wordDuration) + 's';
      span.style.animationDuration = totalDuration + 's';
      rotator.appendChild(span);
    });
  } catch(e) {}
});


// ── 3D Cylinder: rotación automática + arrastre con mouse y dedo ──
function initCylinderCarousels() {
  document.querySelectorAll('.cylinder-carousel-root').forEach(root => {
    const container = root.querySelector('.cylinder-container');
    if (!container) return;
    const cards = container.querySelectorAll('.cylinder-card');
    const n = cards.length;
    if (!n) return;
    const cardWidth = window.innerWidth <= 768 ? 180 : 220;
    const radius = Math.round((cardWidth / 2) / Math.tan(Math.PI / n)) + 30;
    container.style.setProperty('--w', `${cardWidth}px`);
    container.style.setProperty('--ba', `${360 / n}deg`);
    container.style.setProperty('--tz', `${radius}px`);
    cards.forEach((card, index) => {
      card.style.setProperty('--i', index);
      const video = card.querySelector('video');
      if (video) { video.muted = true; video.playsInline = true; video.play().catch(() => {}); }
    });
    if (root.dataset.cylinderReady) return;
    root.dataset.cylinderReady = 'true';
    let rotation = 0;
    let dragging = false;
    let lastX = 0;
    let lastFrame = performance.now();
    const render = now => {
      if (!dragging && !reduce) rotation = (rotation + (now - lastFrame) * 0.012) % 360;
      container.style.transform = `rotateY(${rotation}deg)`;
      lastFrame = now;
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
    const start = event => { dragging = true; lastX = event.clientX; container.setPointerCapture?.(event.pointerId); root.classList.add('is-dragging'); };
    const move = event => { if (!dragging) return; rotation += (event.clientX - lastX) * 0.38; lastX = event.clientX; };
    const end = event => { if (!dragging) return; dragging = false; container.releasePointerCapture?.(event.pointerId); root.classList.remove('is-dragging'); };
    container.addEventListener('pointerdown', start);
    container.addEventListener('pointermove', move);
    container.addEventListener('pointerup', end);
    container.addEventListener('pointercancel', end);
    root.addEventListener('wheel', event => {
      rotation += event.deltaY * 0.22;
      lastFrame = performance.now();
    }, { passive: true });
  });
}
initCylinderCarousels();
window.addEventListener('resize', initCylinderCarousels, { passive: true });
const sectionOrder=['#inicio','#fundador','#despliegues','#servicios','#cultura','#proceso','.testimonials','.why','.orbit-section','#planes','.faq','#contacto'];
const siteMain=document.querySelector('main');
if(siteMain){sectionOrder.forEach(selector=>{const section=document.querySelector(selector);if(section)siteMain.appendChild(section)})}
const accelMode=document.querySelector('#accel-mode');const accelControl=document.querySelector('.accel-control');const accelWrapper=document.querySelector('.morph-text-wrapper');let accelBurst=document.createElement('div');accelBurst.className='accel-burst';document.body.appendChild(accelBurst);const prepareAccel=()=>{accelWrapper?.querySelectorAll('.morph-word').forEach(word=>{if(word.dataset.accelReady)return;word.dataset.accelReady='true';word.innerHTML=[...word.textContent].map(char=>`<span class="accel-letter">${char===' '?'&nbsp;':char}</span>`).join('')})};accelMode?.addEventListener('change',()=>{accelControl?.classList.toggle('is-active',accelMode.checked);if(accelMode.checked)prepareAccel()});accelWrapper?.addEventListener('click',event=>{const letter=event.target.closest('.accel-letter');if(!accelMode?.checked||!letter)return;accelBurst.classList.remove('is-visible');void accelBurst.offsetWidth;accelBurst.classList.add('is-visible');accelWrapper.querySelectorAll('.accel-letter').forEach((item,index)=>{item.style.setProperty('--x',`${(Math.random()-.5)*70}vw`);item.style.setProperty('--r',`${(Math.random()-.5)*900}deg`);item.style.setProperty('--delay',`${Math.random()*.35}s`);item.classList.add('is-launched');setTimeout(()=>item.classList.remove('is-launched'),1800)});setTimeout(()=>accelBurst.classList.remove('is-visible'),2100)});
accelWrapper?.addEventListener('click',event=>{if(!accelMode?.checked||!event.target.closest('.accel-letter'))return;accelBurst.style.left=`${event.clientX}px`;accelBurst.style.top=`${event.clientY}px`});
document.addEventListener('click',event=>{if(!accelMode?.checked||event.target.closest('.morph-text-wrapper,.accel-control,.spotify-launch,.spotify-panel'))return;accelBurst.style.left=`${event.clientX}px`;accelBurst.style.top=`${event.clientY}px`;accelBurst.classList.remove('is-visible');void accelBurst.offsetWidth;accelBurst.classList.add('is-visible');accelWrapper?.querySelectorAll('.accel-letter').forEach(item=>{item.style.setProperty('--x',`${(Math.random()-.5)*70}vw`);item.style.setProperty('--r',`${(Math.random()-.5)*900}deg`);item.style.setProperty('--delay',`${Math.random()*.35}s`);item.classList.add('is-launched');setTimeout(()=>item.classList.remove('is-launched'),1800)});setTimeout(()=>accelBurst.classList.remove('is-visible'),2100)});
spotifyPanel?.querySelector('.spotify-float-toggle')?.addEventListener('click',()=>spotifyPanel.classList.add('is-floating'));spotifyPanel?.querySelectorAll('[data-spotify-close]').forEach(button=>button.addEventListener('click',()=>spotifyPanel.classList.remove('is-floating')));
