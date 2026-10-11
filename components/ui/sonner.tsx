"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

// shadcn/ui Sonner, restyled for the design charter: surface block, 1 px rule, 2 px
// radius, no shadow, no icon. Every error of the site is reported through `toast`.
const NO_ICON = <span hidden />;

const Toaster = (props: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      className="toaster group"
      icons={{ success: NO_ICON, info: NO_ICON, warning: NO_ICON, error: NO_ICON }}
      toastOptions={{
        style: {
          boxShadow: "none",
          fontFamily: "var(--font-sans)",
          fontSize: "15px",
        },
      }}
      style={
        {
          "--normal-bg": "var(--surface)",
          "--normal-text": "var(--text)",
          "--normal-border": "var(--line)",
          "--border-radius": "2px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
