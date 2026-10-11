import * as React from "react";
import { cn } from "@/lib/utils/cn";

// shadcn/ui Input, restyled for the design charter: 44 px high, 1 px rule, 2 px radius.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded border border-input bg-background px-3 text-[15px] text-foreground transition-colors placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
