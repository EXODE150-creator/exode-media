// Copier le seul contact public : aucun message ni donnée n'est envoyé.
(function () {
  var button = document.querySelector('[data-copy-email]');
  var status = document.querySelector('[data-copy-status]');
  if (!button || !status || typeof navigator === 'undefined' || !navigator.clipboard || !navigator.clipboard.writeText) return;
  button.hidden = false;
  button.addEventListener('click', function () {
    navigator.clipboard.writeText('contact@exode-media.com').then(function () {
      status.textContent = 'Adresse copiée. Collez-la dans votre messagerie.';
    }).catch(function () {
      status.textContent = 'La copie automatique n’est pas autorisée. Sélectionnez l’adresse contact@exode-media.com pour la copier manuellement.';
    });
  });
})();

// Même ordre pour toutes les cartes : disponibilité, puis priorité éditoriale.
(function () {
  var ranks = { available: 0, soon: 1, development: 2 };
  document.querySelectorAll('.application-projects').forEach(function (grid) {
    Array.from(grid.children).filter(function (card) { return card.classList.contains('project'); })
      .sort(function (a, b) {
        var first = ranks[a.dataset.availability] ?? 3;
        var second = ranks[b.dataset.availability] ?? 3;
        return first - second || Number(a.dataset.priority) - Number(b.dataset.priority);
      }).forEach(function (card) { grid.appendChild(card); });
  });
})();

// EXODE — vitrine : défilement des captures, visionneuse et chapitres de la vidéo. Aucun appel réseau.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-carousel]').forEach(function (box) {
    var track = box.querySelector('.shots-track');
    var prev = box.querySelector('.shots-nav.prev');
    var next = box.querySelector('.shots-nav.next');
    if (!track || !prev || !next) return;
    function step() { return Math.max(track.clientWidth * 0.8, 180); }
    function update() {
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    }
    prev.addEventListener('click', function () {
      track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' });
    });
    next.addEventListener('click', function () {
      track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' });
    });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  var dialog = document.querySelector('dialog.lightbox');
  if (dialog && typeof dialog.showModal === 'function') {
    var big = dialog.querySelector('img');
    var previousShot;
    document.querySelectorAll('.shot').forEach(function (button) {
      button.addEventListener('click', function () {
        var thumb = button.querySelector('img');
        previousShot = button;
        big.src = thumb.getAttribute('src');
        big.alt = thumb.getAttribute('alt');
        dialog.showModal();
      });
    });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog || event.target.closest('[data-close]')) dialog.close();
    });
    dialog.addEventListener('close', function () { if (previousShot) previousShot.focus(); });
  }

  // Visite guidée (Respire, Dors) : les chapitres n'apparaissent que si ce
  // script tourne, et chacun mène à sa propre vidéo.
  document.querySelectorAll('.video-frame video').forEach(function (video) {
    var section = video.closest('section');
    var chapters = section && section.querySelector('.video-chapters');
    if (!chapters) return;
    chapters.hidden = false;
    chapters.querySelectorAll('[data-video-time]').forEach(function (button) {
      button.addEventListener('click', function () {
        video.currentTime = parseFloat(button.getAttribute('data-video-time')) || 0;
        var playing = video.play();
        if (playing && playing.catch) playing.catch(function () {});
        video.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      });
    });
  });
})();

// Expérience Exode Média : interactions locales et amélioration progressive.
(function () {
  'use strict';
  var root = document.documentElement;
  var preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  var motionButton = document.querySelector('.motion-control');
  var paused = preference.matches;
  var stage = document.querySelector('.orbital-stage');

  function applyMotion() {
    root.classList.toggle('motion-paused', paused || preference.matches);
    if (motionButton) {
      motionButton.hidden = preference.matches;
      motionButton.setAttribute('aria-pressed', String(paused));
      motionButton.textContent = paused ? 'Reprendre les animations' : 'Mettre les animations en pause';
    }
  }
  if (motionButton) motionButton.addEventListener('click', function () {
    paused = !paused;
    applyMotion();
  });
  if (preference.addEventListener) preference.addEventListener('change', function () {
    paused = preference.matches;
    applyMotion();
    if (paused) document.querySelectorAll('.reveal-pending').forEach(function (element) {
      element.classList.remove('reveal-pending');
    });
  });
  applyMotion();

  function syncVisibility() {
    root.classList.toggle('document-hidden', Boolean(document.hidden));
  }
  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
  window.addEventListener('pageshow', function (event) {
    // Safari peut restaurer le DOM et les classes depuis son cache de navigation.
    syncVisibility();
    if (event.persisted) {
      document.querySelectorAll('.reveal-pending').forEach(function (element) {
        element.classList.remove('reveal-pending');
      });
      resetTilt();
    }
  });

  if ('IntersectionObserver' in window && !preference.matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('[data-reveal]').forEach(function (element) {
      // Un élément déjà visible reste visible, même si l’observateur tarde à répondre.
      if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('reveal-pending');
      revealObserver.observe(element);
    });
  }

  var frame = 0;
  function resetTilt() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    if (stage) {
      stage.style.setProperty('--tilt-x', '0deg');
      stage.style.setProperty('--tilt-y', '0deg');
    }
  }
  if (stage && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    stage.addEventListener('pointermove', function (event) {
      if (event.pointerType === 'touch' || paused || preference.matches || frame) return;
      var x = event.clientX;
      var y = event.clientY;
      frame = window.requestAnimationFrame(function () {
        frame = 0;
        if (paused || preference.matches || document.hidden) return;
        var box = stage.getBoundingClientRect();
        if (!box.width || !box.height) return;
        stage.style.setProperty('--tilt-x', ((y - box.top) / box.height * -12 + 6) + 'deg');
        stage.style.setProperty('--tilt-y', ((x - box.left) / box.width * 16 - 8) + 'deg');
        frame = 0;
      });
    }, { passive: true });
    stage.addEventListener('pointerleave', resetTilt);
  }

  var zoom = document.querySelector('.showcase-lightbox');
  var zoomImage = zoom && zoom.querySelector('img');
  var zoomTrigger;
  document.querySelectorAll('[data-screen-gallery]').forEach(function (gallery) {
    var image = gallery.querySelector('[data-gallery-image]');
    var controls = gallery.querySelectorAll('[data-screen]');
    var caption = gallery.querySelector('.demo-caption');
    var trigger = gallery.querySelector('[data-zoom]');
    var request = 0;
    if (!image) return;
    gallery.querySelectorAll('[role="group"]').forEach(function (group) { group.hidden = false; });
    controls.forEach(function (button) {
      button.addEventListener('click', function () {
        var id = ++request;
        var preview = new Image();
        preview.onload = function () {
          if (id !== request) return;
          image.src = preview.src;
          image.alt = button.dataset.alt;
          controls.forEach(function (control) { control.setAttribute('aria-pressed', String(control === button)); });
          if (trigger) {
            trigger.setAttribute('aria-label', 'Agrandir la capture : ' + button.textContent);
            trigger.setAttribute('href', button.dataset.screen);
          }
          if (caption) caption.textContent = button.textContent + ' · Capture réelle, données de démonstration.';
        };
        preview.onerror = function () {
          if (id === request && caption) caption.textContent = 'Cet écran n’a pas pu être chargé. La capture précédente reste disponible.';
        };
        preview.src = button.dataset.screen;
      });
    });
    if (trigger && zoom && typeof zoom.showModal === 'function') trigger.addEventListener('click', function (event) {
      event.preventDefault();
      zoomTrigger = trigger;
      zoomImage.src = image.src;
      zoomImage.alt = image.alt;
      zoom.querySelector('.zoom-caption').textContent = image.alt;
      zoom.showModal();
    });
  });
  if (zoom) {
    zoom.querySelector('[data-zoom-close]').addEventListener('click', function () { zoom.close(); });
    zoom.addEventListener('click', function (event) {
      if (event.target === zoom) {
        var box = zoom.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) zoom.close();
      }
    });
    zoom.addEventListener('close', function () { if (zoomTrigger) zoomTrigger.focus(); });
  }
})();
