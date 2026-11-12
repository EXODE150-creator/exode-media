// Guide d'installation de Respire : adapte la page au téléphone. Aucun appel réseau.
(function () {
  var ua = navigator.userAgent || '';
  var android = /Android/i.test(ua);
  var ios = /iPhone|iPad|iPod/i.test(ua);
  var inApp = /FBAN|FBAV|FB_IAB|Instagram|Snapchat|Messenger|Line\/|; wv\)/i.test(ua);

  // Sur iPhone, les étapes iPhone passent avant celles d'Android.
  if (ios) {
    document.getElementById('avis-iphone').hidden = false;
    var iphone = document.getElementById('iphone');
    var android_ = document.getElementById('android');
    if (iphone && android_) android_.parentNode.insertBefore(iphone, android_);
  }

  // Le navigateur intégré d'une appli (Facebook, Messenger…) ne sait pas
  // installer un APK : on ouvre le lien dans Chrome, avec repli sur le lien normal.
  if (android && inApp) {
    document.getElementById('avis-appli').hidden = false;
    document.querySelectorAll('a[data-chrome]').forEach(function (a) {
      var u = new URL(a.href);
      a.href = 'intent://' + u.host + u.pathname + u.search +
        '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' +
        encodeURIComponent(u.href) + ';end';
    });
  }

  var copier = document.getElementById('copier');
  if (copier) {
    copier.addEventListener('click', function () {
      var url = copier.getAttribute('data-url');
      var ok = function () { copier.textContent = 'Lien copié ✓'; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(ok, function () { window.prompt('Copie ce lien :', url); });
      } else {
        window.prompt('Copie ce lien :', url);
      }
    });
  }
})();
