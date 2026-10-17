import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type AdminPage = "leads" | "traffic" | "design-system";

// The admin is in French only, and its texts live in its code (see app/admin/labels.ts).
const ITEMS: { id: AdminPage; label: string; href: string }[] = [
  { id: "leads", label: "demandes", href: "/admin/" },
  { id: "traffic", label: "fréquentation", href: "/admin/frequentation/" },
  { id: "design-system", label: "design system", href: "/admin/design-system/" },
];

type AdminHeaderComponentProps = {
  current: AdminPage;
  /** An action on the right, such as the CSV export. */
  action?: ReactNode;
};

/**
 * Header of the admin pages: the logotype, the admin menu in mono (the page being read in
 * the accent colour), then an optional action. It wraps on small screens, like the header
 * of the public pages.
 */
const AdminHeaderComponent = ({ current, action }: AdminHeaderComponentProps) => {
  return (
    <header className="container-page flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-6">
      <span className="logotype">valentinbourreau</span>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <nav aria-label="Menu de l’admin">
          <ul className="flex list-none flex-wrap items-center gap-x-5 gap-y-2 type-label">
            {ITEMS.map((item) => {
              const isCurrent = item.id === current;

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center no-underline hover:text-accent",
                      isCurrent ? "text-accent" : "text-text",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {action}
      </div>
    </header>
  );
};

export default AdminHeaderComponent;
