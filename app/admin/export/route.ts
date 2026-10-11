import { assertAdmin } from "@/lib/admin/guard";
import { getLeadStore } from "@/lib/leads/store";

/** One CSV cell. A leading =, +, - or @ is neutralised so that a spreadsheet never runs it. */
const cell = (value: string | number | null) => {
  const text = value === null ? "" : String(value);
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;

  return `"${safe.replaceAll('"', '""')}"`;
};

/** Every lead as a CSV file. */
export async function GET() {
  try {
    await assertAdmin();
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const leads = await getLeadStore().list();
  const rows = [
    [
      "id",
      "date",
      "statut",
      "besoin",
      "demarrage",
      "nom",
      "email",
      "entreprise",
      "langue",
      "message",
    ],
    ...leads.map((lead) => [
      lead.id,
      lead.createdAt,
      lead.status,
      lead.need,
      lead.timeline,
      lead.name,
      lead.email,
      lead.company,
      lead.locale,
      lead.message,
    ]),
  ];
  // The byte order mark makes Excel read the file as UTF-8.
  const csv = `﻿${rows.map((row) => row.map(cell).join(";")).join("\r\n")}\r\n`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
