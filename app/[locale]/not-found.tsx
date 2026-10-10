import { SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button/button";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";

export default async function NotFound() {
  const locale = await getLocale();
  const { "not-found": notFound } = await getDictionary();

  return (
    <main
      id="main"
      className="bg-background container mx-auto flex h-full grow flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-md text-center">
        <SearchX size={48} className="mx-auto mb-4" />
        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          {notFound.title}
        </h1>
        <p className="text-muted-foreground mt-4">{notFound.description}</p>
        <div className="mt-6">
          <Button asChild>
            <Link href={`/${locale}/`}>{notFound["back-to-homepage"]}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
