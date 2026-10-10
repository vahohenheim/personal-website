import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button/button";
import { HeadingComponent } from "@/components/ui/heading/heading";
import { HeadingTags } from "@/components/ui/heading/heading.model";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils/cn";
import { CoverAlignment, type CoverComponentProps } from "./cover.model";
import AppearComponent from "../appear/appear";
import SectionComponent from "../section/section";
import SocialNetworkComponent from "../social-network/social-network";

const CoverComponent = async ({
  ontitle,
  title,
  description,
  alignment = CoverAlignment.LEFT,
  action,
  socialNetworks = [],
  avatar,
}: CoverComponentProps) => {
  const { a11y } = await getDictionary();

  return (
    <SectionComponent>
      <div
        className={cn(
          "flex flex-col items-center justify-center text-center max-md:items-start max-md:text-left",
          {
            "items-start text-left": alignment === CoverAlignment.LEFT,
          },
        )}
      >
        {/* The portrait and the title are painted at once: fading them in delays the LCP. */}
        <Image
          className="mb-4 rounded-[10px]"
          src={avatar}
          alt={a11y.portrait}
          width={120}
          height={120}
          // Always above the fold and the largest element of the hero.
          loading="eager"
          fetchPriority="high"
        />
        {ontitle && (
          <p
            className="mb-0 text-xl text-foreground"
            dangerouslySetInnerHTML={{ __html: ontitle }}
          />
        )}
        <HeadingComponent tag={HeadingTags.H1} className="my-0">
          {title}
        </HeadingComponent>
        {description && (
          <AppearComponent>
            <p
              className="text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </AppearComponent>
        )}
        <AppearComponent delay={0.1}>
          <div className="mt-4 flex flex-row items-center gap-8 max-md:flex-col-reverse max-md:items-start max-md:gap-6">
            <div className="flex items-center gap-4">
              <Button asChild variant={action.variant ?? "default"}>
                <Link href={action.link}>{action.label}</Link>
              </Button>
            </div>
            <ul aria-label={a11y.socialNetworks} className="flex list-none items-center space-x-1">
              {socialNetworks.map((socialNetwork) => (
                <SocialNetworkComponent key={socialNetwork.type} socialNetwork={socialNetwork} />
              ))}
            </ul>
          </div>
        </AppearComponent>
      </div>
    </SectionComponent>
  );
};

export default CoverComponent;
