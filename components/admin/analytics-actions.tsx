"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { snapshotAnalyticsAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

type AnalyticsActionsProps = {
  /** Days of history Vercel still has: what the import can recover. */
  retentionDays: number;
  refreshDays: number;
};

/** Copies audience figures from Vercel on demand. Failures are reported with a toast. */
const AnalyticsActionsComponent = ({ retentionDays, refreshDays }: AnalyticsActionsProps) => {
  const [isPending, startTransition] = useTransition();

  const run = (days: number, success: string) => {
    startTransition(async () => {
      const result = await snapshotAnalyticsAction(days);

      if (result.ok) {
        toast.success(success);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="secondary"
        className="min-h-9 px-3 text-[13px]"
        disabled={isPending}
        onClick={() => {
          run(refreshDays, "Fréquentation mise à jour.");
        }}
      >
        {isPending ? "Copie en cours…" : "Actualiser"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="min-h-9 px-3 text-[13px]"
        disabled={isPending}
        onClick={() => {
          run(retentionDays, `Historique des ${retentionDays} derniers jours importé.`);
        }}
      >
        Importer {retentionDays} jours
      </Button>
    </div>
  );
};

export default AnalyticsActionsComponent;
