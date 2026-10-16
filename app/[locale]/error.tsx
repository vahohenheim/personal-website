"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import HeadingComponent from "@/components/heading/heading";
import { Button } from "@/components/ui/button";
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
      className="container-page flex grow flex-col items-start gap-6 pt-[clamp(48px,8vw,112px)] pb-[clamp(56px,7vw,96px)]"
    >
      <HeadingComponent level={1} className="max-w-[20ch]">
        {messages.title}
      </HeadingComponent>
      <p className="max-w-[40em] text-text2">
        {before}
        {linkLabel && (
          <Link href={SOCIAL_NETWORK_LINKS[SocialNetworkType.LINKEDIN]}>{linkLabel}</Link>
        )}
        {after}
      </p>
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => {
            retry();
          }}
        >
          {messages.retry}
        </Button>
        <Button asChild variant="secondary">
          <Link href={`/${locale}/`}>{messages["back-to-homepage"]}</Link>
        </Button>
      </div>
    </main>
  );
}
