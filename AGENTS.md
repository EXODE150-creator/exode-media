# Consignes pour les assistants (Codex, ChatGPT, Claude…)

Ce dépôt est la **vitrine EXODE**, publiée sur **https://exode-media.com** par GitHub Pages,
depuis la racine de la branche `main`. Tout ce qui arrive sur `main` est en ligne environ une
minute plus tard : chaque modification est donc publique.

L'éditeur est un particulier. Lis ces consignes en entier avant de modifier quoi que ce soit.

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
- Ajouter une **donnée personnelle** de l'éditeur : nom, adresse, téléphone, adresse e-mail
  personnelle. Le seul contact public est **contact@exode-media.com**.
- Ajouter une clé, un mot de passe, un jeton ou un fichier de signature (`.jks`, `key.properties`).
- Ajouter un outil de construction (npm, framework, générateur) : le site est en HTML, CSS et
  JavaScript simples, sans étape de compilation.
- Mettre un lien vers `exode-respire.netlify.app` ou `sevrage-addiction.netlify.app` (Netlify
  est abandonné).

## Ce qui doit rester exact

- **Mentions légales** (`mentions-legales.html`) : éditeur particulier, à titre non
  professionnel, coordonnées personnelles non publiées (loi LCEN). Hébergeur GitHub, Inc. ;
  domaine chez OVH SAS. Ne change pas ce statut.
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
- **Dors** n'est pas encore sorti : pas de bouton d'installation ni de prix.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : les applications, les engagements |
| `respire/index.html` | Fiche de Respire |
| `respire/telecharger/` | Guide d'installation (Android, iPhone), QR codes |
| `respire/confidentialite/` | Politique de confidentialité de Respire |
| `dors/index.html` | Fiche de Dors (« Bientôt ») |
| `a-propos.html`, `contact.html`, `mentions-legales.html` | Pages communes |
| `404.html` | Page introuvable (liens absolus depuis la racine `/`) |
| `style.css` | Tout le style ; couleurs et polices en variables dans `:root` |
| `site.js` | Carrousel des captures et visionneuse |
| `img/` | Logos et icônes ; `respire/captures/`, `dors/captures/` : captures d'écran |
| `sitemap.xml`, `robots.txt` | Référencement |

Nouvelle page : reprends l'en-tête et le pied de page d'une page existante, liens internes
**relatifs** (`../`, `respire/`), balises `canonical` et `og:` en `https://exode-media.com/…`,
et ajoute l'adresse dans `sitemap.xml`.

## Design

- Thème sombre. Utilise les variables de `style.css` (`--ground`, `--surface`, `--ink`,
  `--teal`, `--moon`…) plutôt que de nouvelles couleurs ; réutilise les classes existantes
  (`.btn`, `.panel`, `.callout`, `.steps`…).
- Respire : accent turquoise (`--teal`). Dors : accent bleu lune (`<body class="theme-dors">`).
- L'anneau segmenté (`.halo`, SVG) est l'élément signature, repris des icônes des applis.
- Polices système uniquement (pas de fichier de police externe).
- Animations discrètes, désactivées si `prefers-reduced-motion`.

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
