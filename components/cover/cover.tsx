import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button/button";
import { HeadingComponent } from "@/components/ui/heading/heading";
import { HeadingTags } from "@/components/ui/heading/heading.model";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu/navigation-menu";
import { cn } from "@/lib/utils/cn";
import { CoverAlignment, type CoverComponentProps } from "./cover.model";
import AppearComponent from "../appear/appear";
import SectionComponent from "../section/section";
import SocialNetworkComponent from "../social-network/social-network";

const CoverComponent = ({
  ontitle,
  title,
  description,
  alignment = CoverAlignment.LEFT,
  action,
  socialNetworks = [],
  avatar,
}: CoverComponentProps) => {
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
        <AppearComponent>
          <Image
            className="mb-4 rounded-[10px]"
            src={avatar}
            alt="valentin bourreau picture"
            width={120}
            height={120}
            // Always above the fold and the largest element of the hero.
            loading="eager"
            fetchPriority="high"
          />
        </AppearComponent>
        {ontitle && (
          <AppearComponent delay={0.05}>
            <p
              className="mb-0 text-xl text-foreground"
              dangerouslySetInnerHTML={{ __html: ontitle }}
            />
          </AppearComponent>
        )}
        <AppearComponent delay={0.1}>
          <HeadingComponent tag={HeadingTags.H1} className="my-0">
            {title}
          </HeadingComponent>
        </AppearComponent>
        {description && (
          <AppearComponent delay={0.15}>
            <p
              className="text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: description as string }}
            />
          </AppearComponent>
        )}
        <AppearComponent delay={0.2}>
          <div className="mt-4 flex flex-row items-center gap-8 max-md:flex-col-reverse max-md:items-start max-md:gap-6">
            <div className="flex items-center gap-4">
              <Button asChild variant={action.variant ?? "default"}>
                <Link href={action.link}>{action.label}</Link>
              </Button>
            </div>
            <NavigationMenu>
              <NavigationMenuList>
                {socialNetworks.map((socialNetwork) => (
                  <SocialNetworkComponent key={socialNetwork.type} socialNetwork={socialNetwork} />
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </AppearComponent>
      </div>
    </SectionComponent>
  );
};

export default CoverComponent;
