"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { type ActionResult, deleteLeadAction, updateLeadStatusAction } from "@/app/admin/actions";
import { STATUS_LABELS } from "@/app/admin/labels";
import { Button } from "@/components/ui/button";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/models/lead";

type LeadActionsProps = {
  id: number;
  status: LeadStatus;
};

/** Status change and deletion of one lead. Failures are reported with a toast. */
const LeadActionsComponent = ({ id, status }: LeadActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const [isConfirming, setIsConfirming] = useState(false);

  const run = (action: () => Promise<ActionResult>, success: string) => {
    startTransition(async () => {
      const result = await action();

      if (result.ok) {
        toast.success(success);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* A native select: three fixed choices do not need a custom listbox. */}
      <select
        aria-label="Statut"
        className="h-9 rounded border border-input bg-background px-2 font-mono text-[12px] text-foreground"
        value={status}
        disabled={isPending}
        onChange={(event) => {
          const next = event.target.value;
          run(() => updateLeadStatusAction(id, next), "Statut mis à jour.");
        }}
      >
        {LEAD_STATUSES.map((value) => (
          <option key={value} value={value}>
            {STATUS_LABELS[value]}
          </option>
        ))}
      </select>
      {isConfirming ? (
        <>
          <Button
            type="button"
            className="min-h-9 px-3 text-[13px]"
            disabled={isPending}
            onClick={() => {
              setIsConfirming(false);
              run(() => deleteLeadAction(id), "Demande supprimée.");
            }}
          >
            Confirmer
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="min-h-9 px-3 text-[13px]"
            onClick={() => {
              setIsConfirming(false);
            }}
          >
            Annuler
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant="secondary"
          className="min-h-9 px-3 text-[13px]"
          disabled={isPending}
          onClick={() => {
            setIsConfirming(true);
          }}
        >
          Supprimer
        </Button>
      )}
    </div>
  );
};

export default LeadActionsComponent;
