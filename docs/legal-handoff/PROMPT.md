# Prompt Claude Code — personal-website : pages CGV et mentions légales

À coller dans Claude Code, à la racine du repo `personal-website`, après avoir copié ce dossier dans `docs/legal-handoff/`.

---

## Contexte

Je suis Valentin Bourreau, développeur front-end freelance (EI). Mon site valentinbourreau.com tourne sur Next.js (App Router), Tailwind, next-themes et un i18n `/fr` / `/en`, et il est déployé sur Vercel.

Je mets en place mes conditions générales de prestation (CGP). Il faut :

1. **Créer** la page `/fr/cgv`, qui affiche les CGP version 1.0.
2. **Mettre à jour** la page `/fr/legal` (mentions légales et confidentialité) avec le nouveau texte, qui ajoute notamment une section « Prestations ».

Les maquettes sont validées. Ton travail consiste à les intégrer fidèlement dans les composants et conventions existants du site. Ne refais pas le design.

## Sources, par ordre d’autorité

1. `docs/legal-handoff/charte-graphique-valentinbourreau.md` : la charte. Elle fait toujours foi.
2. `docs/legal-handoff/content/cgv.fr.md` et `content/mentions-legales.fr.md` : les textes, à reprendre **mot pour mot**. Ignore le commentaire HTML en tête du fichier des mentions : c’est un journal des changements, il ne s’affiche pas.
3. `docs/legal-handoff/reference/cgv.html` et `reference/legal.html` : les maquettes en HTML statique, responsive, avec bascule jour/nuit et sommaire actif au scroll. Ouvre-les dans un navigateur. C’est la référence pour les tailles, les espacements et la structure.
4. `docs/legal-handoff/reference/captures/*.png` : les rendus attendus, en desktop 1440 et en mobile 390, jour et nuit.
5. `docs/legal-handoff/tokens.css` : les jetons de couleur. Si le site les définit déjà, garde ceux du site et vérifie seulement qu’ils correspondent.
6. `docs/legal-handoff/cgp-1.0.pdf` : le PDF des CGP. Il est téléchargeable depuis la page.

Les maquettes HTML utilisent des styles en ligne et des variables CSS. Ne les colle pas telles quelles : traduis-les en composants et en classes Tailwind cohérents avec le reste du site.

## Avant de coder

- Lis la structure du repo : layout, header, footer, i18n, gestion du thème, styles globaux, et la page `/fr/legal` actuelle.
- Repère ce qui existe déjà et réutilise-le : header, fil d’Ariane `~/valentin-bourreau / …`, footer, bouton de thème.
- Propose-moi un plan court : fichiers créés ou modifiés, composants. Attends mon accord avant de coder.

## Ce qu’il faut construire

### Composants partagés (CGV et legal)

- **`LegalLayout`** : une intro et un corps à deux colonnes.
  - L’intro contient le fil d’Ariane mono, le H1 (600, `letter-spacing -0.04em`, line-height 1.02, 60px en desktop et 36px en mobile), la méta en mono 13px `--muted` et un filet bas `--line`.
  - Le corps a une largeur maximale de 1120px. Les marges latérales valent `clamp(20px, 4vw, 48px)` en desktop et 16px en mobile.
- **`Toc`** : le sommaire.
  - **Desktop** (≥ 768px) : une `<nav aria-label>` sticky de 248px de large (`top: 24px`), un label « sommaire » en mono 12px, des numéros en mono et des titres en 14px `--text2`. L’entrée active passe en `--accent`, en graisse 500, grâce à un IntersectionObserver (`rootMargin: -20% 0px -70% 0px`) et `aria-current="true"`.
  - **Mobile** : un `<details>` sous l’intro, avec le résumé « sommaire · 20 articles » (ou « · 7 sections ») et un « + » `--muted`. Les cibles font au moins 40px de haut. Le menu se referme au clic sur un lien.
- **`NumberedSection`** : une grille `48px | 1fr` en desktop et `32px | 1fr` en mobile.
  - Le numéro est en mono 13px `--muted`.
  - Le titre H2 fait 21px, en graisse 600.
  - Une ancre « # » `--muted` apparaît au survol du titre et au focus clavier. Elle porte un `aria-label` « Lien vers l’article N ».
  - Le padding vertical est de 32px, avec un filet `--line` entre les sections.
  - Les sous-titres H3 font 16px en graisse 600, précédés d’un numéro mono (« 4.1 », « 12.3 »).
- **Variante `emphasis`** pour les articles 11 (Suspension) et 12 (Propriété intellectuelle) : un filet de 1px `--text` en haut et en bas, un padding vertical de 48px, et un numéro en `--text` au lieu de `--muted`. Pas de couleur, pas de fond.
- **`IdentityCard`** : un `<dl>` sur fond `--surface`, bordure 1px `--line`, rayon 2px, padding 20px, texte mono 13px.
  - Les libellés sont en minuscules `--muted` dans une colonne de 140px (96px en mobile).
  - Les valeurs ont `overflow-wrap: anywhere`, sinon l’e-mail déborde à 390px.

### Page `/fr/cgv` (nouvelle)

- **Méta** : « version 1.0 · en vigueur au 15 octobre 2026 », suivie du lien « télécharger en PDF ».
  - Le lien pointe vers `/cgv/cgp-1.0.pdf`. Place `cgp-1.0.pdf` dans `public/cgv/`.
  - Garde le numéro de version dans le nom du fichier : un devis signé renvoie à une version précise, et les anciennes versions doivent rester en ligne.
- **Identification du prestataire** : une `IdentityCard`, suivie de « Ci-après « le Prestataire ». ».
- **Articles** : 20 articles, avec les ids `art-01` à `art-20`.
  - Les renvois internes (« article 14 », « article 12.2 »…) deviennent des liens d’ancre.
  - Le lien de l’article 14 vers les mentions légales pointe vers `/fr/legal#sec-05`.
- **Footer** : ajoute un lien « cgv » à côté de « mentions légales », avec `aria-current="page"` et la couleur `--accent` sur la page courante. Ce lien s’ajoute au footer global de tout le site.
- **Metadata** :
  - title « Conditions générales de prestation — valentinbourreau » ;
  - description en une phrase ;
  - canonical ;
  - `alternates` fr/en.

### Page `/fr/legal` (mise à jour)

- **Titre** : « Mentions légales et confidentialité ». La méta indique « dernière mise à jour le 15 octobre 2026 ».
- **Sections** : 7 sections, avec les ids `sec-01` à `sec-07`. Elles utilisent le même gabarit numéroté que les CGV : Éditeur, Hébergement, Prestations, Propriété intellectuelle, Données personnelles, Cookies et stockage local, Vos droits.
- **Éditeur** : le paragraphe, suivi d’une `IdentityCard` (siren, siret du siège, code ape, tva, adresse, publication, contact).
- **Prestations** : la nouvelle section. Elle contient un lien vers `/fr/cgv`.
- **Données personnelles** : chaque traitement est une ligne d’une liste `<dl>`, avec le titre en gras, la description et la durée de conservation en mono `--muted` (voir la maquette). Les traitements sont :
  - Formulaire de contact ;
  - Clients ;
  - Protection contre les robots ;
  - Mesure d’audience ;
  - Formulaire : mesure d’utilisation ;
  - Hébergement ;
  - E-mail.
- **Base légale** et **Destinataires et transferts** : des paragraphes simples.
- **Placeholders** : les mentions « [à compléter] » du texte (plateforme de facturation électronique) s’affichent comme dans la maquette, dans une petite boîte mono. **Signale-les-moi** dans ton récapitulatif final : je dois les remplir avant la mise en ligne.

### Versions anglaises

- **`/en/cgv`** : affiche le texte français avec `lang="fr"` sur l’article, précédé d’une ligne en anglais : « These terms are available in French only. The French version prevails (article 20). » Ne traduis pas les CGP.
- **`/en/legal`** : mets à jour la page existante pour refléter les mêmes changements, en traduisant les nouveaux passages (Prestations → Services, partie Clients, polices). Liste-moi les passages traduits pour relecture.

## Règles non négociables (charte)

- **Casse** : les titres sont en casse de phrase (« Conditions générales de prestation », jamais en minuscules ni en Title Case). Les minuscules sont réservées aux labels mono (« sommaire », « prestataire », « siren »).
- **Typographie française** :
  - apostrophe typographique ’ ;
  - espace insécable avant `: ; ! ?` et à l’intérieur des « guillemets » ;
  - espace fine insécable (U+202F) comme séparateur de milliers et dans les numéros SIREN et SIRET : `130 933 922`.
  
  Conserve les caractères des fichiers source : ne les normalise pas.
- **Polices** : Geist 400/500/600/700 et Geist Mono 400/500, déjà en place sur le site.
- **Formes et effets** : rayon de 2px partout, filets de 1px, aucune ombre, aucun dégradé, aucun emoji.
- **Accent** : l’accent `--accent` ne sert qu’à ce qui est « vivant » (entrée active du sommaire, lien de la page courante, survol, focus). Il ne sert pas à la mise en avant des articles 11 et 12.
- **Thème** : jour et nuit au même niveau de finition. Le thème suit le système par défaut, puis le choix enregistré. Vérifie les deux.
- **Impression** : `@media print` en jour, sans sommaire ni bouton de thème.
- **Accessibilité** :
  - un seul H1 ;
  - hiérarchie H2/H3 ;
  - `focus-visible` en outline 2px `--accent` ;
  - cibles tactiles d’au moins 44px pour le bouton de thème ;
  - `<details>` natif.

## Critères d’acceptation

- [ ] `/fr/cgv` et `/fr/legal` correspondent aux captures à 1440px et à 390px, en jour et en nuit, sans défilement horizontal à 390px.
- [ ] Le texte est identique aux fichiers source. Vérifie-le par un diff du texte rendu : aucun mot changé, ajouté ou retiré.
- [ ] Le sommaire desktop reste collé au scroll et suit l’article visible. Le sommaire mobile se replie bien.
- [ ] Les ancres `#art-NN` et `#sec-NN` fonctionnent en accès direct, avec un `scroll-padding-top` pour que le titre ne soit pas collé au bord.
- [ ] Le lien « télécharger en PDF » sert `public/cgv/cgp-1.0.pdf`.
- [ ] Le footer global affiche « mentions légales · cgv » sur toutes les pages.
- [ ] Les métadonnées, le sitemap et les `alternates` sont à jour. Lighthouse accessibilité = 100 sur les deux pages.
- [ ] `pnpm lint`, `pnpm build` et les tests existants passent (adapte au gestionnaire de paquets du repo).

Termine par un récapitulatif : fichiers touchés, captures de tes rendus, placeholders restants et passages anglais à relire.
