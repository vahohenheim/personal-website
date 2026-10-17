import Link from "next/link";
import AdminFiguresComponent from "@/components/admin/admin-figures";
import AdminHeaderComponent from "@/components/admin/admin-header";
import BarsChartComponent from "@/components/admin/bars-chart";
import LeadDeleteComponent from "@/components/admin/lead-delete";
import LeadFormComponent from "@/components/admin/lead-form";
import PageHeaderComponent from "@/components/page-header/page-header";
import SectionComponent, { SectionTitleComponent } from "@/components/section/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdmin } from "@/lib/admin/guard";
import {
  computeLeadStats,
  isFollowUpDue,
  isLeadFilter,
  LEAD_FILTERS,
  matchesFilter,
} from "@/lib/admin/stats";
import { getPeriodStart, loadTrafficReport } from "@/lib/analytics/report";
import { isDatabaseConfigured } from "@/lib/db/client";
import { loadFunnelReport } from "@/lib/funnel/report";
import { getLeadStore } from "@/lib/leads/store";
import { getLotusState } from "@/lib/lotus/config";
import { countSyncDisplays, getSyncDisplay } from "@/lib/lotus/state";
import { type Lead } from "@/lib/models/lead";
import {
  amountFormat,
  dateFormat,
  longDayFormat,
  numberFormat,
  percentFormat,
  weekFormat,
} from "./formats";
import {
  describeSync,
  FILTER_LABELS,
  LOTUS_STATE_LABELS,
  NEED_LABELS,
  STATUS_LABELS,
  SYNC_LABELS,
  TIMELINE_LABELS,
} from "./labels";

// Read on every request: the page shows live data and must never be cached.
export const dynamic = "force-dynamic";

/** The recap of the audience covers this period; the audience page offers the others. */
const RECAP_PERIOD = "30";

/** "+2 vs 30 j précédents", or nothing to compare with. */
const trend = (current: number, previous: number) => {
  const difference = current - previous;
  const sign = difference > 0 ? "+" : "";

  return `${sign}${difference} vs 30 j précédents`;
};

const loadLeads = async (): Promise<{ leads: Lead[]; error: string | null }> => {
  try {
    return { leads: await getLeadStore().list(), error: null };
  } catch (error) {
    console.error("[admin] could not read the leads", {
      name: error instanceof Error ? error.name : "unknown",
    });

    return {
      leads: [],
      error:
        "La base de données ne répond pas ou n’est pas configurée (DATABASE_URL). Voir docs/database/neon.md.",
    };
  }
};

/**
 * The leads first: what is waiting, the list with its actions, then the trend. The audience
 * and the conversion have their own page; a recap of the last 30 days leads to it.
 */
export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();

  const { filtre } = await searchParams;
  const filter = isLeadFilter(filtre) ? filtre : "all";
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const [{ leads, error }, traffic, funnel] = await Promise.all([
    loadLeads(),
    loadTrafficReport(RECAP_PERIOD, now),
    loadFunnelReport(getPeriodStart(RECAP_PERIOD, now)),
  ]);
  const stats = computeLeadStats(leads, now);
  const lotus = getLotusState();
  const sync = countSyncDisplays(leads, now);
  const shown = leads.filter((lead) => matchesFilter(lead, filter, today));
  const sent = funnel.status === "ok" ? funnel.steps[funnel.steps.length - 1] : null;

  return (
    <>
      <AdminHeaderComponent current="leads" />

      <main className="container-page">
        <PageHeaderComponent
          breadcrumb={{ label: "Fil d’Ariane", homeHref: "/", trail: [{ label: "admin" }] }}
          title="Demandes"
        >
          {error && (
            <p role="alert" className="max-w-[64ch] font-semibold text-foreground">
              {error}
            </p>
          )}
          {!isDatabaseConfigured() && !error && (
            <p className="max-w-[64ch] type-label text-muted-foreground">
              Mode local sans base : les demandes sont gardées en mémoire et disparaissent au
              redémarrage du serveur.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <LeadFormComponent
              mode="create"
              trigger={{ label: "+ Nouvelle demande", variant: "default" }}
            />
            <Button asChild variant="secondary">
              {/* A file download: no prefetch, and the browser saves it. */}
              <Link href="/admin/export/" prefetch={false} download>
                Exporter en CSV
              </Link>
            </Button>
          </div>
          {/* Six figures: fixed columns, so that no row is left with an empty cell. */}
          <AdminFiguresComponent
            className="lg:grid-cols-3"
            figures={[
              {
                label: "à traiter",
                value: stats.open,
                detail: `${stats.byStatus.contacted} contactées`,
                live: stats.open > 0,
              },
              {
                label: "à relancer",
                value: stats.followUpsDue,
                detail: "date de relance atteinte",
                live: stats.followUpsDue > 0,
              },
              {
                label: "devis en attente",
                value: amountFormat.format(stats.quotedAmount),
                detail: `${stats.byStatus.quoted} devis envoyés`,
              },
              {
                label: "gagné",
                value: amountFormat.format(stats.wonAmount),
                detail: `${stats.byStatus.won} gagnées · ${stats.byStatus.lost} perdues`,
              },
              {
                label: "30 derniers jours",
                value: stats.last30Days,
                detail: trend(stats.last30Days, stats.previous30Days),
              },
              { label: "demandes reçues", value: stats.total, detail: "depuis le début" },
            ]}
          />
        </PageHeaderComponent>

        <SectionComponent id="liste" className="flex flex-col gap-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <SectionTitleComponent>toutes les demandes</SectionTitleComponent>
            <nav aria-label="Filtrer les demandes">
              <ul className="flex list-none flex-wrap gap-x-5 gap-y-1 type-label">
                {LEAD_FILTERS.map((value) => {
                  const count = leads.filter((lead) => matchesFilter(lead, value, today)).length;
                  const isCurrent = value === filter;

                  return (
                    <li key={value}>
                      <Link
                        href={value === "all" ? "/admin/#liste" : `/admin/?filtre=${value}#liste`}
                        aria-current={isCurrent ? "true" : undefined}
                        className={
                          isCurrent
                            ? "inline-flex min-h-11 items-center gap-2 text-primary no-underline"
                            : "inline-flex min-h-11 items-center gap-2 text-muted-foreground no-underline hover:text-primary"
                        }
                      >
                        {FILTER_LABELS[value]} <span className="tabular-nums">{count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          <p className="max-w-[64ch] type-meta text-muted-foreground">
            Transfert vers lotus {LOTUS_STATE_LABELS[lotus.status]}
            {leads.length > 0 &&
              ` ${(["synced", "pending", "rejected", "expired"] as const)
                .map((state) => `${sync[state]} ${SYNC_LABELS[state]}`)
                .join(" · ")}.`}
          </p>
          {shown.length === 0 ? (
            <p className="text-text2">
              {leads.length === 0
                ? "Aucune demande pour l’instant."
                : "Aucune demande sous ce filtre."}
            </p>
          ) : (
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>reçue</TableHead>
                      <TableHead>contact</TableHead>
                      <TableHead>besoin · message</TableHead>
                      <TableHead>suivi</TableHead>
                      <TableHead>
                        <span className="sr-only">actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shown.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="min-w-[180px] type-meta whitespace-nowrap text-muted-foreground">
                          <p>{dateFormat.format(new Date(lead.createdAt))}</p>
                          {/* In the text colour when it needs a look: refused, or too old. */}
                          <p
                            className={
                              ["rejected", "expired"].includes(getSyncDisplay(lead, now))
                                ? "font-semibold whitespace-normal text-foreground"
                                : "whitespace-normal"
                            }
                          >
                            <span aria-hidden>
                              {getSyncDisplay(lead, now) === "synced" ? "● " : "○ "}
                            </span>
                            lotus · {describeSync(lead, now)}
                          </p>
                        </TableCell>
                        <TableCell className="min-w-[180px]">
                          <p className="font-semibold">{lead.name}</p>
                          <a href={`mailto:${lead.email}`} className="type-small break-words">
                            {lead.email}
                          </a>
                          {lead.company && <p className="type-small text-text2">{lead.company}</p>}
                          {lead.source && (
                            <p className="type-meta text-muted-foreground">via {lead.source}</p>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[380px] min-w-[240px]">
                          <p>
                            {NEED_LABELS[lead.need]}
                            {lead.timeline && (
                              <span className="text-muted-foreground">
                                {" "}
                                · {TIMELINE_LABELS[lead.timeline]}
                              </span>
                            )}
                          </p>
                          <p className="line-clamp-3 type-small whitespace-pre-wrap text-text2">
                            {lead.message}
                          </p>
                        </TableCell>
                        <TableCell className="min-w-[200px]">
                          <div className="flex flex-col items-start gap-2">
                            <Badge variant={lead.status === "new" ? "default" : "secondary"}>
                              <span aria-hidden>{lead.status === "new" ? "●" : "○"}</span>
                              {STATUS_LABELS[lead.status]}
                            </Badge>
                            {lead.amount !== null && (
                              <p className="type-label">{amountFormat.format(lead.amount)}</p>
                            )}
                            {lead.followUpOn && (
                              <p
                                className={
                                  isFollowUpDue(lead, today)
                                    ? "type-meta font-semibold text-primary"
                                    : "type-meta text-muted-foreground"
                                }
                              >
                                relance le {longDayFormat.format(new Date(lead.followUpOn))}
                              </p>
                            )}
                            {lead.notes && (
                              <p className="line-clamp-3 max-w-[260px] type-small whitespace-pre-wrap text-text2">
                                {lead.notes}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <LeadFormComponent
                              mode="edit"
                              id={lead.id}
                              lead={lead}
                              received={`demande n° ${lead.id} · reçue le ${dateFormat.format(new Date(lead.createdAt))}`}
                              trigger={{
                                label: "Modifier",
                                ariaLabel: `Modifier la demande de ${lead.name}`,
                              }}
                            />
                            <LeadDeleteComponent id={lead.id} name={lead.name} label="Supprimer" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </SectionComponent>

        <SectionComponent id="frequentation" className="flex flex-col gap-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <SectionTitleComponent>fréquentation · 30 jours</SectionTitleComponent>
            <Link href="/admin/frequentation/" className="type-label">
              voir la fréquentation et la conversion →
            </Link>
          </div>
          {traffic.status === "error" ? (
            <p className="type-small text-text2">
              Les chiffres de fréquentation n’ont pas pu être lus dans la base.
            </p>
          ) : (
            <AdminFiguresComponent
              className="lg:grid-cols-3"
              figures={[
                {
                  label: "pages vues",
                  value: numberFormat.format(traffic.report.pageviews),
                  detail: "30 derniers jours",
                },
                {
                  label: "visites",
                  value: numberFormat.format(traffic.report.visits),
                  detail: "visiteurs uniques par jour, additionnés",
                },
                {
                  label: "messages envoyés",
                  value: sent ? numberFormat.format(sent.count) : "–",
                  detail:
                    sent && traffic.report.visits > 0
                      ? `${percentFormat.format(sent.count / traffic.report.visits)} des visites`
                      : "rapporté aux visites",
                },
              ]}
            />
          )}
        </SectionComponent>

        <SectionComponent id="tendance" className="flex flex-col gap-10">
          <SectionTitleComponent>tendance</SectionTitleComponent>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] gap-10">
            <div className="flex flex-col gap-4">
              <p className="type-meta text-text2">demandes par semaine · 12 semaines</p>
              <BarsChartComponent
                seriesLabel="Demandes"
                data={stats.weekly.map((point) => ({
                  label: weekFormat.format(new Date(point.week)),
                  value: point.leads,
                }))}
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="type-meta text-text2">par besoin</p>
              <BarsChartComponent
                seriesLabel="Demandes"
                horizontal
                data={stats.byNeed.map((point) => ({
                  label: NEED_LABELS[point.need],
                  value: point.leads,
                }))}
              />
            </div>
          </div>
          <Card className="max-w-2xl">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>origine des demandes</TableHead>
                    <TableHead className="text-right">demandes</TableHead>
                    <TableHead className="text-right">gagnées</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.bySource.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="type-small text-text2">
                        Aucune demande pour l’instant.
                      </TableCell>
                    </TableRow>
                  ) : (
                    stats.bySource.map((row) => (
                      <TableRow key={row.source}>
                        <TableCell className="max-w-[220px] type-small break-words">
                          {row.source === "" ? "Accès direct ou inconnu" : row.source}
                        </TableCell>
                        <TableCell className="text-right type-label">
                          {numberFormat.format(row.leads)}
                        </TableCell>
                        <TableCell className="text-right type-label text-muted-foreground">
                          {numberFormat.format(row.won)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </SectionComponent>
      </main>
    </>
  );
}
