// GARMSCALES Core Engine — Performance & UX Optimized
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  // ── Header & Navigation ──
  const header = document.querySelector('.nav-shell');
  const menu = document.querySelector('.menu');
  if (menu && header) {
    menu.addEventListener('click', () => {
      const open = header.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.textContent = open ? '×' : '☰';
    });
    header.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
        menu.textContent = '☰';
      });
    });
  }

  // ── Accordions (Service list & FAQ single-open) ──
  document.querySelectorAll('.service-list details, .faq details').forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      const scope = item.closest('.service-list, .faq');
      scope?.querySelectorAll('details').forEach(other => {
        if (other !== item) other.open = false;
      });
    });
  });

  // ── High-Performance Viewport-Aware Video Management ──
  const videoElements = document.querySelectorAll('video:not(.accel-burst video)');
  videoElements.forEach(video => {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
  });

  // Dedicated Video Observer to play only when in viewport & pause when offscreen
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (video.preload !== 'auto') {
            video.preload = 'auto';
            video.load();
          }
          if (video.paused && !document.hidden) {
            video.play().catch(() => {});
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, { threshold: 0.01, rootMargin: '600px 0px 600px 0px' });

    videoElements.forEach(video => videoObserver.observe(video));

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        videoElements.forEach(v => { if (!v.paused) v.pause(); });
      } else {
        videoElements.forEach(v => {
          const rect = v.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            v.play().catch(() => {});
          }
        });
      }
    });
  } else {
    videoElements.forEach(video => video.play().catch(() => {}));
  }

  // ── Section Reordering (Maintained exactly) ──
  const sectionOrder = ['#inicio', '#fundador', '#despliegues', '#servicios', '#cultura', '#proceso', '.testimonials', '.why', '.orbit-section', '#planes', '.faq', '#contacto'];
  const siteMain = document.querySelector('main');
  if (siteMain) {
    sectionOrder.forEach(selector => {
      const section = document.querySelector(selector);
      if (section) siteMain.appendChild(section);
    });
  }

  // ── Scroll Reveals & Parallax ──
  if (!reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -4%' });

    document.querySelectorAll('section:not(.hero) > .wrap, .deployment, .price-card, .video-rail article, .process-grid article').forEach((el, i) => {
      el.classList.add('reveal');
      if (i % 4) el.classList.add(`reveal-delay-${i % 4}`);
      revealObserver.observe(el);
    });

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight) {
            heroContent.style.transform = `translate3d(0, ${Math.min(scrollY * 0.12, 90)}px, 0)`;
          }
          ticking = false;
        });
      }, { passive: true });
    }

    // Magnetic button hover effect (only on fine pointer / desktop mouse)
    if (isFinePointer) {
      document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('pointermove', event => {
          const r = button.getBoundingClientRect();
          button.style.transform = `translate(${(event.clientX - r.left - r.width / 2) * 0.08}px, ${(event.clientY - r.top - r.height / 2) * 0.08}px)`;
        });
        button.addEventListener('pointerleave', () => {
          button.style.transform = '';
        });
      });
    }
  }

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

  // ── 3D Cylinder Carousel (Optimized with Visibility Pausing) ──
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
      });

      if (root.dataset.cylinderReady) return;
      root.dataset.cylinderReady = 'true';

      let rotation = 0;
      let dragging = false;
      let isVisible = false;
      let lastX = 0;
      let lastFrame = performance.now();
      let rAFId = 0;

      const render = (now) => {
        if (!isVisible && !dragging) {
          rAFId = 0;
          return;
        }
        if (!dragging && !reduceMotion) {
          rotation = (rotation + (now - lastFrame) * 0.012) % 360;
        }
        container.style.transform = `rotateY(${rotation}deg)`;
        lastFrame = now;
        rAFId = requestAnimationFrame(render);
      };

      const startRender = () => {
        if (!rAFId) {
          lastFrame = performance.now();
          rAFId = requestAnimationFrame(render);
        }
      };

      // Observe visibility to pause rAF loop when offscreen
      if ('IntersectionObserver' in window) {
        const cylObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              startRender();
            }
          });
        }, { threshold: 0.01, rootMargin: '150px' });
        cylObserver.observe(root);
      } else {
        isVisible = true;
        startRender();
      }

      const start = event => {
        dragging = true;
        lastX = event.clientX;
        container.setPointerCapture?.(event.pointerId);
        root.classList.add('is-dragging');
        startRender();
      };
      const move = event => {
        if (!dragging) return;
        rotation += (event.clientX - lastX) * 0.38;
        lastX = event.clientX;
      };
      const end = event => {
        if (!dragging) return;
        dragging = false;
        container.releasePointerCapture?.(event.pointerId);
        root.classList.remove('is-dragging');
      };

      container.addEventListener('pointerdown', start);
      container.addEventListener('pointermove', move);
      container.addEventListener('pointerup', end);
      container.addEventListener('pointercancel', end);
    });
  }
  initCylinderCarousels();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initCylinderCarousels, 150);
  }, { passive: true });

  // ── Spotify Panel System ──
  const spotifyLaunch = document.querySelector('.spotify-launch');
  const spotifyPanel = document.querySelector('.spotify-panel');
  const spotifyCard = spotifyPanel?.querySelector('.spotify-card');

  const closeSpotify = () => {
    if (!spotifyPanel) return;
    spotifyPanel.hidden = true;
    spotifyCard?.classList.remove('is-floating', 'is-dragging');
    spotifyPanel.classList.remove('is-floating');
    if (spotifyCard) {
      spotifyCard.style.left = '';
      spotifyCard.style.top = '';
      spotifyCard.style.right = '';
      spotifyCard.style.bottom = '';
    }
    spotifyLaunch?.setAttribute('aria-expanded', 'false');
  };

  spotifyLaunch?.addEventListener('click', () => {
    if (!spotifyPanel) return;
    spotifyPanel.hidden = false;
    spotifyLaunch.setAttribute('aria-expanded', 'true');
    spotifyPanel.querySelector('.spotify-close')?.focus();
  });

  spotifyPanel?.querySelectorAll('[data-spotify-close]').forEach(button => {
    button.addEventListener('click', closeSpotify);
  });

  spotifyPanel?.querySelector('.spotify-float-toggle')?.addEventListener('click', event => {
    spotifyCard?.classList.add('is-floating');
    spotifyPanel.classList.add('is-floating');
    event.currentTarget.textContent = 'Reproduciendo mientras navegas ✓';
  });

  let spotifyDragging = false;
  let spotifyStartX = 0, spotifyStartY = 0, spotifyStartLeft = 0, spotifyStartTop = 0;

  spotifyCard?.querySelector('.spotify-drag-handle')?.addEventListener('pointerdown', event => {
    if (!spotifyCard.classList.contains('is-floating')) return;
    spotifyDragging = true;
    spotifyStartX = event.clientX;
    spotifyStartY = event.clientY;
    const box = spotifyCard.getBoundingClientRect();
    spotifyStartLeft = box.left;
    spotifyStartTop = box.top;
    spotifyCard.classList.add('is-dragging');
    spotifyCard.setPointerCapture?.(event.pointerId);
  });

  spotifyCard?.addEventListener('pointermove', event => {
    if (!spotifyDragging) return;
    spotifyCard.style.left = `${Math.max(8, Math.min(innerWidth - spotifyCard.offsetWidth - 8, spotifyStartLeft + event.clientX - spotifyStartX))}px`;
    spotifyCard.style.top = `${Math.max(8, Math.min(innerHeight - spotifyCard.offsetHeight - 8, spotifyStartTop + event.clientY - spotifyStartY))}px`;
    spotifyCard.style.right = 'auto';
    spotifyCard.style.bottom = 'auto';
  });

  spotifyCard?.addEventListener('pointerup', event => {
    spotifyDragging = false;
    spotifyCard.classList.remove('is-dragging');
    spotifyCard.releasePointerCapture?.(event.pointerId);
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeSpotify();
  });

  spotifyPanel?.addEventListener('pointerdown', event => {
    if (event.target.closest('.spotify-close')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeSpotify();
    }
  }, true);

  // ── "Aceléralo" Easter Egg (Lazy Loaded Porsche Video) ──
  const accelMode = document.querySelector('#accel-mode');
  const accelControl = document.querySelector('.accel-control');
  const accelWrapper = document.querySelector('.morph-text-wrapper');
  let accelBurst = document.createElement('div');
  accelBurst.className = 'accel-burst';
  document.body.appendChild(accelBurst);

  let accelVideo = null;
  const getAccelVideo = () => {
    if (!accelVideo) {
      accelVideo = document.createElement('video');
      accelVideo.src = './video%20porche.webm';
      accelVideo.preload = 'auto';
      accelVideo.playsInline = true;
      accelVideo.volume = 0.9;
      accelBurst.replaceChildren(accelVideo);
    }
    return accelVideo;
  };

  const prepareAccel = () => {
    accelWrapper?.querySelectorAll('.morph-word').forEach(word => {
      if (word.dataset.accelReady) return;
      word.dataset.accelReady = 'true';
      word.innerHTML = word.textContent.trim().split(/\s+/).map(val => `<span class="accel-letter">${val}</span>`).join(' ');
    });
  };

  const prepareHeadingFalls = () => {
    document.querySelectorAll('main h2, main h3').forEach(title => {
      if (title.dataset.accelReady || title.closest('.spotify-card')) return;
      title.dataset.accelReady = 'true';
      title.innerHTML = title.textContent.trim().split(/\s+/).map(val => `<span class="accel-letter">${val}</span>`).join(' ');
    });
  };

  // Prepare the easter egg during the initial load so the first click works.
  prepareAccel();
  prepareHeadingFalls();
  const primedAccelVideo = getAccelVideo();
  primedAccelVideo.load();

  accelMode?.addEventListener('change', () => {
    const isChecked = accelMode.checked;
    accelControl?.classList.toggle('is-active', isChecked);
    if (isChecked) {
      getAccelVideo();
      prepareAccel();
      prepareHeadingFalls();
    }
  });

  const launchLetters = (parent, clientX, clientY) => {
    const vid = getAccelVideo();
    accelBurst.style.left = `${clientX}px`;
    accelBurst.style.top = `${clientY}px`;
    accelBurst.classList.remove('is-visible');
    void accelBurst.offsetWidth;
    accelBurst.classList.add('is-visible');

    vid.currentTime = 0;
    vid.play().catch(() => {});
    setTimeout(() => {
      vid.pause();
      accelBurst.classList.remove('is-visible');
    }, 1500);

    const letters = parent.querySelectorAll('.accel-letter');
    letters.forEach(item => {
      item.style.setProperty('--x', `${(Math.random() - 0.5) * 70}vw`);
      item.style.setProperty('--r', `${(Math.random() - 0.5) * 900}deg`);
      item.style.setProperty('--delay', `${Math.random() * 0.35}s`);
      item.classList.add('is-launched');
      setTimeout(() => item.classList.remove('is-launched'), 1800);
    });
  };

  document.addEventListener('click', event => {
    if (!accelMode?.checked || event.target.closest('.accel-control, .spotify-launch, .spotify-panel, .spotify-close')) return;
    const letter = event.target.closest('.accel-letter');
    if (letter) {
      event.stopImmediatePropagation();
      const vid = getAccelVideo();
      accelBurst.style.left = `${event.clientX}px`;
      accelBurst.style.top = `${event.clientY}px`;
      accelBurst.classList.remove('is-visible');
      void accelBurst.offsetWidth;
      accelBurst.classList.add('is-visible');
      vid.currentTime = 0;
      vid.play().catch(() => {});
      setTimeout(() => { vid.pause(); accelBurst.classList.remove('is-visible'); }, 1500);
      letter.style.setProperty('--x', `${(Math.random() - 0.5) * 80}vw`);
      letter.style.setProperty('--r', `${(Math.random() - 0.5) * 1080}deg`);
      letter.style.setProperty('--delay', '0s');
      letter.classList.add('is-launched');
      setTimeout(() => letter.classList.remove('is-launched'), 1800);
      return;
    }
    if (!event.target.closest('.morph-text-wrapper')) {
      if (accelWrapper) {
        launchLetters(accelWrapper, event.clientX, event.clientY);
      }
    }
  }, true);

  new MutationObserver(records => records.forEach(record => {
    if (record.attributeName !== 'class') return;
    const letter = record.target;
    if (!letter.classList?.contains('accel-letter')) return;
    if (letter.classList.contains('is-launched')) {
      if (!letter.dataset.accelHoldUntil) {
        letter.dataset.accelHoldUntil = String(Date.now() + 15000);
        setTimeout(() => {
          if (Number(letter.dataset.accelHoldUntil) <= Date.now()) {
            letter.classList.remove('is-launched');
            delete letter.dataset.accelHoldUntil;
          }
        }, 15000);
      }
    } else if (Number(letter.dataset.accelHoldUntil) > Date.now()) {
      letter.classList.add('is-launched');
    } else {
      delete letter.dataset.accelHoldUntil;
    }
  })).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });

  // ── Crowd Canvas Animation (Viewport Paused) ──
  document.querySelectorAll('.cta, .plan-cta').forEach(section => {
    const canvas = document.createElement('canvas');
    canvas.className = 'crowd-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    section.prepend(canvas);
    const context = canvas.getContext('2d');
    const sprite = new Image();
    const people = [];
    let width = 0, height = 0, frameId = 0, isCanvasVisible = false;

    const setup = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context?.setTransform(ratio, 0, 0, ratio, 0, 0);
      people.length = 0;
      const count = Math.max(9, Math.min(18, Math.round(width / 95)));
      for (let i = 0; i < count; i++) {
        people.push({
          x: Math.random() * width,
          y: height - (70 + Math.random() * 180),
          speed: 0.25 + Math.random() * 0.6,
          scale: 0.5 + Math.random() * 0.52,
          frame: Math.floor(Math.random() * 105),
          flip: Math.random() > 0.5 ? 1 : -1
        });
      }
    };

    const draw = () => {
      if (!context || !sprite.complete || !isCanvasVisible) {
        frameId = 0;
        return;
      }
      context.clearRect(0, 0, width, height);
      const cellWidth = sprite.naturalWidth / 15;
      const cellHeight = sprite.naturalHeight / 7;
      for (let i = 0; i < people.length; i++) {
        const p = people[i];
        p.x += p.speed * p.flip;
        if (p.flip > 0 && p.x > width + cellWidth) p.x = -cellWidth;
        if (p.flip < 0 && p.x < -cellWidth) p.x = width + cellWidth;
        const column = p.frame % 15;
        const row = Math.floor(p.frame / 15);
        context.save();
        context.translate(p.x, p.y);
        context.scale(p.flip * p.scale, p.scale);
        context.drawImage(sprite, column * cellWidth, row * cellHeight, cellWidth, cellHeight, 0, 0, cellWidth, cellHeight);
        context.restore();
      }
      frameId = requestAnimationFrame(draw);
    };

    const startDraw = () => {
      if (!frameId && isCanvasVisible && sprite.complete) {
        frameId = requestAnimationFrame(draw);
      }
    };

    if ('IntersectionObserver' in window) {
      const cObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          isCanvasVisible = entry.isIntersecting;
          if (isCanvasVisible) startDraw();
          else if (frameId) {
            cancelAnimationFrame(frameId);
            frameId = 0;
          }
        });
      }, { threshold: 0.05, rootMargin: '100px' });
      cObserver.observe(section);
    } else {
      isCanvasVisible = true;
    }

    sprite.onload = () => {
      setup();
      if (isCanvasVisible) startDraw();
    };
    sprite.src = './open-peeps-sheet.png';

    window.addEventListener('resize', setup, { passive: true });
    section.addEventListener('DOMNodeRemoved', () => {
      if (frameId) cancelAnimationFrame(frameId);
    }, { once: true });
  });

})();
