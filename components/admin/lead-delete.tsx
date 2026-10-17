"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteLeadAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LeadDeleteProps = {
  id: number;
  /** Name of the lead, for the question and the accessible name of the button. */
  name: string;
  /** Text of the button: "Supprimer" in a row, "Supprimer la demande" in the sheet. */
  label: string;
  /** Called once the lead is gone, so that a dialog around the button can close. */
  onDeleted?: () => void;
};

/**
 * Deletes a lead after a confirmation. A quiet text button: it sits next to the main
 * actions without competing with them. Lotus keeps its copy: nothing is sent to it.
 */
const LeadDeleteComponent = ({ id, name, label, onDeleted }: LeadDeleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const remove = () => {
    startTransition(async () => {
      const result = await deleteLeadAction(id);

      if (result.ok) {
        toast.success("Demande supprimée.");
        setIsOpen(false);
        onDeleted?.();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        // Holds the visible text ("Supprimer", "Supprimer la demande") and says whose.
        aria-label={`Supprimer la demande de ${name}`}
        className="min-h-9 border-transparent px-1 type-small text-text2 underline decoration-line underline-offset-4 hover:border-transparent"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {label}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent closeLabel="fermer">
          <DialogHeader>
            <DialogTitle>Supprimer la demande de {name}&#160;?</DialogTitle>
            <DialogDescription>
              Elle disparaît de l’admin et de l’export, avec ses notes. Lotus n’est pas modifié.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Annuler
            </Button>
            <Button type="button" disabled={isPending} onClick={remove}>
              {isPending ? "Suppression…" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadDeleteComponent;
