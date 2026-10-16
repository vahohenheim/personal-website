import type { Metadata } from "next";
import AdminHeaderComponent from "@/components/admin/admin-header";
import DocumentLayoutComponent from "@/components/document-layout/document-layout";
import NumberedSectionComponent from "@/components/numbered-section/numbered-section";
import PageHeaderComponent from "@/components/page-header/page-header";
import { requireAdmin } from "@/lib/admin/guard";
import { SPECIMEN_GROUPS } from "./_components/registry";
import SpecimenComponent from "./_components/specimen";
import { SHOWN_FILES, SKIPPED_FILES } from "./coverage";

export const metadata: Metadata = {
  title: "design system | admin | valentinbourreau",
};

// Behind the admin guard, like every admin page: rendered on each request, never cached.
export const dynamic = "force-dynamic";

const SKIPPED = Object.entries(SKIPPED_FILES);

/**
 * The design system of the site: its tokens and every component, rendered with the
 * production code in day and night mode side by side. A page of the document template,
 * like the posts and the legal pages. See docs/frontend/design-system.md.
 */
export default async function DesignSystemPage() {
  await requireAdmin();

  const entries = [
    ...SPECIMEN_GROUPS.map(({ id, number, title }) => ({ id, number, title })),
    { id: "skipped", number: `${SPECIMEN_GROUPS.length + 1}`, title: "Hors vitrine" },
  ];

  return (
    <>
      <AdminHeaderComponent current="design-system" />
      <main className="container-page">
        <PageHeaderComponent
          breadcrumb={{
            label: "Fil d’Ariane",
            homeHref: "/",
            trail: [{ label: "admin", href: "/admin/" }, { label: "design-system" }],
          }}
          title="Design system"
          lead="Les couleurs, la typographie et les composants du site, rendus avec le code de production, en jour et en nuit côte à côte. À relire avant d’ajouter un composant ou une taille de texte."
          meta={
            <p className="type-label text-muted">
              charte v1.0 · {SHOWN_FILES.length} fichiers montrés · {SKIPPED.length} hors vitrine ·
              source components/
            </p>
          }
        />
        <DocumentLayoutComponent
          entries={entries}
          toc={{
            label: "sommaire",
            summary: `sommaire · ${entries.length} sections`,
            navLabel: "Sommaire du design system",
          }}
        >
          {SPECIMEN_GROUPS.map((group, index) => (
            <NumberedSectionComponent
              key={group.id}
              id={group.id}
              number={group.number}
              label={group.label}
              title={group.title}
              className={index === 0 ? "pb-10" : "border-t border-line py-10"}
            >
              {group.text && <p className="max-w-[68ch]">{group.text}</p>}
              {group.specimens.map((specimen) => (
                <SpecimenComponent key={specimen.name} {...specimen} />
              ))}
            </NumberedSectionComponent>
          ))}
          <NumberedSectionComponent
            id="skipped"
            number={`${SPECIMEN_GROUPS.length + 1}`}
            label="hors vitrine"
            title="Hors vitrine"
            className="border-t border-line py-10"
          >
            <p className="max-w-[68ch]">
              Ces fichiers ne sont pas rendus ici. Un test vérifie que chaque fichier de components/
              est soit montré, soit listé ici avec sa raison.
            </p>
            <dl className="flex flex-col border-t border-line type-small">
              {SKIPPED.map(([file, reason]) => (
                <div
                  key={file}
                  className="flex flex-col gap-1 border-b border-line py-3 sm:grid sm:grid-cols-[minmax(0,240px)_1fr] sm:gap-5"
                >
                  <dt className="type-label [overflow-wrap:anywhere] text-text">{file}</dt>
                  <dd className="text-text2">{reason}</dd>
                </div>
              ))}
            </dl>
          </NumberedSectionComponent>
        </DocumentLayoutComponent>
      </main>
    </>
  );
}
