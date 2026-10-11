"use client";

import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { markContactSent, useContactDialog, useContactSent } from "./contact-context";
import StatusDotComponent from "../status-dot/status-dot";

type ContactTriggerComponentProps = {
  /** `mailto:` address: what the link does without JavaScript. */
  href: string;
  /** A button, or the large link of the home page footer. */
  variant: "primary" | "secondary" | "link";
  /** Shown instead of the trigger once a message has been sent. */
  sentText: string;
  /** Link that lets the visitor write again. */
  againText: string;
  children: ReactNode;
};

/**
 * Opens the contact dialog. Rendered as a link to the e-mail address, so that it still
 * works if JavaScript is unavailable. After a message is sent, it becomes a confirmation.
 */
const ContactTriggerComponent = ({
  href,
  variant,
  sentText,
  againText,
  children,
}: ContactTriggerComponentProps) => {
  const { open } = useContactDialog();
  const sent = useContactSent();

  if (sent) {
    return (
      <p
        role="status"
        className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px] text-foreground",
          variant !== "link" && "min-h-11",
        )}
      >
        <StatusDotComponent />
        <span>{sentText}</span>
        <button
          type="button"
          className="cursor-pointer text-muted-foreground underline decoration-border underline-offset-[3px] hover:text-primary"
          onClick={() => {
            markContactSent(false);
            open();
          }}
        >
          {againText}
        </button>
      </p>
    );
  }

  const link = (
    <a
      href={href}
      className={
        variant === "link"
          ? "text-[clamp(24px,3vw,32px)] leading-[1.2] font-semibold tracking-[-0.02em]"
          : undefined
      }
      onClick={(event) => {
        event.preventDefault();
        open();
      }}
    >
      {children}
    </a>
  );

  if (variant === "link") {
    return link;
  }

  return (
    <Button asChild variant={variant === "primary" ? "default" : "secondary"}>
      {link}
    </Button>
  );
};

export default ContactTriggerComponent;
