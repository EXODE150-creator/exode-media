// Page de secours du lien d'activation de Dors complet.
// Le code est dans le fragment (#…) : le navigateur ne l'envoie jamais au site.
// Rien n'est transmis : le code est seulement affiché, copié, ou passé à Dors
// sur ce téléphone par le lien dors://activer.
(function () {
  "use strict";
  var fragment = "";
  try {
    fragment = decodeURIComponent(location.hash || "");
  } catch (e) {
    fragment = location.hash || "";
  }
  // « DORS- » puis 91 caractères base 64 (URL), 96 en tout.
  var match = /DORS-[A-Za-z0-9_-]{91}(?![A-Za-z0-9_-])/i.exec(fragment);
  if (!match) return;
  var code = "DORS-" + match[0].slice(5);

  document.getElementById("sans-code").hidden = true;
  document.getElementById("avec-code").hidden = false;
  document.getElementById("code").textContent = code;
  document.getElementById("ouvrir").href =
    "dors://activer?code=" + encodeURIComponent(code);

  var status = document.getElementById("copie");
  document.getElementById("copier").addEventListener("click", function () {
    function done() {
      status.textContent = "Code copié. Collez-le dans Dors, page « Dors complet ».";
    }
    function manual() {
      var range = document.createRange();
      range.selectNodeContents(document.getElementById("code"));
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = "Le code est sélectionné : copiez-le avec le menu du téléphone.";
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(done, manual);
    } else {
      manual();
    }
  });
})();
