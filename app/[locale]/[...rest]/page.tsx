import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** The title of the translated 404 page, which `not-found.tsx` cannot set on its own. */
export async function generateMetadata(): Promise<Metadata> {
  const { "not-found": notFound } = await getDictionary();

  return { title: notFound.metadata.title };
}

/** Sends every unknown URL under a locale to the translated `not-found.tsx`. */
export default function CatchAllPage() {
  notFound();
}
