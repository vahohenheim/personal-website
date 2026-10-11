import Link from "next/link";
import LeadActionsComponent from "@/components/admin/lead-actions";
import LeadsChartComponent from "@/components/admin/leads-chart";
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
import { isDatabaseConfigured } from "@/lib/db/client";
import { getLeadStore } from "@/lib/leads/store";
import { type Lead } from "@/lib/models/lead";
import { NEED_LABELS, STATUS_LABELS, TIMELINE_LABELS } from "./labels";

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

export default async function AdminPage() {
  await requireAdmin();

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
            <LeadsChartComponent
              data={stats.weekly.map((point) => ({
                label: weekFormat.format(new Date(point.week)),
                leads: point.leads,
              }))}
            />
          </SectionComponent>
          <SectionComponent className="flex flex-col gap-6">
            <SectionTitleComponent>par besoin</SectionTitleComponent>
            <LeadsChartComponent
              horizontal
              data={stats.byNeed.map((point) => ({
                label: NEED_LABELS[point.need],
                leads: point.leads,
              }))}
            />
          </SectionComponent>
        </div>

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
                          <a href={`mailto:${lead.email}`} className="text-[15px] break-all">
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
