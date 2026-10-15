import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils/cn";

export type LegalPage = "legal" | "cgv";

/**
 * The two legal links of every footer: "mentions légales · cgv". The link of the page
 * being read takes the accent and `aria-current`.
 */
const LegalLinksComponent = async ({ current }: { current?: LegalPage }) => {
  const locale = await getLocale();
  const { footer } = await getDictionary();
  const links = [
    { id: "legal", href: `/${locale}/legal/`, label: footer.legal },
    { id: "cgv", href: `/${locale}/cgv/`, label: footer.cgv },
  ] as const;

  return (
    <ul className="flex list-none flex-wrap gap-x-5 gap-y-1">
      {links.map((link) => (
        <li key={link.id}>
          <Link
            href={link.href}
            aria-current={link.id === current ? "page" : undefined}
            className={cn(
              "no-underline hover:text-accent",
              link.id === current ? "text-accent" : "text-muted",
            )}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default LegalLinksComponent;
