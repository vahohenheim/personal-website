# Charte graphique — Valentin Bourreau

> Ingénieur front-end senior · freelance
> Version 1.0 — octobre 2026 · direction « Changelog », palette Eucalyptus

Cette charte sert de référence unique pour tous les supports : site web, CV PDF, facture, devis, proposition commerciale, présentation d'audit, carte de visite, signature e-mail, réseaux sociaux. En cas de doute, appliquer la règle la plus sobre.

---

## 1. Principes

1. **Sobriété.** Peu d'éléments, chacun a une raison d'être. Pas d'ombre, pas de dégradé, pas d'émoji, pas d'illustration décorative.
2. **Cohérence.** Une police, une couleur d'accent, une rampe de gris, un rayon. Les mêmes règles partout, du favicon à la facture.
3. **Le détail comme preuve.** Alignements exacts, micro-typographie française soignée, contrastes vérifiés. Le soin du support démontre le soin du travail.
4. **Des métaphores de développeur, sans gadget.** Fil d'Ariane (`~/valentin-bourreau`), journal de versions (« changelog »), fiche clé / valeur. Jamais de faux terminal ni d'effet « hacker ».
5. **Jour et nuit à parité.** Les supports écran existent dans les deux modes. Tout ce qui s'imprime ou s'envoie en PDF est en mode jour.

## 2. Positionnement et ton

- **Titre unique, partout :** « Ingénieur front-end senior ». Le statut « freelance » est une information à part, jamais fusionnée dans le titre.
- **Ce qui me distingue :** le rôle de pont entre les services (produit, design, marketing, technique). Le dire simplement, une fois, sans surenchère.
- **Ton :** direct, factuel, à la première personne, phrases courtes. Pas de superlatifs (« passionné », « expert reconnu »), pas de jargon RH (« confirmé », « expert »).
- **Casse :** casse normale dans les textes. Minuscules uniquement dans les éléments en police mono (fil d'Ariane, titres de section, étiquettes).
- **Langue :** français par défaut, anglais en version miroir. Le sélecteur de langue est textuel (« fr · en »), jamais un drapeau.

## 3. Logo

### Logotype

`valentinbourreau` — prénom et nom collés, en minuscules, Geist Bold (700), approche −0,02 à −0,03 em.

- Couleur : texte principal (`--text`) du mode courant. Jamais en couleur d'accent, jamais en dégradé.
- Zone de protection : une hauteur de « v » tout autour.
- Taille minimale : 14 px à l'écran, 9 pt à l'impression.
- Interdits : espacer les deux mots, ajouter une majuscule, déformer, contourer, ajouter un symbole ou un curseur.

### Favicon et avatar

- **Favicon :** la lettre `v` seule, Geist Bold, texte `--text` sur fond `--bg`, rayon 2 px. Version nuit par défaut pour l'onglet.
- **Photo :** portrait actuel, cadrage serré, recadrage carré, rayon 6 px, sans bordure ni ombre. Taille courante 88 px (web), 22 mm (print).

## 4. Couleurs — palette Eucalyptus

Gris très légèrement teintés de vert-bleu, un seul accent désaturé. Tous les textes respectent un contraste ≥ 4,5:1 (WCAG AA).

| Rôle             | Token         | Jour      | Nuit      | Usage                                 |
| ---------------- | ------------- | --------- | --------- | ------------------------------------- |
| Fond             | `--bg`        | `#F7F9F9` | `#0E1111` | fond de page                          |
| Surface          | `--surface`   | `#EEF1F0` | `#151918` | blocs, fiches, en-têtes de tableau    |
| Filet            | `--line`      | `#DCE2E0` | `#272D2C` | bordures, séparateurs                 |
| Méta             | `--muted`     | `#646C6A` | `#8F9896` | dates, étiquettes, légendes           |
| Texte secondaire | `--text2`     | `#393F3E` | `#BEC5C3` | paragraphes courants                  |
| Texte            | `--text`      | `#141818` | `#E8ECEB` | titres, texte fort, logo              |
| Accent           | `--accent`    | `#3D6A60` | `#9EC4BA` | élément « vivant », action principale |
| Sur accent       | `--on-accent` | `#FFFFFF` | `#0E1111` | texte posé sur l'accent               |

### Règles d'usage

- **L'accent signale ce qui est vivant :** statut freelance, poste ou mission en cours, projet en ligne, action principale, survol, focus. Il ne sert pas à décorer. Il occupe moins de 5 % d'une surface.
- **Jamais de texte courant en accent.** L'accent peut colorer une date, un glyphe, un lien survolé ou un bouton.
- **Pas d'autre couleur.** Pour un état d'erreur sur une facture (ex. « en retard »), utiliser `--text` en gras, pas du rouge.
- **Impression :** mode jour. Pour économiser l'encre, remplacer `--bg` par du blanc pur `#FFFFFF` et garder `--surface` pour les en-têtes de tableau.
- **Quadrichromie (approximations à valider avec l'imprimeur) :** accent jour ≈ C70 M30 Y55 K25 ; texte ≈ C75 M60 Y60 K85.

## 5. Typographie

Une seule famille : **Geist**, avec **Geist Mono** pour la structure. Les deux sont gratuites (Google Fonts, paquet npm `geist`).

| Police     | Rôle                                                                                                                       | Graisses                  |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Geist      | tout ce qui se lit : titres, textes, boutons                                                                               | 400, 500, 600, 700 (logo) |
| Geist Mono | tout ce qui se repère : fil d'Ariane, titres de section, dates, étiquettes, fiche clé / valeur, montants dans les tableaux | 400, 500                  |

**Polices de secours :** `system-ui, sans-serif` et `ui-monospace, monospace`. Dans Word ou Google Docs sans Geist : Arial pour Geist, Courier New pour Geist Mono, mêmes tailles.

### Échelle écran

| Niveau        | Taille            | Graisse | Interlignage | Approche |
| ------------- | ----------------- | ------- | ------------ | -------- |
| Titre de page | 40–76 px (fluide) | 600     | 1,0          | −0,04 em |
| Exergue       | 22–28 px          | 500     | 1,35         | −0,02 em |
| Intertitre    | 19–21 px          | 600     | 1,3          | −0,01 em |
| Chapô         | 18–21 px          | 400     | 1,5          | 0        |
| Texte         | 15–16 px          | 400     | 1,6          | 0        |
| Mono (méta)   | 12–13 px          | 400–500 | 1,6          | 0        |

### Échelle imprimée (A4)

| Niveau                | Taille                        |
| --------------------- | ----------------------------- |
| Titre de document     | 28 pt / 600                   |
| Intertitre            | 13 pt / 600                   |
| Texte                 | 10 pt / 400, interligne 14 pt |
| Méta, tableaux (mono) | 8,5 pt                        |
| Mentions légales      | 7,5 pt                        |

### Micro-typographie française (obligatoire)

- Apostrophe typographique `’`, jamais `'`.
- Guillemets français avec espaces insécables : `« texte »`.
- Espace insécable avant `: ; ! ?` et `%`, et entre un nombre et son unité (`5 développeurs`, `1 200 €`).
- Intervalles avec un demi-cadratin `–` sans espace : `2021–2024`. Flèche `→` pour un journal de versions : `2024.10 → 2026.10`.
- Dates en mono au format `AAAA.MM` dans les parcours, en toutes lettres dans les textes et documents légaux (`10 octobre 2026`).
- Montants : `1 200,00 €` (espace fine insécable pour les milliers, virgule décimale, symbole après).
- Vraies listes à puces, jamais des « · » tapés à la main.
- Longueur de ligne : 60 à 75 caractères pour le texte courant.

## 6. Mise en page

- **Unité de base :** 4 px. Espacements courants : 4, 8, 12, 16, 20, 24, 32, 40, 56, 72, 96.
- **Web :** conteneur de 1 040 px maximum, marges latérales `clamp(20px, 4vw, 48px)`.
- **A4 :** marges de 20 mm, texte sur une colonne de 170 mm, ou une colonne de 40 mm + 120 mm pour les documents type CV / proposition.
- **Présentation 16:9 :** marges de 80 px sur 1 920 × 1 080, grille de 12 colonnes, gouttière de 24 px.
- **Rayon :** 2 px partout (boutons, blocs, cartes, champs, tuiles). 6 px pour la photo. Pastilles de statut en cercle.
- **Filets :** 1 px `--line`.
- **Pas d'ombre, pas de dégradé, pas de flou d'arrière-plan.**

## 7. Éléments graphiques

### Glyphes (à la place des icônes)

| Glyphe             | Sens                                     |
| ------------------ | ---------------------------------------- |
| `●` (accent)       | actif, en ligne, en cours, statut actuel |
| `○` (méta)         | archivé, terminé                         |
| `→`                | lien, action, période                    |
| `+` (accent, mono) | élément d'une liste de réalisations      |
| `~/`               | début d'un fil d'Ariane                  |

Seules icônes autorisées : réseaux sociaux (GitHub, LinkedIn, Dribbble, Behance) et bouton jour / nuit, en trait de 1,5 px, taille 16 px, couleur `--text`. Pour les liens sociaux, préférer les mots aux logos.

### Composants de base

- **Bouton principal :** fond `--accent`, texte `--on-accent`, Geist 500 15 px, hauteur 44 px, padding horizontal 20 px, rayon 2 px. Libellé type « Prendre contact ».
- **Bouton secondaire :** fond transparent, bordure 1 px `--line`, texte `--text`.
- **Titre de section :** Geist Mono 13 px, 500, `--muted`, en minuscules, sans préfixe (ni `#` ni numéro).
- **Fiche clé / valeur :** fond `--surface`, bordure `--line`, rayon 2 px, padding 24 px, Geist Mono 13 px ; clés en `--muted`, valeurs en `--text`.
- **Entrée de journal :** colonne date en mono (160 px), puis intitulé en Geist 600 suivi de « · Entreprise » en `--muted`, puis description. Filet `--line` entre deux entrées. Date de l'entrée en cours en `--accent`.
- **Tableau :** en-tête sur `--surface` en mono 12 px `--muted`, lignes séparées par des filets `--line`, chiffres en mono alignés à droite.

## 8. Photo

Portrait existant, en couleur naturelle, sans filtre. Ne pas l'utiliser en très grand format : c'est un repère humain, pas une image de couverture. Rayon 6 px, jamais en cercle.

## 9. Applications

### Facture et devis (A4, PDF, mode jour)

```
┌───────────────────────────────────────────────────────────┐
│ valentinbourreau                          FACTURE         │
│                                           n° 2026-001     │
│ ───────────────────────────────────────────────────────── │  filet --line
│ Émetteur (mono, méta)        Client (mono, méta)          │
│ Valentin Bourreau — EI       [Raison sociale]             │
│ [Adresse]                    [Adresse]                    │
│ SIRET [n°]                   [SIRET / TVA intracom.]      │
│                                                           │
│ date      2026.10.20     échéance   2026.11.19            │
│                                                           │
│ ┌ désignation ──────────── qté ── p.u. HT ──── total HT ┐ │  en-tête --surface
│ │ Mission front-end …       5 j    600,00 €   3 000,00 € │ │
│ └────────────────────────────────────────────────────────┘ │
│                                  Total HT    3 000,00 €   │
│                                  Net à payer 3 000,00 €   │  accent sur le montant
│                                                           │
│ TVA non applicable, art. 293 B du CGI.                    │
│ Conditions de paiement, pénalités de retard, indemnité    │
│ forfaitaire de 40 € pour frais de recouvrement, RIB.      │  7,5 pt, --muted
└───────────────────────────────────────────────────────────┘
```

- Le titre « FACTURE » ou « DEVIS » est en Geist 600 28 pt, le numéro en mono.
- Le seul accent est le montant « Net à payer » (ou un `●` devant « payée »).
- Les mentions légales sont listées pour mémoire : à faire valider par ton comptable ou l'URSSAF selon ton statut.

### Proposition commerciale (A4, PDF)

1. **Couverture :** logo en haut à gauche, fil d'Ariane en mono (`~/propositions/[client]`), titre Geist 600 28–36 pt, client et date en mono, rien d'autre.
2. **Corps :** sections avec un titre mono en minuscules (`contexte`, `objectifs`, `approche`, `planning`, `budget`, `conditions`), texte 10 pt.
3. **Planning :** en format journal (`2026.11 → 2026.12`, puis l'étape).
4. **Budget :** dans le tableau standard, total en accent.
5. **Dernière page :** « Prendre contact », coordonnées, photo 22 mm.

### Présentation d'audit (16:9)

- **Fond :** jour pour une présentation en salle ou partagée en PDF, nuit possible pour un écran sombre.
- **Diapo de titre :** fil d'Ariane mono `~/audit/[client]`, titre 72–96 px Geist 600, date et périmètre en mono.
- **Diapos de contenu :** un titre mono en minuscules en haut à gauche, une idée par diapo, un exergue Geist 500 40–48 px.
- **Niveaux de gravité :** pas de couleur. Libellés mono `critique`, `majeur`, `détail`, avec `●` plein, `◐` et `○`.
- **Graphiques :** accent pour la série mise en avant, `--muted` pour les autres, pas de légende colorée multiple.
- **Pied de diapo :** `valentinbourreau` à gauche, numéro de diapo en mono à droite.

### Carte de visite (85 × 55 mm)

- **Recto (nuit) :** logotype en haut à gauche, puis « Ingénieur front-end senior » en bas, et la ligne `● freelance · valentinbourreau.com` en mono 7 pt.
- **Verso (jour) :** e-mail, téléphone et LinkedIn en mono.

### Signature e-mail

```
valentinbourreau                      (Geist 700, 15 px)
Ingénieur front-end senior · freelance
valentinbourreau.com · GitHub · LinkedIn   (mono 11 px, accent jour)
```

Pas d'image (logo ou photo) dans la signature, pour éviter les pièces jointes et les blocages.

### Image de partage (1 200 × 630)

Fond `--surface` jour, fil d'Ariane mono en haut, puis « Ingénieur front-end senior » en Geist 600 72 px, et `● freelance · valentinbourreau.com` en mono accent en bas. Marges de 64 px.

### CV PDF (A4, 1 page)

Mêmes contenus que la page `/resume`, en mode jour : en-tête avec photo 22 mm et logo, deux colonnes (40 mm pour la stack, la formation et les langues ; 120 mm pour le journal d'expériences).

## 10. Tokens

### CSS

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
  --radius: 2px;
  --radius-photo: 6px;
  --font-sans: "Geist", system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;
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
}
```

### JSON

```json
{
  "color": {
    "light": {
      "bg": "#F7F9F9",
      "surface": "#EEF1F0",
      "line": "#DCE2E0",
      "muted": "#646C6A",
      "text2": "#393F3E",
      "text": "#141818",
      "accent": "#3D6A60",
      "onAccent": "#FFFFFF"
    },
    "dark": {
      "bg": "#0E1111",
      "surface": "#151918",
      "line": "#272D2C",
      "muted": "#8F9896",
      "text2": "#BEC5C3",
      "text": "#E8ECEB",
      "accent": "#9EC4BA",
      "onAccent": "#0E1111"
    }
  },
  "font": { "sans": "Geist", "mono": "Geist Mono" },
  "radius": { "base": 2, "photo": 6 },
  "space": [4, 8, 12, 16, 20, 24, 32, 40, 56, 72, 96]
}
```

## 11. Vérification avant envoi

- [ ] Titre « Ingénieur front-end senior », statut « freelance » séparé.
- [ ] Une seule couleur d'accent, utilisée pour ce qui est vivant.
- [ ] Geist / Geist Mono uniquement, deux graisses par niveau au plus.
- [ ] Apostrophes `’`, demi-cadratins dans les dates, espaces insécables.
- [ ] Rayon 2 px, filets 1 px, aucune ombre ni dégradé, aucun émoji.
- [ ] Contrastes ≥ 4,5:1, PDF et impression en mode jour.
