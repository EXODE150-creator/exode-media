// EXODE — vitrine : défilement des captures et visionneuse. Aucun appel réseau.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Les contenus restent visibles sans JavaScript et sans IntersectionObserver.
  if (!reduce && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-enter');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.home .app-card, .home .pledge, .home .band').forEach(function (item) {
      observer.observe(item);
    });
  }

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
    document.querySelectorAll('.shot').forEach(function (button) {
      button.addEventListener('click', function () {
        var thumb = button.querySelector('img');
        big.src = thumb.getAttribute('src');
        big.alt = thumb.getAttribute('alt');
        dialog.showModal();
      });
    });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog || event.target.closest('[data-close]')) dialog.close();
    });
  }
})();
