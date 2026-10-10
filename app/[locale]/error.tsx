"use client";

import { CircleX } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button/button";
import { SOCIAL_NETWORK_LINKS } from "@/lib/constants/social-network";
import { DEFAULT_LOCALE, hasLocale } from "@/lib/i18n/config";
import { useErrorMessages } from "@/lib/i18n/error-messages";
import { SocialNetworkType } from "@/lib/models/social-network";

const FALLBACK_MESSAGES = {
  title: "Oops, an error occurred!",
  description:
    "Please try again later or contact me directly by <1>linkedin</1> if the issue persists.",
  retry: "try again",
  "back-to-homepage": "back to homepage",
};

export default function Error({ retry }: { error: Error; retry: () => void }) {
  const params = useParams<{ locale?: string }>();
  const locale = hasLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  const messages = useErrorMessages() ?? FALLBACK_MESSAGES;
  // The description marks the LinkedIn link with <1>…</1>.
  const [before, linkLabel, after] = messages.description.split(/<\/?1>/);

  return (
    <main
      id="main"
      className="container mx-auto flex h-full grow flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-md text-center">
        <CircleX size={48} className="mx-auto mb-4" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {messages.title}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {before}
          {linkLabel && (
            <Link href={SOCIAL_NETWORK_LINKS[SocialNetworkType.LINKEDIN]}>{linkLabel}</Link>
          )}
          {after}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            onClick={() => {
              retry();
            }}
          >
            {messages.retry}
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}/`}>{messages["back-to-homepage"]}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
