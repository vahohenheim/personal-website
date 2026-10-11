import "../globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { type ReactNode } from "react";
import ThemeProvider from "@/components/theme-provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "admin | valentinbourreau",
  robots: { index: false, follow: false },
};

/**
 * Root layout of the admin area. It sits outside `[locale]`: the admin is in French only
 * and shares nothing with the public pages but the design tokens.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={cn(GeistSans.variable, GeistMono.variable)} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
