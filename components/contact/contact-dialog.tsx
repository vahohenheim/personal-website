"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ReactNode,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { readSource, rememberSource, trackFunnel } from "@/lib/funnel/track";
import { type Locale } from "@/lib/i18n/config";
import { isValidEmail } from "@/lib/leads/validation";
import { type FunnelEvent } from "@/lib/models/funnel";
import {
  type ContactErrorCode,
  LEAD_NEEDS,
  LEAD_TIMELINES,
  type LeadNeed,
  type LeadTimeline,
  MAX_COMPANY_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  MIN_MESSAGE_LENGTH,
} from "@/lib/models/lead";
import { type Dictionary } from "@/locales/en";
import { ContactContext, markContactSent } from "./contact-context";
import StatusDotComponent from "../status-dot/status-dot";

type ContactDialogProviderProps = {
  locale: Locale;
  email: string;
  texts: Dictionary["contact"];
  children: ReactNode;
};

type Fields = {
  need: LeadNeed | "";
  timeline: LeadTimeline | "";
  message: string;
  name: string;
  email: string;
  company: string;
  /** Honeypot: hidden from people, so only a bot fills it. */
  website: string;
};

const EMPTY: Fields = {
  need: "",
  timeline: "",
  message: "",
  name: "",
  email: "",
  company: "",
  website: "",
};

const STEPS = ["need", "details", "identity"] as const;
/** Counter moved when a step is reached. Opening the dialog shows the first one. */
const STEP_EVENTS: FunnelEvent[] = [
  "contact_open",
  "contact_step_details",
  "contact_step_identity",
];
const SUCCESS = STEPS.length;

type ErrorKey = ContactErrorCode | "network";

/** Rules of one step, checked before moving on. The server checks them again. */
const validateStep = (step: number, fields: Fields): ErrorKey | null => {
  if (step === 0 && fields.need === "") {
    return "need_required";
  }

  if (step === 1 && fields.message.trim().length < MIN_MESSAGE_LENGTH) {
    return "message_too_short";
  }

  if (step === 2) {
    if (fields.name.trim() === "") {
      return "name_required";
    }

    if (!isValidEmail(fields.email.trim().toLowerCase())) {
      return "invalid_email";
    }
  }

  return null;
};

/**
 * The contact dialog and what opens it. Mounted once in the root layout; any
 * `ContactTriggerComponent` below it opens the same dialog.
 */
const ContactDialogProvider = ({ locale, email, texts, children }: ContactDialogProviderProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [invalid, setInvalid] = useState<ErrorKey | null>(null);
  const [isSending, setIsSending] = useState(false);
  // When the dialog was opened: the server refuses forms filled in faster than a person can.
  const startedAt = useRef(0);

  // Where the visitor came from is noted on arrival, before any navigation inside the site.
  useEffect(() => {
    rememberSource();
  }, []);

  const open = useCallback(() => {
    trackFunnel("contact_open");
    startedAt.current = Date.now();
    setStep(0);
    setFields(EMPTY);
    setInvalid(null);
    setIsOpen(true);
  }, []);

  const context = useMemo(() => ({ open }), [open]);

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
    setInvalid(null);
  };

  /** Every error of the form ends here: one toast, in the visitor's language. */
  const report = (error: ErrorKey) => {
    setInvalid(error);
    toast.error(texts.errors[error].replace("{email}", email));
  };

  const close = () => {
    setIsOpen(false);

    // After a message, the visitor lands on the home page, which now shows the confirmation.
    if (step === SUCCESS) {
      router.push(`/${locale}/`);
    }
  };

  const send = async () => {
    setIsSending(true);

    try {
      const response = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          locale,
          source: readSource(),
          startedAt: startedAt.current,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        const code = body?.error;

        report(code && code in texts.errors ? (code as ErrorKey) : "server_error");

        return;
      }

      // An earlier error toast would contradict the confirmation.
      toast.dismiss();
      trackFunnel("contact_sent");
      markContactSent(true);
      setStep(SUCCESS);
    } catch {
      report("network");
    } finally {
      setIsSending(false);
    }
  };

  const submit = (event: SyntheticEvent) => {
    event.preventDefault();

    const error = validateStep(step, fields);

    if (error) {
      report(error);

      return;
    }

    if (step < STEPS.length - 1) {
      trackFunnel(STEP_EVENTS[step + 1]);
      setStep(step + 1);

      return;
    }

    void send();
  };

  const stepName = STEPS[step] as (typeof STEPS)[number] | undefined;

  return (
    <ContactContext.Provider value={context}>
      {children}
      <Dialog
        open={isOpen}
        onOpenChange={(next) => {
          if (!next) {
            close();
          }
        }}
      >
        <DialogContent closeLabel={texts.close}>
          {step === SUCCESS ? (
            <>
              <DialogHeader>
                <p className="flex items-center gap-2 font-mono text-[13px] text-primary">
                  <StatusDotComponent />
                  {texts.success.status}
                </p>
                <DialogTitle className="text-[clamp(28px,4vw,36px)] leading-[1.1] tracking-[-0.03em]">
                  {texts.success.title}
                </DialogTitle>
                <DialogDescription>
                  {texts.success.text.replace("{name}", fields.name.trim())}
                </DialogDescription>
              </DialogHeader>
              <Card className="bg-surface p-5 font-mono text-[13px]">
                <CardContent>
                  <dl className="grid grid-cols-[minmax(72px,104px)_1fr] gap-x-5 gap-y-2">
                    <dt className="text-muted-foreground">{texts.success.recap.need}</dt>
                    <dd>{fields.need !== "" && texts.need.options[fields.need]}</dd>
                    {fields.timeline !== "" && (
                      <>
                        <dt className="text-muted-foreground">{texts.success.recap.timeline}</dt>
                        <dd>{texts.details.timelines[fields.timeline]}</dd>
                      </>
                    )}
                    <dt className="text-muted-foreground">{texts.success.recap.email}</dt>
                    <dd className="break-all">{fields.email.trim()}</dd>
                  </dl>
                </CardContent>
              </Card>
              <DialogFooter>
                <Button type="button" onClick={close}>
                  {texts.success.back}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <form className="flex flex-col gap-6" noValidate onSubmit={submit}>
              <DialogHeader>
                <p className="font-mono text-[13px] text-muted-foreground">
                  {texts.step
                    .replace("{current}", String(step + 1))
                    .replace("{total}", String(STEPS.length))}
                </p>
                <DialogTitle>{stepName && texts[stepName].title}</DialogTitle>
                <DialogDescription className={step === 0 ? undefined : "sr-only"}>
                  {texts.description}
                </DialogDescription>
              </DialogHeader>

              {step === 0 && (
                <RadioGroup
                  aria-label={texts.need.title}
                  value={fields.need}
                  onValueChange={(value) => {
                    set("need", value as LeadNeed);
                  }}
                >
                  {LEAD_NEEDS.map((need) => (
                    <Label
                      key={need}
                      htmlFor={`need-${need}`}
                      className="flex min-h-11 cursor-pointer items-center gap-3 rounded border border-border px-4 font-sans text-[15px] text-foreground has-[[data-state=checked]]:border-primary"
                    >
                      <RadioGroupItem id={`need-${need}`} value={need} />
                      {texts.need.options[need]}
                    </Label>
                  ))}
                </RadioGroup>
              )}

              {step === 1 && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-message">{texts.details.message}</Label>
                    <Textarea
                      id="contact-message"
                      value={fields.message}
                      maxLength={MAX_MESSAGE_LENGTH}
                      placeholder={texts.details.placeholder}
                      aria-invalid={invalid === "message_too_short"}
                      onChange={(event) => {
                        set("message", event.target.value);
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label id="contact-timeline">
                      {texts.details.timeline} · {texts.identity.optional}
                    </Label>
                    <RadioGroup
                      aria-labelledby="contact-timeline"
                      className="grid-cols-1 sm:grid-cols-2"
                      value={fields.timeline}
                      onValueChange={(value) => {
                        set("timeline", value as LeadTimeline);
                      }}
                    >
                      {LEAD_TIMELINES.map((timeline) => (
                        <Label
                          key={timeline}
                          htmlFor={`timeline-${timeline}`}
                          className="flex min-h-11 cursor-pointer items-center gap-3 rounded border border-border px-4 font-sans text-[15px] text-foreground has-[[data-state=checked]]:border-primary"
                        >
                          <RadioGroupItem id={`timeline-${timeline}`} value={timeline} />
                          {texts.details.timelines[timeline]}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-name">{texts.identity.name}</Label>
                    <Input
                      id="contact-name"
                      autoComplete="name"
                      value={fields.name}
                      maxLength={MAX_NAME_LENGTH}
                      aria-invalid={invalid === "name_required"}
                      onChange={(event) => {
                        set("name", event.target.value);
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-email">{texts.identity.email}</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={fields.email}
                      maxLength={MAX_EMAIL_LENGTH}
                      aria-invalid={invalid === "invalid_email"}
                      onChange={(event) => {
                        set("email", event.target.value);
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-company">
                      {texts.identity.company} · {texts.identity.optional}
                    </Label>
                    <Input
                      id="contact-company"
                      autoComplete="organization"
                      value={fields.company}
                      maxLength={MAX_COMPANY_LENGTH}
                      onChange={(event) => {
                        set("company", event.target.value);
                      }}
                    />
                  </div>
                  {/* Honeypot: out of sight and out of the tab order. */}
                  <div aria-hidden className="sr-only">
                    <label htmlFor="contact-website">website</label>
                    <input
                      id="contact-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={fields.website}
                      onChange={(event) => {
                        set("website", event.target.value);
                      }}
                    />
                  </div>
                  <p className="text-[13px] text-muted-foreground">
                    {texts.privacy}{" "}
                    <Link href={`/${locale}/legal/`} className="text-muted-foreground">
                      {texts.privacyLink}
                    </Link>
                  </p>
                </>
              )}

              <DialogFooter>
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isSending}
                    onClick={() => {
                      setInvalid(null);
                      setStep(step - 1);
                    }}
                  >
                    {texts.actions.back}
                  </Button>
                ) : (
                  <span />
                )}
                <Button type="submit" disabled={isSending}>
                  {step < STEPS.length - 1
                    ? texts.actions.next
                    : isSending
                      ? texts.actions.sending
                      : texts.actions.send}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </ContactContext.Provider>
  );
};

export default ContactDialogProvider;
