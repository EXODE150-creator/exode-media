// Page des versions de Dors. Le bouton « Vérifier les mises à jour » de
// l'appli ouvre /dors/version/#1.2.0 : la version installée est dans le
// fragment, que le navigateur n'envoie jamais au site. Rien n'est transmis :
// elle est seulement comparée ici à la dernière version.
(function () {
  "use strict";
  var line = document.getElementById("installee");
  var latest = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(
    document.getElementById("derniere").getAttribute("data-version") || ""
  );

  function show() {
    var match = /^#(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(location.hash || "");
    line.hidden = true;
    if (!match || !latest) return;

    var installed = match.slice(1).join(".");
    var order = 0;
    for (var i = 1; i <= 3 && order === 0; i++) {
      order = Number(match[i]) - Number(latest[i]);
    }
    if (order < 0) {
      line.textContent = "Vous avez la version " + installed + ". La " +
        latest[0] + " est plus récente : vous pouvez l'installer par-dessus, " +
        "vos données sont gardées.";
    } else if (order === 0) {
      line.textContent = "Vous avez la version " + installed +
        " : c'est la plus récente. Rien à faire.";
    } else {
      line.textContent = "Vous avez la version " + installed +
        ", plus récente que celle de cette page.";
    }
    line.hidden = false;
  }

  show();
  window.addEventListener("hashchange", show);
})();
