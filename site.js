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

  // Visite guidée : les chapitres n'apparaissent que si ce script tourne.
  var video = document.getElementById('video-respire');
  var chapters = document.querySelector('.video-chapters');
  if (video && chapters) {
    chapters.hidden = false;
    chapters.querySelectorAll('[data-video-time]').forEach(function (button) {
      button.addEventListener('click', function () {
        video.currentTime = parseFloat(button.getAttribute('data-video-time')) || 0;
        var playing = video.play();
        if (playing && playing.catch) playing.catch(function () {});
        video.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      });
    });
  }
})();
