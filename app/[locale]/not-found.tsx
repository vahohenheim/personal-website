import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";

export default async function NotFound() {
  const locale = await getLocale();
  const { "not-found": notFound } = await getDictionary();

  return (
    <main
      id="main"
      className="container-page flex grow flex-col items-start gap-6 pt-[clamp(48px,8vw,112px)] pb-[clamp(56px,7vw,96px)]"
    >
      <p className="font-mono text-[13px] text-muted">404</p>
      <h1 className="text-[clamp(32px,4.4vw,48px)] leading-[1.05] font-semibold tracking-[-0.03em]">
        {notFound.title}
      </h1>
      <p className="max-w-[40em] text-text2">{notFound.description}</p>
      <Button asChild>
        <Link href={`/${locale}/`}>{notFound["back-to-homepage"]}</Link>
      </Button>
    </main>
  );
}
