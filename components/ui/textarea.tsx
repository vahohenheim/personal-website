import * as React from "react";
import { cn } from "@/lib/utils/cn";

// shadcn/ui Textarea, restyled for the design charter: 1 px rule, 2 px radius.
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-32 w-full rounded border border-input bg-background px-3 py-2.5 type-small text-foreground transition-colors placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
