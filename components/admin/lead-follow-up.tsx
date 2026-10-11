"use client";

import { type SyntheticEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import { type ActionResult, deleteLeadAction, updateLeadFollowUpAction } from "@/app/admin/actions";
import { STATUS_LABELS } from "@/app/admin/labels";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  LEAD_STATUSES,
  type LeadFollowUp,
  type LeadStatus,
  MAX_NOTES_LENGTH,
} from "@/lib/models/lead";

type LeadFollowUpProps = LeadFollowUp & {
  id: number;
  /** Name of the lead, for the title of the dialog. */
  name: string;
};

/** Opens the follow-up sheet of a lead: status, amount, next date, notes, deletion. */
const LeadFollowUpComponent = ({
  id,
  name,
  status,
  notes,
  amount,
  followUpOn,
}: LeadFollowUpProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isConfirming, setIsConfirming] = useState(false);
  const [form, setForm] = useState({
    status,
    notes: notes ?? "",
    amount: amount === null ? "" : String(amount),
    followUpOn: followUpOn ?? "",
  });

  const run = (action: () => Promise<ActionResult>, success: string) => {
    startTransition(async () => {
      const result = await action();

      if (result.ok) {
        toast.success(success);
        setIsOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  const save = (event: SyntheticEvent) => {
    event.preventDefault();
    run(
      () =>
        updateLeadFollowUpAction(id, {
          status: form.status,
          notes: form.notes,
          amount: form.amount,
          followUpOn: form.followUpOn,
        }),
      "Suivi enregistré.",
    );
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className="min-h-9 px-3 text-[13px]"
        onClick={() => {
          setForm({
            status,
            notes: notes ?? "",
            amount: amount === null ? "" : String(amount),
            followUpOn: followUpOn ?? "",
          });
          setIsConfirming(false);
          setIsOpen(true);
        }}
      >
        Suivi
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent closeLabel="fermer">
          <form className="flex flex-col gap-5" onSubmit={save}>
            <DialogHeader>
              <DialogTitle>{name}</DialogTitle>
              <DialogDescription>Où en est cette demande, et quand y revenir.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor={`status-${id}`}>statut</Label>
                {/* A native select: a short fixed list does not need a custom listbox. */}
                <select
                  id={`status-${id}`}
                  className="h-11 rounded border border-input bg-background px-3 text-[15px] text-foreground"
                  value={form.status}
                  onChange={(event) => {
                    setForm({ ...form, status: event.target.value as LeadStatus });
                  }}
                >
                  {LEAD_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {STATUS_LABELS[value]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`amount-${id}`}>montant estimé (€) · facultatif</Label>
                <Input
                  id={`amount-${id}`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  value={form.amount}
                  onChange={(event) => {
                    setForm({ ...form, amount: event.target.value });
                  }}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor={`follow-up-${id}`}>relancer le · facultatif</Label>
                <Input
                  id={`follow-up-${id}`}
                  type="date"
                  value={form.followUpOn}
                  onChange={(event) => {
                    setForm({ ...form, followUpOn: event.target.value });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`notes-${id}`}>notes</Label>
              <Textarea
                id={`notes-${id}`}
                value={form.notes}
                maxLength={MAX_NOTES_LENGTH}
                placeholder="Échanges, contexte, prochaine étape…"
                onChange={(event) => {
                  setForm({ ...form, notes: event.target.value });
                }}
              />
            </div>
            <DialogFooter>
              {isConfirming ? (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isPending}
                    onClick={() => {
                      run(() => deleteLeadAction(id), "Demande supprimée.");
                    }}
                  >
                    Confirmer la suppression
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsConfirming(false);
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isPending}
                  onClick={() => {
                    setIsConfirming(true);
                  }}
                >
                  Supprimer
                </Button>
              )}
              <Button type="submit" disabled={isPending}>
                {isPending ? "Enregistrement…" : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadFollowUpComponent;
