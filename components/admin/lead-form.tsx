"use client";

import { type SyntheticEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  type ActionResult,
  createLeadAction,
  type LeadForm,
  updateLeadAction,
} from "@/app/admin/actions";
import { NEED_LABELS, STATUS_LABELS, TIMELINE_LABELS } from "@/app/admin/labels";
import LeadDeleteComponent from "@/components/admin/lead-delete";
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
import { LOCALES } from "@/lib/i18n/config";
import {
  type Lead,
  LEAD_NEEDS,
  LEAD_STATUSES,
  LEAD_TIMELINES,
  MAX_COMPANY_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  MAX_NOTES_LENGTH,
  MAX_SOURCE_LENGTH,
} from "@/lib/models/lead";

/** The fields of a lead the form shows: what it says and where it stands. */
export type LeadFormValues = Pick<
  Lead,
  | "name"
  | "email"
  | "company"
  | "source"
  | "locale"
  | "need"
  | "timeline"
  | "message"
  | "status"
  | "amount"
  | "followUpOn"
  | "notes"
>;

/** The button that opens the dialog: its text, and a fuller name when the text is short. */
type Trigger = { label: string; ariaLabel?: string; variant?: "default" | "secondary" };

type LeadFormProps =
  | {
      mode: "create";
      trigger: Trigger;
    }
  | {
      mode: "edit";
      trigger: Trigger;
      id: number;
      lead: LeadFormValues;
      /** "reçue le …", shown above the name. */
      received: string;
    };

const EMPTY: LeadForm = {
  name: "",
  email: "",
  company: "",
  source: "",
  locale: LOCALES[0],
  need: "",
  timeline: "",
  message: "",
  status: "new",
  amount: "",
  followUpOn: "",
  notes: "",
};

const toForm = (lead: LeadFormValues): LeadForm => ({
  name: lead.name,
  email: lead.email,
  company: lead.company ?? "",
  source: lead.source ?? "",
  locale: lead.locale,
  need: lead.need,
  timeline: lead.timeline ?? "",
  message: lead.message,
  status: lead.status,
  amount: lead.amount === null ? "" : String(lead.amount),
  followUpOn: lead.followUpOn ?? "",
  notes: lead.notes ?? "",
});

// A native select: a short fixed list does not need a custom listbox.
const SELECT_CLASS =
  "h-11 w-full rounded border border-input bg-background px-3 type-small text-foreground";

/**
 * The sheet of a lead, in a dialog: contact and need, then follow-up. The same form
 * creates a lead typed by hand and edits one; the edit dialog also deletes it.
 */
const LeadFormComponent = (props: LeadFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<LeadForm>(EMPTY);
  const prefix = props.mode === "edit" ? `lead-${props.id}` : "lead-new";

  const field = (key: keyof LeadForm) => (event: { target: { value: string } }) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const open = () => {
    setForm(props.mode === "edit" ? toForm(props.lead) : EMPTY);
    setIsOpen(true);
  };

  const save = (event: SyntheticEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result: ActionResult =
        props.mode === "edit"
          ? await updateLeadAction(props.id, form)
          : await createLeadAction(form);

      if (result.ok) {
        toast.success(props.mode === "edit" ? "Demande enregistrée." : "Demande ajoutée.");
        setIsOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        variant={props.trigger.variant ?? "secondary"}
        aria-label={props.trigger.ariaLabel}
        className={props.mode === "edit" ? "min-h-9 px-3 type-small" : undefined}
        onClick={open}
      >
        {props.trigger.label}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent closeLabel="fermer" className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <form className="flex flex-col gap-6" onSubmit={save}>
            <DialogHeader>
              {props.mode === "edit" && (
                <p className="type-meta text-muted-foreground">{props.received}</p>
              )}
              <DialogTitle>
                {props.mode === "edit" ? props.lead.name : "Nouvelle demande"}
              </DialogTitle>
              <DialogDescription>
                {props.mode === "edit"
                  ? "Ce qu’elle dit, où elle en est."
                  : "Une demande reçue par téléphone, par e-mail ou sur une plateforme."}
              </DialogDescription>
            </DialogHeader>

            <fieldset className="flex flex-col gap-4 border-t border-border pt-5">
              <legend className="float-left mb-4 w-full type-label text-muted-foreground">
                contact
              </legend>
              <div className="clear-both grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`${prefix}-name`}>nom</Label>
                  <Input
                    id={`${prefix}-name`}
                    required
                    maxLength={MAX_NAME_LENGTH}
                    autoComplete="off"
                    value={form.name}
                    onChange={field("name")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`${prefix}-email`}>e-mail</Label>
                  <Input
                    id={`${prefix}-email`}
                    type="email"
                    required
                    maxLength={MAX_EMAIL_LENGTH}
                    autoComplete="off"
                    value={form.email}
                    onChange={field("email")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`${prefix}-company`}>entreprise · facultatif</Label>
                  <Input
                    id={`${prefix}-company`}
                    maxLength={MAX_COMPANY_LENGTH}
                    autoComplete="off"
                    value={form.company}
                    onChange={field("company")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`${prefix}-source`}>origine · facultatif</Label>
                  <Input
                    id={`${prefix}-source`}
                    maxLength={MAX_SOURCE_LENGTH}
                    placeholder="malt, linkedin.com…"
                    autoComplete="off"
                    value={form.source}
                    onChange={field("source")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`${prefix}-need`}>besoin</Label>
                  <select
                    id={`${prefix}-need`}
                    required
                    className={SELECT_CLASS}
                    value={form.need}
                    onChange={field("need")}
                  >
                    <option value="" disabled>
                      Choisir…
                    </option>
                    {LEAD_NEEDS.map((value) => (
                      <option key={value} value={value}>
                        {NEED_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`${prefix}-timeline`}>démarrage · facultatif</Label>
                  <select
                    id={`${prefix}-timeline`}
                    className={SELECT_CLASS}
                    value={form.timeline}
                    onChange={field("timeline")}
                  >
                    <option value="">Non précisé</option>
                    {LEAD_TIMELINES.map((value) => (
                      <option key={value} value={value}>
                        {TIMELINE_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`${prefix}-locale`}>langue</Label>
                  <select
                    id={`${prefix}-locale`}
                    className={SELECT_CLASS}
                    value={form.locale}
                    onChange={field("locale")}
                  >
                    {LOCALES.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor={`${prefix}-message`}>message</Label>
                  <Textarea
                    id={`${prefix}-message`}
                    required
                    maxLength={MAX_MESSAGE_LENGTH}
                    value={form.message}
                    onChange={field("message")}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-4 border-t border-border pt-5">
              <legend className="float-left mb-4 w-full type-label text-muted-foreground">
                suivi
              </legend>
              <div className="clear-both grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`${prefix}-status`}>statut</Label>
                  <select
                    id={`${prefix}-status`}
                    className={SELECT_CLASS}
                    value={form.status}
                    onChange={field("status")}
                  >
                    {LEAD_STATUSES.map((value) => (
                      <option key={value} value={value}>
                        {STATUS_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`${prefix}-amount`}>montant estimé (€) · facultatif</Label>
                  <Input
                    id={`${prefix}-amount`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    value={form.amount}
                    onChange={field("amount")}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor={`${prefix}-follow-up`}>relancer le · facultatif</Label>
                  <Input
                    id={`${prefix}-follow-up`}
                    type="date"
                    value={form.followUpOn}
                    onChange={field("followUpOn")}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor={`${prefix}-notes`}>notes</Label>
                  <Textarea
                    id={`${prefix}-notes`}
                    maxLength={MAX_NOTES_LENGTH}
                    placeholder="Échanges, contexte, prochaine étape…"
                    value={form.notes}
                    onChange={field("notes")}
                  />
                </div>
              </div>
            </fieldset>

            <DialogFooter className="flex-wrap items-center gap-2 border-t border-border pt-5 sm:justify-between">
              {props.mode === "edit" ? (
                <LeadDeleteComponent
                  id={props.id}
                  name={props.lead.name}
                  label="Supprimer la demande"
                  onDeleted={() => {
                    setIsOpen(false);
                  }}
                />
              ) : (
                <span />
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Enregistrement…" : "Enregistrer"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadFormComponent;
