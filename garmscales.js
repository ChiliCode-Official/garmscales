const header=document.querySelector('.nav-shell');const menu=document.querySelector('.menu');const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;menu?.addEventListener('click',()=>{const open=header.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});header?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{header.classList.remove('open');menu?.setAttribute('aria-expanded','false');if(menu)menu.textContent='☰'}));
document.querySelectorAll('.service-list details,.faq details').forEach(item=>item.addEventListener('toggle',()=>{if(!item.open)return;const scope=item.closest('.service-list,.faq');scope?.querySelectorAll('details').forEach(other=>{if(other!==item)other.open=false})}));
document.querySelectorAll('video').forEach(video=>{video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;video.play().catch(()=>{});video.addEventListener('pause',()=>{if(!document.hidden)video.play().catch(()=>{})})});
if(!reduce){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -8%'});document.querySelectorAll('section:not(.hero) > .wrap, .deployment, .price-card, .video-rail article, .process-grid article').forEach((el,i)=>{el.classList.add('reveal');if(i%4)el.classList.add(`reveal-delay-${i%4}`);observer.observe(el)});let ticking=false;addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{document.documentElement.style.setProperty('--hero-shift',`${Math.min(scrollY*.12,90)}px`);ticking=false})},{passive:true});document.querySelectorAll('.button').forEach(button=>button.addEventListener('pointermove',event=>{const r=button.getBoundingClientRect();button.style.transform=`translate(${(event.clientX-r.left-r.width/2)*.08}px,${(event.clientY-r.top-r.height/2)*.08}px)`}));document.querySelectorAll('.button').forEach(button=>button.addEventListener('pointerleave',()=>{button.style.transform=''}))}
const spotifyLaunch=document.querySelector('.spotify-launch');const spotifyPanel=document.querySelector('.spotify-panel');const closeSpotify=()=>{if(!spotifyPanel)return;spotifyPanel.hidden=true;spotifyLaunch?.setAttribute('aria-expanded','false')};spotifyLaunch?.addEventListener('click',()=>{if(!spotifyPanel)return;spotifyPanel.hidden=false;spotifyLaunch.setAttribute('aria-expanded','true');spotifyPanel.querySelector('.spotify-close')?.focus()});spotifyPanel?.querySelectorAll('[data-spotify-close]').forEach(button=>button.addEventListener('click',closeSpotify));addEventListener('keydown',event=>{if(event.key==='Escape')closeSpotify()});


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


// ── 3D Cylinder Dynamic Dimension & Drag Handler ──
function initCylinderCarousels() {
  document.querySelectorAll('.cylinder-carousel-root').forEach(root => {
    const container = root.querySelector('.cylinder-container');
    if (!container) return;
    const cards = container.querySelectorAll('.cylinder-card');
    const n = cards.length;
    if (n === 0) return;
    
    // Dynamic calculate radius based on card width
    const isMobile = window.innerWidth <= 768;
    const cardWidth = isMobile ? 180 : 220;
    const angleStep = 360 / n;
    const radius = Math.round((cardWidth / 2) / Math.tan(Math.PI / n)) + 30;

    container.style.setProperty('--n', n);
    container.style.setProperty('--w', cardWidth + 'px');
    container.style.setProperty('--ba', (360 / n) + 'deg');
    container.style.setProperty('--tz', radius + 'px');

    cards.forEach((card, idx) => {
      card.style.setProperty('--i', idx);
      const video = card.querySelector('video');
      if (video) {
        video.muted = true;
        video.playsInline = true;
        video.play().catch(() => {});
      }
    });

    // Pause on hover
    root.addEventListener('mouseenter', () => {
      container.style.animationPlayState = 'paused';
    });
    root.addEventListener('mouseleave', () => {
      container.style.animationPlayState = 'running';
    });
  });
}
initCylinderCarousels();
window.addEventListener('resize', initCylinderCarousels);
