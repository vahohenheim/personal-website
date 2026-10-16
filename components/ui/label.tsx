"use client";

import { Label as LabelPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils/cn";

// shadcn/ui Label, restyled for the design charter: mono, lowercase, muted.
function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("type-label text-muted-foreground select-none", className)}
      {...props}
    />
  );
}

export { Label };
