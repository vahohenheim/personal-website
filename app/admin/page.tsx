import Link from "next/link";
import AnalyticsActionsComponent from "@/components/admin/analytics-actions";
import BarsChartComponent from "@/components/admin/bars-chart";
import LeadActionsComponent from "@/components/admin/lead-actions";
import SectionComponent, { SectionTitleComponent } from "@/components/section/section";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdmin } from "@/lib/admin/guard";
import { computeLeadStats } from "@/lib/admin/stats";
import { isTrafficPeriod, loadTrafficReport, TRAFFIC_PERIODS } from "@/lib/analytics/report";
import { DAILY_SNAPSHOT_DAYS, VERCEL_RETENTION_DAYS } from "@/lib/analytics/snapshot";
import { type AnalyticsDimension } from "@/lib/analytics/vercel";
import { isDatabaseConfigured } from "@/lib/db/client";
import { getLeadStore } from "@/lib/leads/store";
import { type Lead } from "@/lib/models/lead";
import {
  breakdownLabel,
  NEED_LABELS,
  PERIOD_LABELS,
  STATUS_LABELS,
  TIMELINE_LABELS,
} from "./labels";

// Read on every request: the page shows live data and must never be cached.
export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

const weekFormat = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit" });

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

const numberFormat = new Intl.NumberFormat("fr-FR");
const dayFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  timeZone: "UTC",
});
const monthFormat = new Intl.DateTimeFormat("fr-FR", {
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});
const longDayFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" });

const BREAKDOWN_TITLES: Record<AnalyticsDimension, string> = {
  page: "pages",
  referrer: "sites d’origine",
  country: "pays",
  device: "appareils",
};

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();

  const { periode } = await searchParams;
  const period = isTrafficPeriod(periode) ? periode : "30";
  const traffic = await loadTrafficReport(period);

  const { leads, error } = await loadLeads();
  const stats = computeLeadStats(leads, new Date());
  const figures = [
    { label: "demandes reçues", value: stats.total, detail: "depuis le début" },
    {
      label: "à traiter",
      value: stats.open,
      detail: `${stats.byStatus.contacted} contactées · ${stats.byStatus.closed} closes`,
      live: stats.open > 0,
    },
    {
      label: "30 derniers jours",
      value: stats.last30Days,
      detail: trend(stats.last30Days, stats.previous30Days),
    },
  ];

  return (
    <>
      <header className="container-page flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-6">
        <span className="text-[18px] leading-none font-bold tracking-[-0.02em]">
          valentinbourreau
        </span>
        <Button asChild variant="secondary">
          {/* A file download: no prefetch, and the browser saves it. */}
          <Link href="/admin/export/" prefetch={false} download>
            Exporter en CSV
          </Link>
        </Button>
      </header>

      <main className="container-page">
        <section className="flex flex-col gap-6 pt-[clamp(32px,5vw,64px)] pb-[clamp(40px,5vw,64px)]">
          <Breadcrumb aria-label="Fil d’Ariane">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">~/valentin-bourreau</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>admin</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-[clamp(32px,4.4vw,48px)] leading-[1.05] font-semibold tracking-[-0.03em]">
            Demandes de contact
          </h1>
          {error && (
            <p role="alert" className="max-w-[64ch] font-semibold text-foreground">
              {error}
            </p>
          )}
          {!isDatabaseConfigured() && !error && (
            <p className="max-w-[64ch] font-mono text-[13px] text-muted-foreground">
              Mode local sans base : les demandes sont gardées en mémoire et disparaissent au
              redémarrage du serveur.
            </p>
          )}
          <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-px overflow-hidden rounded border border-border bg-border">
            {figures.map((figure) => (
              <li key={figure.label} className="bg-background">
                <Card className="h-full gap-1 rounded-none border-0 p-6">
                  <p className="font-mono text-[12px] text-muted-foreground">{figure.label}</p>
                  <CardTitle
                    className={
                      figure.live
                        ? "text-[40px] leading-none tracking-[-0.03em] text-primary"
                        : "text-[40px] leading-none tracking-[-0.03em]"
                    }
                  >
                    {figure.value}
                  </CardTitle>
                  <CardDescription className="font-mono text-[12px] text-muted-foreground">
                    {figure.detail}
                  </CardDescription>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] gap-x-10">
          <SectionComponent className="flex flex-col gap-6">
            <SectionTitleComponent>demandes par semaine</SectionTitleComponent>
            <BarsChartComponent
              seriesLabel="Demandes"
              data={stats.weekly.map((point) => ({
                label: weekFormat.format(new Date(point.week)),
                value: point.leads,
              }))}
            />
          </SectionComponent>
          <SectionComponent className="flex flex-col gap-6">
            <SectionTitleComponent>par besoin</SectionTitleComponent>
            <BarsChartComponent
              seriesLabel="Demandes"
              horizontal
              data={stats.byNeed.map((point) => ({
                label: NEED_LABELS[point.need],
                value: point.leads,
              }))}
            />
          </SectionComponent>
        </div>

        <SectionComponent id="frequentation" className="flex flex-col gap-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
            <SectionTitleComponent>fréquentation</SectionTitleComponent>
            <nav aria-label="Période">
              <ul className="flex list-none flex-wrap gap-x-4 gap-y-1 font-mono text-[13px]">
                {TRAFFIC_PERIODS.map((value) => (
                  <li key={value}>
                    <Link
                      href={`/admin/?periode=${value}#frequentation`}
                      aria-current={value === period ? "true" : undefined}
                      className={
                        value === period
                          ? "text-primary no-underline"
                          : "text-muted-foreground no-underline hover:text-primary"
                      }
                    >
                      {PERIOD_LABELS[value]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {traffic.status === "error" ? (
            <p role="alert" className="font-semibold">
              Les chiffres de fréquentation n’ont pas pu être lus dans la base.
            </p>
          ) : (
            <>
              <p className="max-w-[64ch] font-mono text-[13px] text-muted-foreground">
                {traffic.report.history
                  ? `Historique conservé du ${longDayFormat.format(new Date(traffic.report.history.firstDay))} au ${longDayFormat.format(new Date(traffic.report.history.lastDay))} (${traffic.report.history.days} jours).`
                  : "Aucun chiffre enregistré pour l’instant."}{" "}
                {traffic.report.configured
                  ? "Vercel ne garde qu’un mois : une copie est faite chaque nuit."
                  : "La copie quotidienne est inactive : WEB_ANALYTICS_TOKEN est absent."}
              </p>
              <AnalyticsActionsComponent
                retentionDays={VERCEL_RETENTION_DAYS}
                refreshDays={DAILY_SNAPSHOT_DAYS}
              />
              <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-px overflow-hidden rounded border border-border bg-border">
                {[
                  {
                    label: "pages vues",
                    value: traffic.report.pageviews,
                    detail: PERIOD_LABELS[period],
                  },
                  {
                    label: "visites",
                    value: traffic.report.visits,
                    detail: "visiteurs uniques par jour, additionnés",
                  },
                ].map((figure) => (
                  <li key={figure.label} className="bg-background">
                    <Card className="h-full gap-1 rounded-none border-0 p-6">
                      <p className="font-mono text-[12px] text-muted-foreground">{figure.label}</p>
                      <CardTitle className="text-[40px] leading-none tracking-[-0.03em]">
                        {numberFormat.format(figure.value)}
                      </CardTitle>
                      <CardDescription className="font-mono text-[12px] text-muted-foreground">
                        {figure.detail}
                      </CardDescription>
                    </Card>
                  </li>
                ))}
              </ul>
              {traffic.report.points.length > 0 && (
                <BarsChartComponent
                  seriesLabel="Pages vues"
                  data={traffic.report.points.map((point) => ({
                    label:
                      traffic.report.granularity === "month"
                        ? monthFormat.format(new Date(`${point.label}-01`))
                        : dayFormat.format(new Date(point.label)),
                    value: point.pageviews,
                  }))}
                />
              )}
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6">
                {(Object.keys(BREAKDOWN_TITLES) as AnalyticsDimension[]).map((dimension) => (
                  <Card key={dimension}>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{BREAKDOWN_TITLES[dimension]}</TableHead>
                            <TableHead className="text-right">vues</TableHead>
                            <TableHead className="text-right">visites</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {traffic.report.breakdowns[dimension].length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="text-[15px] text-text2">
                                Aucune donnée sur la période.
                              </TableCell>
                            </TableRow>
                          ) : (
                            traffic.report.breakdowns[dimension].map((row) => (
                              <TableRow key={row.label}>
                                <TableCell className="max-w-[220px] text-[15px] break-words">
                                  {breakdownLabel(dimension, row.label)}
                                </TableCell>
                                <TableCell className="text-right font-mono text-[13px]">
                                  {numberFormat.format(row.pageviews)}
                                </TableCell>
                                <TableCell className="text-right font-mono text-[13px] text-muted-foreground">
                                  {numberFormat.format(row.visitors)}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </SectionComponent>

        <SectionComponent className="flex flex-col gap-6">
          <SectionTitleComponent>toutes les demandes</SectionTitleComponent>
          {leads.length === 0 ? (
            <p className="text-text2">Aucune demande pour l’instant.</p>
          ) : (
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>date</TableHead>
                      <TableHead>contact</TableHead>
                      <TableHead>besoin</TableHead>
                      <TableHead>message</TableHead>
                      <TableHead>suivi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-mono text-[12px] whitespace-nowrap text-muted-foreground">
                          {dateFormat.format(new Date(lead.createdAt))}
                        </TableCell>
                        <TableCell className="min-w-[180px]">
                          <p className="font-semibold">{lead.name}</p>
                          <a href={`mailto:${lead.email}`} className="text-[15px] break-words">
                            {lead.email}
                          </a>
                          {lead.company && <p className="text-[15px] text-text2">{lead.company}</p>}
                        </TableCell>
                        <TableCell className="min-w-[160px]">
                          <p>{NEED_LABELS[lead.need]}</p>
                          {lead.timeline && (
                            <p className="font-mono text-[12px] text-muted-foreground">
                              {TIMELINE_LABELS[lead.timeline]}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[420px] min-w-[260px] text-[15px] whitespace-pre-wrap text-text2">
                          {lead.message}
                        </TableCell>
                        <TableCell className="min-w-[200px]">
                          <div className="flex flex-col gap-2">
                            <Badge variant={lead.status === "new" ? "default" : "secondary"}>
                              <span aria-hidden>{lead.status === "new" ? "●" : "○"}</span>
                              {STATUS_LABELS[lead.status]}
                            </Badge>
                            <LeadActionsComponent id={lead.id} status={lead.status} />
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
      </main>
    </>
  );
}
