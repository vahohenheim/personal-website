import { type ReactNode } from "react";
import AchievementListComponent from "@/components/achievement-list/achievement-list";
import BarsChartComponent from "@/components/admin/bars-chart";
import AvatarComponent from "@/components/avatar/avatar";
import BreadcrumbComponent from "@/components/breadcrumb/breadcrumb";
import ChangelogEntryComponent from "@/components/changelog-entry/changelog-entry";
import HeadingComponent from "@/components/heading/heading";
import KeyValueComponent from "@/components/key-value/key-value";
import LegalBlocksComponent from "@/components/legal-blocks/legal-blocks";
import LogEntryComponent from "@/components/log-entry/log-entry";
import NumberedSectionComponent from "@/components/numbered-section/numbered-section";
import PageNavComponent from "@/components/page-nav/page-nav";
import PostCalloutComponent from "@/components/post-callout/post-callout";
import PostDecisionTableComponent from "@/components/post-decision-table/post-decision-table";
import PostDefinitionsComponent from "@/components/post-definitions/post-definitions";
import PostFigureComponent from "@/components/post-figure/post-figure";
import PostPlusListComponent, {
  PostPlusComponent,
} from "@/components/post-plus-list/post-plus-list";
import PostProjectSheetComponent from "@/components/post-project-sheet/post-project-sheet";
import PostPullQuoteComponent from "@/components/post-pull-quote/post-pull-quote";
import PostStatsComponent from "@/components/post-stats/post-stats";
import PostTagsComponent from "@/components/post-tags/post-tags";
import ProcessingListComponent from "@/components/processing-list/processing-list";
import ProjectCardComponent from "@/components/project-card/project-card";
import RichTextComponent from "@/components/rich-text/rich-text";
import SectionComponent, { SectionTitleComponent } from "@/components/section/section";
import StatusDotComponent from "@/components/status-dot/status-dot";
import ThemeToggleComponent from "@/components/theme-toggle/theme-toggle";
import TocComponent from "@/components/toc/toc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { type LegalBlock } from "@/lib/models/legal";
import { home, resume } from "@/locales/content/fr";
import { cgv } from "@/locales/legal/cgv.fr";
import { sections as noticeSections } from "@/locales/legal/notice.fr";
import { type ShownFile } from "../coverage";
import { type SpecimenMode } from "./specimen";

// The specimens of the design system page, grouped as its sections. Contents come from the
// site itself (locales/) wherever it has some, so that the page shows real cases.

export type Specimen = {
  name: string;
  files: readonly ShownFile[];
  stack?: boolean;
  render: (mode: SpecimenMode) => ReactNode;
};

export type SpecimenGroup = {
  id: string;
  number: string;
  /** fondations · atomes · composés · gabarits */
  label: string;
  title: string;
  text?: string;
  specimens: Specimen[];
};

const COLOR_TOKENS = [
  { name: "bg", className: "bg-bg" },
  { name: "surface", className: "bg-surface" },
  { name: "line", className: "bg-line" },
  { name: "muted", className: "bg-muted" },
  { name: "text2", className: "bg-text2" },
  { name: "text", className: "bg-text" },
  { name: "accent", className: "bg-accent" },
  { name: "on-accent", className: "bg-on-accent" },
];

const TYPE_STYLES = [
  { name: "display", className: "type-display", sample: home.title },
  { name: "display-compact", className: "type-display-compact", sample: home.title },
  { name: "title", className: "type-title", sample: "Modes d’exécution" },
  { name: "subhead", className: "type-subhead", sample: "Lead tech front-end · SOLO Paris" },
  { name: "quote", className: "type-quote", sample: home.brings.quote },
  { name: "lead", className: "type-lead text-text2", sample: home.lead },
  { name: "body", className: "type-body text-text2", sample: resume.summary },
  { name: "small", className: "type-small text-text2", sample: "Objet et champ d’application" },
  {
    name: "label",
    className: "type-label text-muted",
    sample: "changelog · 2026.10 → aujourd’hui",
  },
  { name: "meta", className: "type-meta text-muted", sample: "13 oct. 2026 · 9 min de lecture" },
];

const SPACES = [
  { name: "space-1 · 4 px", className: "w-1" },
  { name: "space-2 · 8 px", className: "w-2" },
  { name: "space-4 · 16 px", className: "w-4" },
  { name: "space-6 · 24 px", className: "w-6" },
  { name: "space-10 · 40 px", className: "w-10" },
  { name: "space-14 · 56 px", className: "w-14" },
  { name: "space-24 · 96 px", className: "w-24" },
];

const isProcessing = (block: LegalBlock): block is Extract<LegalBlock, { type: "processing" }> =>
  block.type === "processing";

const PROCESSING = noticeSections
  .flatMap((section) => section.blocks)
  .filter(isProcessing)
  .flatMap((block) => block.items)
  .slice(0, 2);

const SUBSECTION_ARTICLE = cgv.sections.find((section) => section.number === "04");

const FREELANCE = resume.changelog.entries[0];
const SOLO = resume.changelog.entries[1];

export const SPECIMEN_GROUPS: SpecimenGroup[] = [
  {
    id: "colors",
    number: "01",
    label: "fondations",
    title: "Couleurs",
    text: "Huit jetons, deux modes. L’accent signale ce qui est vivant, sous 5 % de la surface.",
    specimens: [
      {
        name: "Jetons de couleur",
        files: [],
        render: () => (
          <ul className="grid list-none grid-cols-2 gap-3 sm:grid-cols-4">
            {COLOR_TOKENS.map((token) => (
              <li key={token.name} className="flex flex-col gap-2 type-meta text-muted">
                <span className={`${token.className} h-10 rounded border border-line`} />
                {token.name}
              </li>
            ))}
          </ul>
        ),
      },
    ],
  },
  {
    id: "type",
    number: "02",
    label: "fondations",
    title: "Typographie",
    text: "Neuf styles écran et un pas de plus pour les longs titres d’articles. Aucune autre taille de texte.",
    specimens: [
      {
        name: "Styles type-*",
        files: ["heading/heading"],
        stack: true,
        render: () => (
          <dl className="flex flex-col gap-4">
            {TYPE_STYLES.map((style) => (
              <div key={style.name} className="flex flex-col gap-1 border-t border-line pt-3">
                <dt className="type-meta text-muted">{style.name}</dt>
                <dd className={style.className}>{style.sample}</dd>
              </div>
            ))}
          </dl>
        ),
      },
      {
        name: "Heading · niveau et style séparés",
        files: ["heading/heading", "section/section"],
        render: () => (
          <>
            <HeadingComponent level={3}>h3 · subhead</HeadingComponent>
            <HeadingComponent level={3} variant="label">
              h3 · label
            </HeadingComponent>
            <SectionTitleComponent>section · titre d’index</SectionTitleComponent>
          </>
        ),
      },
    ],
  },
  {
    id: "space",
    number: "03",
    label: "fondations",
    title: "Espacements, rayons et filets",
    specimens: [
      {
        name: "Unité de 4 px · rayon 2 px · filet 1 px",
        files: ["ui/separator"],
        render: () => (
          <>
            <ul className="flex list-none flex-col gap-2">
              {SPACES.map((space) => (
                <li key={space.name} className="flex items-center gap-4 type-meta text-muted">
                  <span className="w-32 shrink-0">{space.name}</span>
                  <span className={`${space.className} h-2 rounded bg-accent`} />
                </li>
              ))}
            </ul>
            <Separator />
            <div className="flex gap-4">
              <span className="size-12 rounded border border-line bg-surface" />
              <span className="size-12 rounded-photo border border-line bg-surface" />
            </div>
          </>
        ),
      },
    ],
  },
  {
    id: "buttons",
    number: "04",
    label: "atomes",
    title: "Boutons",
    specimens: [
      {
        name: "Button · ThemeToggle",
        files: ["ui/button", "theme-toggle/theme-toggle"],
        render: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button">{home.actions.contact}</Button>
            <Button type="button" variant="secondary">
              {home.actions.resume}
            </Button>
            <Button type="button" disabled>
              Désactivé
            </Button>
            <ThemeToggleComponent label="Passer en mode jour ou nuit" />
          </div>
        ),
      },
    ],
  },
  {
    id: "links",
    number: "05",
    label: "atomes",
    title: "Liens et fil d’Ariane",
    specimens: [
      {
        name: "Lien · Breadcrumb · RichText",
        files: ["breadcrumb/breadcrumb", "ui/breadcrumb", "rich-text/rich-text"],
        render: () => (
          <>
            <p className="text-text2">
              <RichTextComponent text="Un [lien dans le texte](#links) et du `code` en ligne." />
            </p>
            <p className="type-label">
              <a href="#links">{home.changelog.more}</a>
            </p>
            <BreadcrumbComponent
              label="Fil d’Ariane d’exemple"
              homeHref="/admin/"
              trail={[{ label: "articles", href: "/admin/" }, { label: "pensee" }]}
            />
          </>
        ),
      },
    ],
  },
  {
    id: "status",
    number: "06",
    label: "atomes",
    title: "Statut et étiquettes",
    specimens: [
      {
        name: "StatusDot · Badge · PostTags",
        files: ["status-dot/status-dot", "ui/badge", "post-tags/post-tags"],
        render: () => (
          <>
            <p className="flex items-center gap-2 type-small text-text">
              <StatusDotComponent />
              Freelance
            </p>
            <div className="flex flex-wrap gap-4">
              <Badge>● {home.projects.status.online}</Badge>
              <Badge variant="secondary">○ {home.projects.status.archived}</Badge>
            </div>
            <PostTagsComponent tags={["next.js", "local-first", "api claude"]} label="Mots-clés" />
          </>
        ),
      },
    ],
  },
  {
    id: "fields",
    number: "07",
    label: "atomes",
    title: "Champs",
    specimens: [
      {
        name: "Label · Input · Textarea · RadioGroup",
        files: ["ui/label", "ui/input", "ui/textarea", "ui/radio-group"],
        render: (mode) => (
          <>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`ds-email-${mode}`}>e-mail</Label>
              <Input id={`ds-email-${mode}`} type="email" placeholder="vous@entreprise.fr" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`ds-message-${mode}`}>message</Label>
              <Textarea id={`ds-message-${mode}`} className="min-h-20" />
            </div>
            <RadioGroup defaultValue="lead" aria-label={`Besoin, ${mode}`}>
              {[
                { value: "lead", label: "Lead technique" },
                { value: "ds", label: "Design system" },
              ].map((option) => (
                <div key={option.value} className="flex items-center gap-3 type-small">
                  <RadioGroupItem value={option.value} id={`ds-${option.value}-${mode}`} />
                  <Label htmlFor={`ds-${option.value}-${mode}`} className="type-small text-text">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </>
        ),
      },
    ],
  },
  {
    id: "portrait",
    number: "08",
    label: "atomes",
    title: "Portrait",
    text: "Sur l’accueil et le CV seulement, comme sur le CV papier. Rayon de 6 px, la seule exception au rayon de 2 px.",
    specimens: [{ name: "Avatar", files: ["avatar/avatar"], render: () => <AvatarComponent /> }],
  },
  {
    id: "sheets",
    number: "09",
    label: "composés",
    title: "Fiche clé / valeur",
    text: "Une seule fiche pour le profil, la stack, l’identité de l’entreprise et la fiche projet d’un article.",
    specimens: [
      {
        name: "KeyValue · Card",
        files: ["key-value/key-value", "ui/card"],
        stack: true,
        render: () => <KeyValueComponent rows={home.card.slice(0, 4)} />,
      },
      {
        name: "PostProjectSheet",
        files: ["post-project-sheet/post-project-sheet"],
        stack: true,
        render: () => (
          <PostProjectSheetComponent
            rows={[
              ["rôle", "Produit, specs, design, développement"],
              ["plateforme", "iPhone uniquement, un seul utilisateur"],
            ]}
            status="en ligne"
            link={["mangezbrut.fr", "https://www.mangezbrut.fr"]}
          />
        ),
      },
    ],
  },
  {
    id: "entries",
    number: "10",
    label: "composés",
    title: "Entrées datées",
    text: "La grammaire du changelog, pour le journal de l’accueil et du CV et pour les listes d’articles.",
    specimens: [
      {
        name: "LogEntry · ChangelogEntry · AchievementList",
        files: [
          "log-entry/log-entry",
          "changelog-entry/changelog-entry",
          "achievement-list/achievement-list",
        ],
        stack: true,
        render: () => (
          <ol className="list-none">
            <ChangelogEntryComponent entry={FREELANCE} />
            <ChangelogEntryComponent entry={{ ...SOLO, achievements: undefined }} />
            <LogEntryComponent
              date={<time dateTime="2026-10-13">13 oct. 2026</time>}
              detail="9 min de lecture"
              title="pensee, un carnet hors ligne qui prend du recul"
            >
              <AchievementListComponent items={SOLO.achievements?.slice(0, 2) ?? []} />
            </LogEntryComponent>
          </ol>
        ),
      },
    ],
  },
  {
    id: "projects",
    number: "11",
    label: "composés",
    title: "Carte de projet",
    specimens: [
      {
        name: "ProjectCard",
        files: ["project-card/project-card"],
        render: () => (
          <ul className="list-none">
            <ProjectCardComponent
              project={home.projects.items[0]}
              statusLabels={home.projects.status}
              post={{ href: "/admin/design-system/#projects", label: "lire l’article" }}
            />
          </ul>
        ),
      },
    ],
  },
  {
    id: "document",
    number: "12",
    label: "composés",
    title: "Sommaire, sections et suite",
    text: "Le sommaire est à gauche sur toutes les pages qui en ont un. Les sections d’un article et les articles des CGV sont le même composant.",
    specimens: [
      {
        name: "Toc",
        files: ["toc/toc"],
        render: (mode) => (
          <TocComponent
            entries={cgv.sections.slice(0, 4).map(({ id, number, title }) => ({
              id: `${id}-${mode}`,
              number,
              title,
            }))}
            label="sommaire"
            summary="sommaire · 4 articles"
            navLabel={`Sommaire d’exemple, ${mode}`}
            variant="desktop"
            className="static flex w-auto"
          />
        ),
      },
      {
        name: "NumberedSection · PostSection · LegalBlocks",
        files: [
          "numbered-section/numbered-section",
          "post-section/post-section",
          "legal-blocks/legal-blocks",
        ],
        stack: true,
        render: (mode) =>
          SUBSECTION_ARTICLE && (
            <>
              <NumberedSectionComponent
                id={`${SUBSECTION_ARTICLE.id}-${mode}`}
                number={SUBSECTION_ARTICLE.number}
                title={SUBSECTION_ARTICLE.title}
                anchorLabel={`Lien vers l’article ${Number(SUBSECTION_ARTICLE.number)}`}
              >
                <LegalBlocksComponent
                  blocks={SUBSECTION_ARTICLE.blocks
                    .slice(0, 1)
                    .map((block) =>
                      block.type === "subsection" ? { ...block, id: `${block.id}-${mode}` } : block,
                    )}
                />
              </NumberedSectionComponent>
              <NumberedSectionComponent
                id={`ds-post-section-${mode}`}
                number="01"
                label="contexte"
                title="Pourquoi un carnet de plus"
                className="mt-6 border-t border-line pt-6"
              >
                <p className="max-w-[68ch] text-text2">
                  Je voulais deux choses. Écrire n’importe où, sans jamais attendre le réseau.
                </p>
              </NumberedSectionComponent>
            </>
          ),
      },
      {
        name: "PageNav",
        files: ["page-nav/page-nav"],
        render: (mode) => (
          <PageNavComponent
            label={`Pages liées, ${mode}`}
            next={{
              eyebrow: "article suivant →",
              title: "lotus, l’app qui gère ma micro-entreprise",
              href: "/admin/design-system/#document",
            }}
            back={{ label: "← tous les articles", href: "/admin/design-system/#document" }}
          />
        ),
      },
    ],
  },
  {
    id: "post-blocks",
    number: "13",
    label: "composés",
    title: "Blocs d’article",
    text: "Les composants MDX des articles (content/posts/), décrits dans docs/features/posts.md.",
    specimens: [
      {
        name: "Callout · PullQuote · PlusList",
        files: [
          "post-callout/post-callout",
          "post-pull-quote/post-pull-quote",
          "post-plus-list/post-plus-list",
        ],
        stack: true,
        render: () => (
          <>
            <PostCalloutComponent label="à retenir">
              <p>Le téléphone est la source de vérité.</p>
            </PostCalloutComponent>
            <PostPullQuoteComponent>
              <p>Le front-end arrive en dernier dans la chaîne de décision.</p>
            </PostPullQuoteComponent>
            <PostPlusListComponent>
              <PostPlusComponent title="L’écriture d’abord.">
                Rien ne ralentit la frappe.
              </PostPlusComponent>
              <PostPlusComponent title="Hors ligne par défaut.">
                Le serveur est une sauvegarde.
              </PostPlusComponent>
            </PostPlusListComponent>
          </>
        ),
      },
      {
        name: "Stats · Definitions · Figure",
        files: [
          "post-stats/post-stats",
          "post-definitions/post-definitions",
          "post-figure/post-figure",
        ],
        stack: true,
        render: () => (
          <>
            <PostStatsComponent
              items={[
                ["commits", "119"],
                ["tests", "~800"],
                ["ADR", "10"],
              ]}
            />
            <PostDefinitionsComponent
              items={[
                ["Notes", "Les notes du jour, l’heure en avant."],
                ["Recul", "Le bulletin de la semaine."],
              ]}
            />
            <PostFigureComponent caption="Une légende de figure, en small et en muted.">
              <div className="h-24 rounded border border-line bg-surface" />
            </PostFigureComponent>
          </>
        ),
      },
      {
        name: "DecisionTable · Table",
        files: ["post-decision-table/post-decision-table", "ui/table"],
        stack: true,
        render: () => (
          <>
            <PostDecisionTableComponent
              columns={["option", "pour", "contre"]}
              rows={[
                ["SQLite", "Hors ligne, rapide", "Synchro à écrire"],
                ["API seule", "Simple", "Rien sans réseau"],
              ]}
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>page</TableHead>
                  <TableHead className="text-right">vues</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>/fr/</TableCell>
                  <TableCell className="text-right type-label">128</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        ),
      },
    ],
  },
  {
    id: "data",
    number: "14",
    label: "composés",
    title: "Données",
    specimens: [
      {
        name: "BarsChart · Chart",
        files: ["admin/bars-chart", "ui/chart"],
        render: () => (
          <BarsChartComponent
            seriesLabel="Demandes"
            data={[
              { label: "S38", value: 2 },
              { label: "S39", value: 4 },
              { label: "S40", value: 3 },
              { label: "S41", value: 6 },
            ]}
          />
        ),
      },
      {
        name: "ProcessingList",
        files: ["processing-list/processing-list"],
        stack: true,
        render: () => <ProcessingListComponent items={PROCESSING} />,
      },
    ],
  },
  {
    id: "templates",
    number: "15",
    label: "gabarits",
    title: "En-tête de page et sections",
    text: "Deux gabarits : index (accueil, CV, articles, admin) et document (article, CGV, mentions légales, cette page). Les pages entières : /fr/, /fr/resume/, /fr/posts/, /fr/posts/pensee/, /fr/cgv/.",
    specimens: [
      {
        name: "Section (index) · PageHeader et DocumentLayout : cette page",
        files: ["page-header/page-header", "section/section", "document-layout/document-layout"],
        stack: true,
        render: () => (
          <SectionComponent className="flex flex-col gap-6 pb-0">
            <SectionTitleComponent>changelog</SectionTitleComponent>
            <p className="text-text2">Une section d’index s’ouvre sur un filet.</p>
          </SectionComponent>
        ),
      },
    ],
  },
];
