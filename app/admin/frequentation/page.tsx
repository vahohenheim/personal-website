import Link from "next/link";
import AdminFiguresComponent from "@/components/admin/admin-figures";
import AdminHeaderComponent from "@/components/admin/admin-header";
import AnalyticsActionsComponent from "@/components/admin/analytics-actions";
import BarsChartComponent from "@/components/admin/bars-chart";
import PageHeaderComponent from "@/components/page-header/page-header";
import SectionComponent, { SectionTitleComponent } from "@/components/section/section";
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
  getPeriodStart,
  isTrafficPeriod,
  loadTrafficReport,
  TRAFFIC_PERIODS,
} from "@/lib/analytics/report";
import { DAILY_SNAPSHOT_DAYS, VERCEL_RETENTION_DAYS } from "@/lib/analytics/snapshot";
import { type AnalyticsDimension } from "@/lib/analytics/vercel";
import { loadFunnelReport } from "@/lib/funnel/report";
import { dayFormat, longDayFormat, monthFormat, numberFormat, percentFormat } from "../formats";
import { breakdownLabel, FUNNEL_LABELS, PERIOD_LABELS } from "../labels";

// Read on every request: the page shows live data and must never be cached.
export const dynamic = "force-dynamic";

const BREAKDOWN_TITLES: Record<AnalyticsDimension, string> = {
  page: "pages",
  referrer: "sites d’origine",
  country: "pays",
  device: "appareils",
};

/** Audience and conversion: what the site is read for, and how many visits end in a lead. */
export default async function AdminTrafficPage({
  searchParams,
}: PageProps<"/admin/frequentation">) {
  await requireAdmin();

  const { periode } = await searchParams;
  const period = isTrafficPeriod(periode) ? periode : "30";
  const now = new Date();
  const [traffic, funnel] = await Promise.all([
    loadTrafficReport(period, now),
    loadFunnelReport(getPeriodStart(period, now)),
  ]);
  const sent = funnel.status === "ok" ? funnel.steps[funnel.steps.length - 1] : null;
  const visits = traffic.status === "ok" ? traffic.report.visits : 0;

  return (
    <>
      <AdminHeaderComponent
        current="traffic"
        action={
          <AnalyticsActionsComponent
            retentionDays={VERCEL_RETENTION_DAYS}
            refreshDays={DAILY_SNAPSHOT_DAYS}
          />
        }
      />

      <main className="container-page">
        <PageHeaderComponent
          breadcrumb={{
            label: "Fil d’Ariane",
            homeHref: "/",
            trail: [{ label: "admin", href: "/admin/" }, { label: "fréquentation" }],
          }}
          title="Fréquentation"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-border pt-4">
            <nav aria-label="Période">
              <ul className="flex list-none flex-wrap gap-x-5 gap-y-1 type-label">
                {TRAFFIC_PERIODS.map((value) => (
                  <li key={value}>
                    <Link
                      href={`/admin/frequentation/?periode=${value}`}
                      aria-current={value === period ? "true" : undefined}
                      className={
                        value === period
                          ? "inline-flex min-h-11 items-center text-primary no-underline"
                          : "inline-flex min-h-11 items-center text-muted-foreground no-underline hover:text-primary"
                      }
                    >
                      {PERIOD_LABELS[value]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {traffic.status === "ok" && (
              <p className="max-w-[64ch] type-meta text-muted-foreground">
                {traffic.report.history
                  ? `Historique du ${longDayFormat.format(new Date(traffic.report.history.firstDay))} au ${longDayFormat.format(new Date(traffic.report.history.lastDay))} (${traffic.report.history.days} jours).`
                  : "Aucun chiffre enregistré pour l’instant."}{" "}
                {traffic.report.configured
                  ? "Vercel ne garde qu’un mois : une copie est faite chaque nuit."
                  : "La copie quotidienne est inactive : WEB_ANALYTICS_TOKEN est absent."}
              </p>
            )}
          </div>
          {traffic.status === "error" ? (
            <p role="alert" className="font-semibold">
              Les chiffres de fréquentation n’ont pas pu être lus dans la base.
            </p>
          ) : (
            <AdminFiguresComponent
              className="lg:grid-cols-3"
              figures={[
                {
                  label: "pages vues",
                  value: numberFormat.format(traffic.report.pageviews),
                  detail: PERIOD_LABELS[period],
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
                    sent && visits > 0
                      ? `${percentFormat.format(sent.count / visits)} des visites`
                      : "rapporté aux visites",
                },
              ]}
            />
          )}
        </PageHeaderComponent>

        {traffic.status === "ok" && (
          <>
            {traffic.report.points.length > 0 && (
              <SectionComponent className="flex flex-col gap-6">
                <SectionTitleComponent>
                  {traffic.report.granularity === "month"
                    ? "pages vues par mois"
                    : "pages vues par jour"}
                </SectionTitleComponent>
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
              </SectionComponent>
            )}

            <SectionComponent className="flex flex-col gap-6">
              <SectionTitleComponent>détail</SectionTitleComponent>
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
                              <TableCell colSpan={3} className="type-small text-text2">
                                Aucune donnée sur la période.
                              </TableCell>
                            </TableRow>
                          ) : (
                            traffic.report.breakdowns[dimension].map((row) => (
                              <TableRow key={row.label}>
                                <TableCell className="max-w-[220px] type-small break-words">
                                  {breakdownLabel(dimension, row.label)}
                                </TableCell>
                                <TableCell className="text-right type-label">
                                  {numberFormat.format(row.pageviews)}
                                </TableCell>
                                <TableCell className="text-right type-label text-muted-foreground">
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
            </SectionComponent>
          </>
        )}

        <SectionComponent id="conversion" className="flex flex-col gap-6">
          <SectionTitleComponent>conversion</SectionTitleComponent>
          <p className="max-w-[64ch] type-label text-muted-foreground">
            Du visiteur au message envoyé, sur la même période ({PERIOD_LABELS[period]}). Compteurs
            anonymes par jour : aucun cookie, aucun identifiant.
          </p>
          <Card className="max-w-2xl">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>étape</TableHead>
                    <TableHead className="text-right">nombre</TableHead>
                    <TableHead className="text-right">de l’étape précédente</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {funnel.status === "error" ? (
                    <TableRow>
                      <TableCell colSpan={3} className="font-semibold">
                        Les compteurs n’ont pas pu être lus dans la base.
                      </TableCell>
                    </TableRow>
                  ) : (
                    funnel.steps.map((step) => (
                      <TableRow key={step.id}>
                        <TableCell className="type-small">{FUNNEL_LABELS[step.id]}</TableCell>
                        <TableCell className="text-right type-label">
                          {numberFormat.format(step.count)}
                        </TableCell>
                        <TableCell className="text-right type-label text-muted-foreground">
                          {step.rate === null ? "–" : percentFormat.format(step.rate)}
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
