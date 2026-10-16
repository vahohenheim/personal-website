import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils/cn";

// shadcn/ui Badge, restyled for the design charter: a mono label, with no pill around it.
const badgeVariants = cva("inline-flex items-center gap-1.5 type-meta whitespace-nowrap", {
  variants: {
    variant: {
      // Live: online, ongoing, current.
      default: "text-primary",
      // Over: archived.
      secondary: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
