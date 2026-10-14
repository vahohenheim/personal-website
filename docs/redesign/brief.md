# Redesign de valentinbourreau.com — accueil et /resume

> Brief fourni par Valentin le 2026-10-10, conservé tel quel (en français) pour que le
> travail puisse être repris d'une session à l'autre. Le redesign est fusionné depuis le 2026-10-11 ; les
> captures de vérification sont dans [screenshots/](screenshots/).

Tu travailles sur mon site personnel (Next.js, Tailwind, i18n FR/EN, thème clair/sombre). Je veux appliquer un redesign complet de la page d'accueil et de la page `/resume`, dans les deux langues. Le design est figé : respecte-le au pixel et au caractère près. La charte graphique jointe (`charte-graphique-valentinbourreau.md`) fait foi pour tout ce qui n'est pas précisé ici.

## Méthode

1. **Explore d'abord le repo :** routing i18n, fichiers de traduction, thème (`next-themes` ?), config Tailwind, composants partagés, `public/avatar.jpg`, métadonnées. Fais-moi un plan court (fichiers touchés, composants créés) avant d'écrire du code.
2. Garde l'architecture existante (routes `/fr`, `/en`, `/[lang]/resume`, métadonnées, i18n). Ne casse rien d'autre que ce qui est décrit.
3. Travaille sur une branche `redesign/changelog`, en commits atomiques.
4. À la fin, vérifie dans le navigateur à 1 280 px et 375 px, en clair et en sombre, puis coche les critères d'acceptation en bas de ce fichier.

## À supprimer

- Animations d'entrée qui masquent le contenu au chargement (le hero est vide pendant ~2 s aujourd'hui). Aucun contenu ne doit démarrer à `opacity: 0`.
- Bandeau de logos d'employeurs.
- Émojis partout (📍 🚚 🌷 📚 📦 🏛️ 🎓 ➡️ 🌱, drapeaux du sélecteur de langue).
- Blocs « expert / confirmé / demain » et toute mention d'« Engineering Manager » comme objectif.
- Numéros de version des frameworks dans le hero.
- « Copyright © … Tous droits réservés », et le colophon « Geist + Geist Mono · Next.js ».
- Icônes sociales dupliquées entre le hero et le footer.

## Design tokens

Une seule palette (Eucalyptus), deux modes. Remplace les variables de thème existantes (fini les gris « slate » bleutés mêlés aux gris neutres).

```css
:root {
  --bg: #f7f9f9;
  --surface: #eef1f0;
  --line: #dce2e0;
  --muted: #646c6a;
  --text2: #393f3e;
  --text: #141818;
  --accent: #3d6a60;
  --on-accent: #ffffff;
  color-scheme: light;
}
.dark {
  --bg: #0e1111;
  --surface: #151918;
  --line: #272d2c;
  --muted: #8f9896;
  --text2: #bec5c3;
  --text: #e8eceb;
  --accent: #9ec4ba;
  --on-accent: #0e1111;
  color-scheme: dark;
}
```

Expose ces variables dans Tailwind (`bg`, `surface`, `line`, `muted`, `text2`, `text`, `accent`, `on-accent`), et `rounded` = 2px par défaut.

### Règles globales

- **Rayons :** 2 px partout, 6 px pour la photo, `50%` pour les pastilles de statut. Aucune ombre, aucun dégradé, aucun flou d'arrière-plan sur le header.
- **Filets :** 1 px `--line`.
- **Sélection :** `::selection { background: var(--accent); color: var(--on-accent) }`.
- **Focus :** `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px }`.
- **Liens :** couleur `--text`, soulignement `--line` avec `text-underline-offset: 3px`, au survol `--accent`.
- **Mouvement :** au plus des transitions de couleur de 150 ms, désactivées sous `prefers-reduced-motion`.

## Thème jour / nuit

- Suit le réglage du système par défaut (`defaultTheme="system"`, `enableSystem`, `attribute="class"`).
- Bouton dans le header : carré de 44 × 44 px, bordure `--line`, rayon 2 px, icône « demi-cercle plein » en SVG (cercle r=8.5 en trait de 1,6 et demi-disque droit plein, 16 px). `aria-label="Passer en mode jour ou nuit"`. Un clic force l'autre mode.
- Pas de flash au chargement (script de thème avant le rendu, `suppressHydrationWarning`).

## Typographie

- Geist et Geist Mono via le paquet `geist` (`geist/font/sans`, `geist/font/mono`), exposés en `--font-sans` / `--font-mono`.
- **Mono :** fil d'Ariane, titres de section, dates, étiquettes, fiche clé / valeur, statuts, liens sociaux du footer.
- **Échelle :**
  - H1 : `clamp(40px, 6.4vw, 76px)`, 600, interligne 1, approche −0.04em.
  - Exergue : `clamp(22px, 2.3vw, 28px)`, 500, interligne 1.35, approche −0.02em.
  - Intertitres : 19–21 px, 600, approche −0.01em.
  - Texte : 15–16 px, interligne 1.6.
  - Mono : 12–13 px.
- **Micro-typo FR, à vérifier dans tous les fichiers de traduction :**
  - apostrophe `’` (jamais `'`) ;
  - espace insécable avant `: ; ! ?` ;
  - demi-cadratin `–` dans les intervalles (`2016–2018`), flèche `→` dans les dates de journal (`2024.10 → 2026.10`) ;
  - vraies listes `<ul>`, jamais de « · » tapés à la main.

## Layout commun

- Conteneur `max-width: 1040px`, padding latéral `clamp(20px, 4vw, 48px)`.
- **Header** (padding 24 px vertical), en flex wrap :
  - à gauche, le logo `valentinbourreau` (Geist 700, 18 px, −0.02em), lien vers l'accueil ;
  - à droite, une nav en mono 13 px : `cv` · `projets` · `contact` · `fr · en` (en `--muted`, lien vers l'autre langue, `lang` et `aria-label` corrects) · le bouton thème. La page courante est en `--accent` avec `aria-current="page"`.
  - Le lien `cv` doit rester visible en mobile : la nav passe à la ligne, pas de menu caché.
- **Titres de section :** `<h2>` en mono 13 px, 500, `--muted`, minuscules, sans `#`.
- **Section :** `border-top: 1px solid var(--line)`, padding 40 px en haut et `clamp(56px, 7vw, 96px)` en bas.
- **Favicon :** la lettre `v` seule (Geist Bold), comme aujourd'hui.

## Composants

- **`Avatar`** : `public/avatar.jpg` via `next/image`, 88 × 88 px, `object-fit: cover`, rayon 6 px, sans bordure, `alt="Valentin Bourreau"`, `priority`.
- **`Breadcrumb`** : mono 13 px, `--muted`. Accueil : `~/valentin-bourreau`. CV : `~/valentin-bourreau/cv`, où `~/valentin-bourreau` est un lien vers l'accueil, sans soulignement.
- **`Button`** :
  - variante `primary` : fond `--accent`, texte `--on-accent` ;
  - variante `secondary` : transparent, bordure `--line` ;
  - commun aux deux : hauteur min 44 px, padding 0 20 px, Geist 500 15 px, rayon 2 px.
- **`ProfileCard`** (fiche clé / valeur) : `<dl>` en grille `minmax(88px,128px) 1fr`, gap 8 × 20 px, padding 24 px, fond `--surface`, bordure `--line`, rayon 2 px, mono 13 px. Clés en `--muted`, valeurs en `--text`. Pas d'en-tête.
- **`StatusDot`** : pastille de 7 px, `--accent`, ronde.
- **`ChangelogEntry`** : flex wrap, gap 6–8 × 32 px, padding 20–24 px vertical, filet `--line`.
  - Colonne date : mono 13 px, `flex: 0 0 160px`, en `--muted` sauf l'entrée actuelle en `--accent`.
  - Contenu : `h3` Geist 600 suivi de ` · Entreprise` en `--muted` 400, puis le paragraphe en `--text2`.
- **`AchievementList`** : `<ul>` sans puces ; chaque `<li>` est en flex gap 12 px, avec un `+` en mono `--accent` (`aria-hidden`) puis le texte 15 px `--text2`. Largeur max 64ch.
- **`ProjectCard`** : bordure `--line`, rayon 2 px, padding 20 px.
  - Ligne 1 : nom en mono 15 px 500 (lien) et statut à droite en mono 12 px (`● en ligne` / `● en cours` en `--accent`, `○ archivé` en `--muted`).
  - Puis la description en 15 px `--text2`, puis la stack en mono 12 px `--muted`.

## Page d'accueil — contenu exact (FR)

### Hero

Padding `clamp(48px, 8vw, 112px)` en haut, `clamp(56px, 7vw, 96px)` en bas, gap 32 px.

1. Ligne `Avatar` + `Breadcrumb` (flex, gap 20 px, centré verticalement).
2. `h1` : **Ingénieur front-end senior**
3. Chapô (18–21 px, `--text2`, max 40em) : « Freelance. J’accompagne les équipes produit sur leurs interfaces web : architecture front-end, design system, qualité. »
4. `ProfileCard` :
   - `nom` → Valentin Bourreau
   - `rôle` → Ingénieur front-end senior
   - `statut` → `StatusDot` + Freelance
   - `expérience` → développeur depuis 2013
   - `stack` → React · Next.js · Angular · GraphQL
   - `périmètre` → architecture · design system · lead technique
   - `base` → Paris, France
   - `langues` → fr natif · en · es
5. Boutons : `primary` « Prendre contact » (mailto, adresse existante du site), `secondary` « Voir le CV » (→ /resume).

### Section « ce que j’apporte »

- Exergue (max 30em) : « Le front-end est en bout de chaîne de décision. J’aime y jouer le rôle de pont entre les services : produit, design, marketing et technique. »
- Puis une grille `repeat(auto-fit, minmax(min(280px,100%),1fr))`, gap 1 px sur fond `--line`, bordure `--line`, rayon 2 px, `overflow: hidden`. Chaque cellule a un fond `--bg`, un padding de 24 px, et contient une méta en mono 12 px, un `h3` 20 px 600 et un texte 15 px :
  1. `depuis 2013` — **Ingénierie** — « Recherche, architecture, développement, documentation, tests. Front-end d’abord, avec une formation back-end pour tenir le full-stack. »
  2. `ep · solo paris` — **Lead technique** — « Une équipe de cinq chez EP, puis un an et demi de lead tech front-end chez SOLO. Pratiques communes, recrutement, onboarding, documentation. »
  3. `produit · design · marketing · tech` — **Pont entre les services** — « Faire circuler les besoins de chacun pour que les choix de design avancent. »

### Section « changelog »

Titre à gauche, lien mono « journal complet → » à droite (→ /resume). Liste `<ol>` de `ChangelogEntry` :

1. `2026.10 → aujourd’hui` (accent) — **Ingénieur front-end senior** · Freelance — « Statut actuel. Missions front-end : architecture, design system, qualité, lead technique. »
2. `2024.10 → 2026.10` — **Lead tech front-end** · SOLO Paris — « Ingénieur puis lead tech front-end pendant un an et demi sur la refonte e-commerce headless : Magento monolithique → Next.js + Magento 2 via GraphQL. Algolia, Contentful, Cloudflare. »
3. `2021.06 → 2024.09` — **Lead tech front-end** · EP, Nantes — « Start-up studio dans l’immobilier : apps regtech et site de data visualisation. Équipe de cinq, design system en Web Components, migration Next.js 14 et déploiement continu. »
4. `2020.02 → 2021.06` — **Ingénieur front-end** · Conserto — « Mission chez EP Tribe : Angular, Meteor, génération statique Node.js. »
5. `2013 → 2020` — **Front-end, full-stack, UI/UX, formation** — « Troopers, Nantes Métropole, Connexing, Département du Maine-et-Loire, Drouault. »

### Section « projets »

Grille `auto-fit minmax(min(300px,100%),1fr)`, gap 16 px, de `ProjectCard` :

- `brut` · `● en ligne` — « Food truck BRUT à Tours : contenu éditable, newsletter, avis clients. » — `next.js`
- `lotus` · `● en ligne` — « Mon statut d’indépendant, automatisé : factures et devis, cotisations, échéances, leads et relances clients. » — `next.js · drizzle · neon`
- `pensee` · `● en ligne` — « App mobile de notes quotidiennes, pensée pour écrire hors ligne : éditeur riche, synchronisation, recherche. Recul hebdomadaire par IA. » — `expo · next.js · api claude`

Sous la grille, en mono 13 px `--muted` : « + 3 archivés : editorials, notion-blog, finance » (liens). Reprends les URL existantes du repo.

### Footer (`id="contact"`)

- À gauche : titre mono « contact », puis le lien « Prendre contact → » (Geist 600, `clamp(24px,3vw,32px)`, mailto), puis les liens en mono 13 px : `github` `linkedin` `dribbble` `behance`.
- À droite, en bas : « © 2026 Valentin Bourreau » en mono 12 px `--muted`.

## Page /resume — contenu exact (FR)

### En-tête

Gap 24 px.

1. `Avatar` + `Breadcrumb` (`~/valentin-bourreau/cv`).
2. `h1` : **Ingénieur front-end senior** (`clamp(38px, 5.6vw, 64px)`).
3. Ligne mono 13 px `--muted`, flex wrap avec un gap de 16 px : « Valentin Bourreau » (en `--text`) · `StatusDot` freelance · développeur depuis 2013 · Paris, France.
4. Résumé (18 px, `--text2`, max 64ch) : « Plus de dix ans de développement web, dont deux expériences de lead tech front-end, chez EP puis chez SOLO. Aujourd’hui freelance, j’interviens sur l’architecture front-end, les design systems et la qualité, en faisant le pont entre produit, design et technique. »
5. Boutons : `primary` « Télécharger cv.pdf » et `secondary` « Prendre contact ».

### Section « stack »

`ProfileCard` avec padding 24 px :

- `front` → react · next.js · angular · redux · rxjs · graphql · web components · d3.js · mapbox
- `plateforme` → magento 2 · contentful · algolia · cloudflare · knock · nx · node.js · laravel
- `qualité` → jest · cypress · playwright · documentation · guidelines
- `équipe` → lead · recrutement · onboarding · lien produit / design / tech
- `design` → ui/ux · design systems · sketch · suite adobe

### Section « changelog »

`ChangelogEntry` avec un `h3` de 21 px, et une durée sous la date.

1. **Freelance** — `2026.10 → aujourd’hui` (accent), `statut actuel`.
   - Titre : **Ingénieur front-end senior** · Freelance.
   - Texte : « Missions front-end : architecture, design system, qualité, lead technique. »
2. **SOLO Paris** — `2024.10 → 2026.10`, `2 ans`.
   - Titre : **Lead tech front-end** · SOLO Paris.
   - Sous-rôles en mono 12 px : `lead tech front-end · 1 an ½` et `ingénieur front-end · 6 mois`.
   - Texte : « Refonte e-commerce dans une équipe de dix : Magento monolithique → headless Next.js + Magento 2, GraphQL en couche d’interface. »
   - `AchievementList` :
     - Intégration Algolia sur mesure : performance et pertinence de la recherche
     - Architecture Contentful pour le contenu éditorial, avec le Marketing
     - Sécurité : WAF Cloudflare
     - Processus qualité et guidelines techniques
     - Notifications Knock, PDF avec PDFKit, API Gravitee
3. **EP** — `2021.06 → 2024.09`, `3 ans 3 mois`.
   - Titre : **Lead tech front-end** · EP, Nantes.
   - Sous-rôles : `lead tech front-end · 1 an` et `ingénieur front-end · 2 ans 2 mois`.
   - Texte : « Start-up studio dans l’immobilier : création d’apps regtech et d’un site de data visualisation. »
   - `AchievementList` :
     - Management de cinq développeurs : recrutement, onboarding, montée en compétence
     - Garant du design system en Web Components, façades d3.js et Mapbox
     - Migration JAMStack → Next.js 14, déploiement continu, nouvelle app Next.js + Redux Toolkit
     - Projets Angular 5, 12 et 17 ; monorepo NX ; SEO éditorial (JSON-LD, sitemaps)
     - Pont entre équipes pluridisciplinaires sur la cible produit et qualité
4. **Conserto** — `2020.02 → 2021.06`.
   - Titre : **Ingénieur front-end** · Conserto, Nantes.
   - Texte : « Mission chez EP Tribe : Angular, Meteor full-stack, génération statique Node.js, e-mails Adobe Campaign. »
5. **Troopers** — `2018.06 → 2020.01`.
   - Titre : **Développeur front-end** · Troopers, Nantes.
   - Texte : « React, Redux, RxJS ; Expo et React Native ; styleguides JSX et Twig avec Tailwind et Ant Design. »
6. **Versions antérieures** — `2013.09 → 2018.09`. Une liste où chaque ligne affiche l'intitulé en `--text`, puis l'année en mono 12 px `--muted` :
   - Formateur · Nantes Métropole — 2018
   - Full-stack & UI/UX designer · Connexing — 2016–2018
   - Full-stack · Département du Maine-et-Loire — 2015–2016
   - Logiciel & support · Drouault — 2013–2015

### Sections « formation » et « langues »

Côte à côte, en grille `auto-fit minmax(min(320px,100%),1fr)`, gap 40 px. Chaque section est un `<dl>` en `56px 1fr`, avec l'année ou le code de langue en mono `--muted`.

- **Formation :**
  - 2019 — Gestion de projet informatique · RNCP I, IMIE
  - 2018 — Architecte logiciel · RNCP II, IMIE
  - 2018 — UI/UX Designer · RNCP II, IMIE
  - 2017 — Licence développeur logiciel · Université de Nantes
- **Langues :**
  - fr — Français · natif
  - en — Anglais · professionnel
  - es — Espagnol · notions

### Footer

Filet `--line` puis, en mono 12 px `--muted` : « © 2026 Valentin Bourreau » à gauche et le lien `cd ~/` vers l'accueil à droite.

## Version anglaise

Traduis tous les contenus ci-dessus dans les fichiers EN existants, avec la même structure.

- Titre : « Senior front-end engineer ».
- Clés de la fiche : `name`, `role`, `status`, `experience`, `stack`, `scope`, `based in`, `languages`.
- Titres de section : `what i bring`, `changelog`, `projects`, `contact`, `education`, `languages`.
- Boutons : « Get in touch », « View résumé », « Download cv.pdf ».
- « Pont entre les services » devient « Bridge between teams ».
- Dates au même format.

## Métadonnées

- **Title FR :** `Ingénieur front-end senior · freelance | valentinbourreau`. Description : reprendre le chapô.
- **Image Open Graph (`opengraph-image.tsx`, 1 200 × 630) :** fond `#EEF1F0`, marges 64 px, puis :
  - `~/valentin-bourreau` en Geist Mono 22 px `#646C6A` en haut ;
  - « Ingénieur front-end senior » en Geist 600 72 px `#141818` ;
  - `● freelance · valentinbourreau.com` en Geist Mono 22 px `#3D6A60` en bas.
- **Favicon :** `v` Geist Bold, `#E8ECEB` sur `#0E1111`, rayon 2 px.

## Critères d'acceptation

- [x] Le hero est visible et complet au premier rendu, sans animation qui masque le contenu.
- [x] Le lien `cv` est visible dans le header à 375 px.
- [x] Le thème suit le système, le bouton force l'autre mode, et il n'y a pas de flash au chargement.
- [x] Seules les variables Eucalyptus sont utilisées : plus aucune couleur slate ni bleue.
- [x] Geist et Geist Mono uniquement. Aucun émoji dans le DOM.
- [x] Rayon 2 px partout, 6 px pour l'avatar. Aucune ombre ni dégradé.
- [x] Apostrophes `’`, demi-cadratins et espaces insécables corrects en FR. Aucune puce tapée à la main.
- [x] Contraste ≥ 4,5:1 dans les deux modes. Focus visibles. Bouton thème avec `aria-label`.
- [x] Les contenus FR correspondent mot pour mot à ce fichier, et EN est traduit avec la même structure.
- [x] Lighthouse : accessibilité ≥ 95, CLS ≈ 0.
- [x] Captures 1 280 px et 375 px, clair et sombre, des deux pages, fournies à la fin.
