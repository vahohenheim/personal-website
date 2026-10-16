import Link from "next/link";
import HeadingComponent from "@/components/heading/heading";
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
      <p className="type-label text-muted">404</p>
      <HeadingComponent level={1} className="max-w-[20ch]">
        {notFound.title}
      </HeadingComponent>
      <p className="max-w-[40em] text-text2">{notFound.description}</p>
      <Button asChild>
        <Link href={`/${locale}/`}>{notFound["back-to-homepage"]}</Link>
      </Button>
    </main>
  );
}
