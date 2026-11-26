# Consignes pour les assistants (Codex, ChatGPT, Claude…)

Ce dépôt est la **vitrine EXODE**, publiée sur **https://exode-media.com** par GitHub Pages,
depuis la racine de la branche `main`. Tout ce qui arrive sur `main` est en ligne environ une
minute plus tard : chaque modification est donc publique.

Le 26 novembre 2026, l'éditeur a confirmé que l'activité d'Exode Média est désormais
professionnelle. Les anciennes consignes réservées à un éditeur particulier sont donc
remplacées par cette confirmation. Lis ces consignes en entier avant de modifier quoi que ce soit.

## Méthode de travail

- **Ne pousse jamais directement sur `main`.** Travaille sur une branche et propose une pull
  request ; l'éditeur la valide lui-même.
- **Un seul assistant à la fois.** Claude Code travaille aussi sur ce dépôt (clone local
  `D:\GPT\Exode\versions\vitrine`). Pars toujours de la dernière version de `main`.
- Des changements petits et ciblés, avec une description claire en français de ce qui change
  et pourquoi.

## À ne jamais faire

- Modifier ou supprimer **`CNAME`** (il relie le site au domaine exode-media.com) ou
  **`_config.yml`**.
- Ajouter une **ressource externe** : police (Google Fonts, Adobe Fonts…), script, CDN,
  bibliothèque, iframe, vidéo intégrée, carte, bouton de réseau social, outil de mesure
  d'audience, cookie, pixel. Tout est servi depuis ce dépôt. La politique de confidentialité
  promet « aucun cookie, aucun outil de mesure d'audience ni traceur » : elle doit rester vraie.
- Ajouter une **donnée personnelle** de l'éditeur sans instruction explicite. Les coordonnées
  professionnelles destinées aux mentions légales doivent être fournies ou confirmées par
  l'éditeur ; ne jamais les déduire d'un compte ou d'un historique. Le contact e-mail public
  reste **contact@exode-media.com**.
- Ajouter une clé, un mot de passe, un jeton ou un fichier de signature (`.jks`, `key.properties`).
- Ajouter un outil de construction (npm, framework, générateur) : le site est en HTML, CSS et
  JavaScript simples, sans étape de compilation.
- Mettre un lien vers `exode-respire.netlify.app` ou `sevrage-addiction.netlify.app` (Netlify
  est abandonné).

## Ce qui doit rester exact

- **Mentions légales** (`mentions-legales.html`) : activité professionnelle confirmée le
  26 novembre 2026. Renseigner uniquement l'identité, la forme juridique, les identifiants et
  les coordonnées publiables confirmés par l'éditeur. Ne pas publier de champs fictifs.
  Hébergeur GitHub, Inc. ; domaine chez OVH SAS.
- **Téléchargement de Respire** : le lien Android reste
  `https://github.com/EXODE150-creator/respire-android/releases/latest/download/Respire.apk`.
  Les numéros de version, la taille, l'empreinte SHA-256 du fichier et le certificat de
  signature (`BD:F7:73:30:…:6D:67:46`) doivent correspondre à la dernière release : ne les
  invente pas, ne les arrondis pas.
- **Respire pour iPhone** reste à `https://exode150-creator.github.io/respire-iphone/` : les
  données des utilisateurs sont liées à cette adresse, ne la remplace pas.
- **Santé** : Respire n'est pas un dispositif médical. Garde les avertissements et les numéros
  d'aide (39 89, 0 980 980 930, 0 800 23 13 13, 15, 112). Pas de promesse de guérison ni de
  résultat.
- **Dors** et **Service** ne sont pas encore sortis : pas de bouton d'installation ni de
  prix.
- **Prestations** : le positionnement professionnel et les échanges sur un projet sont
  autorisés. Ne pas inventer de clients, de témoignages, de résultats ou de tarifs.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : les réalisations rangées par univers, les engagements |
| `respire/index.html` | Fiche de Respire |
| `respire/telecharger/` | Guide d'installation (Android, iPhone), QR codes |
| `respire/confidentialite/` | Politique de confidentialité de Respire |
| `dors/index.html` | Fiche de Dors (« Bientôt ») |
| `service/index.html` | Fiche de Service (« Bientôt ») |
| `a-propos.html`, `contact.html`, `mentions-legales.html` | Pages communes |
| `404.html` | Page introuvable (liens absolus depuis la racine `/`) |
| `style.css` | Tout le style ; couleurs et polices en variables dans `:root` |
| `site.js` | Carrousel des captures et visionneuse |
| `img/` | Logos et icônes ; `<appli>/captures/` : captures d'écran |
| `sitemap.xml`, `robots.txt` | Référencement |

Nouvelle appli : ajoute sa carte à l'accueil (voir plus bas).

Nouvelle page : reprends l'en-tête et le pied de page d'une page existante, liens internes
**relatifs** (`../`, `respire/`), balises `canonical` et `og:` en `https://exode-media.com/…`,
et ajoute l'adresse dans `sitemap.xml`.

## Design

- Thème sombre. Utilise les variables de `style.css` (`--ground`, `--surface`, `--ink`,
  `--teal`, `--moon`…) plutôt que de nouvelles couleurs ; réutilise les classes existantes
  (`.btn`, `.panel`, `.callout`, `.steps`…).
- Respire : accent turquoise (`--teal`). Dors : accent bleu lune (`<body class="theme-dors">`).
  Service : accent rouge et acier (`theme-ultra`).
- L'anneau segmenté (`.halo`, SVG) est l'élément signature, repris des icônes des applis.
- Polices système uniquement (pas de fichier de police externe).
- Animations discrètes, désactivées si `prefers-reduced-motion`.
- Chaque page appelle `style.css?v=AAAAMMJJ` et `site.js?v=AAAAMMJJ`. **Après toute modification
  de `style.css` ou de `site.js`, remplace ce numéro par la date du jour dans toutes les pages**
  (une deuxième modification le même jour prend une lettre : `20261122b`)
  (GitHub Pages laisse les navigateurs garder ces fichiers 10 minutes : sans nouveau numéro, un
  visiteur récent verrait la nouvelle page avec l'ancien style).

## Cartes d’applications : règle durable

Toutes les applications présentes et futures utilisent **exactement le même gabarit**,
sans carte vedette ni variante ordinateur. Le modèle de référence est
`.github/templates/application-card.html`, commun à Respire, Dors et Service.

- Ajouter chaque carte dans l’unique grille `.application-projects` de `index.html`.
- Conserver la structure, les classes communes, les dimensions d’icône et les trois
  boutons de captures. Seuls les textes, images, liens, identifiants, état et couleur
  d’univers changent. Toutes les captures sont présentées dans le même téléphone.
- Aucune dimension, typographie, marge ou transformation spécifique à une application.
  Le style de géométrie appartient uniquement aux sélecteurs communs du gabarit.
- Renseigner `data-availability` : `available` (Disponible), `soon` (Bientôt disponible)
  ou `development` (En préparation). Les disponibles précèdent les prochaines sorties,
  qui précèdent les projets en préparation.
- Renseigner `data-priority` avec un entier positif unique pour départager les cartes
  d’un même état. À l’ajout, prendre le prochain multiple de 10 libre, sans inventer
  de date de sortie. Conserver cet ordre jusqu’à décision explicite de l’éditeur.
- Ordre actuel demandé : **Respire** (`available`, 10), **Dors** (`soon`, 20),
  **Service** (`development`, 30).
- Trier le HTML lui-même par `(disponibilité, priorité)`, pour conserver le bon ordre
  sans JavaScript et pour les moteurs. Le script applique aussi cette règle à l’affichage.
- Une application devenue disponible doit changer d’état et sa carte doit être replacée
  dans le HTML. Les priorités servent seulement à départager un même état.
- Exécuter `python .github/scripts/audit_application_cards.py` après chaque ajout ou
  modification. Le workflow « Cartes des applications » lance aussi ce contrôle sur
  les propositions GitHub et les modifications de main. Il ne constitue pas une règle
  de protection de branche : ne pas prétendre qu’une fusion est techniquement bloquée.

Le contrôle vérifie le gabarit de chaque carte, les trois captures, les états, les
priorités, l’ordre source et l’absence de styles de géométrie par application.
Une modification du gabarit doit être appliquée à **toutes** les cartes.

## Logos sur le site

- Teintes demandées : contour de Service gris sombre ; contour d’Exode Média gris
  sombre légèrement plus clair, avec son E vert menthe. Conserver les fonds transparents.


- Référence graphique commune : anneau et finition lisse du logo Respire, sans effet
  acier brossé. Service conserve un S central sans étoile, avec les accents rouges
  à la place du bleu ; Exode Média conserve le E et les accents vert menthe.
- Les versions actives de ces deux logos sont `ultra-s-transparent-*` et
  `exode-gris-transparent-*`. Ne pas réintroduire leurs anciennes variantes acier.


- Tous les logos applicatifs utilisent une vraie transparence alpha, y compris dans
  les espaces entre segments et autour de la lettre. Pas de fond sombre incrusté.
- Respire sert de référence de taille : même canevas carré, même diamètre visible
  (76 % du canevas), mêmes dimensions CSS par emplacement pour toutes les applications.
- Utiliser les fichiers `img/<appli>-transparent-192.webp` et `-384.webp`, avec la
  classe commune `app-logo`. Ne pas ajouter de fond, de bordure ou de dimensions
  spécifiques à une application. Les icônes Exode Média utilisent aussi les exports transparents.
- Cette règle concerne le site ; les applications natives ne sont pas modifiées.

## Images

- Format **WebP**, poids raisonnable (moins de 200 Ko par image si possible), avec `width`,
  `height` et un texte `alt` en français qui décrit l'image ; `loading="lazy"` sous la ligne
  de flottaison.
- Captures d'application en 360 × 800. Données de démonstration seulement, jamais de vraies
  données personnelles.

## Textes

- En français. **« vous »** pour les pages EXODE et Dors, **« tu »** pour les pages de Respire.
- Typographie française : espace insécable avant `:` `;` `?` `!` (`&nbsp;`), guillemets
  « … ».
- Ton sobre et bienveillant, sans jargon ni culpabilisation.

## Vérifier avant de proposer

1. Ouvrir le site en local : `python -m http.server 8793` à la racine du dépôt, puis
   http://127.0.0.1:8793/.
2. Tous les liens et toutes les images fonctionnent, aucune erreur dans la console.
3. Largeur téléphone (375 px) : rien ne dépasse, aucun défilement horizontal.
4. Aucune ressource chargée depuis un autre site (onglet Réseau du navigateur).
