import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary";

const BASE =
  "inline-flex min-h-11 items-center justify-center rounded px-5 text-[15px] font-medium no-underline";

const VARIANTS: Record<ButtonVariant, string> = {
  // The main action: the only filled element of a page.
  primary: "bg-accent text-on-accent hover:bg-text hover:text-bg",
  secondary: "border border-line bg-transparent text-text hover:border-accent hover:text-accent",
};

/** Classes of a button. Apply them to a link or a `<button>`: both look the same. */
export const buttonClass = (variant: ButtonVariant, className?: string) =>
  cn(BASE, VARIANTS[variant], className);
