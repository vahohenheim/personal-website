import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { type FooterComponentProps } from "./footer.model";
import SocialNetworkComponent from "../social-network/social-network";

const FooterComponent = async ({ socialNetworks }: FooterComponentProps) => {
  const locale = await getLocale();
  const { footer, a11y } = await getDictionary();

  return (
    <footer className="container-mobile">
      <div className="mx-auto flex max-w-[900px] flex-col justify-between gap-2 py-2 sm:flex-row-reverse sm:items-center">
        {socialNetworks.length > 0 && (
          <ul aria-label={a11y.socialNetworks} className="flex list-none items-center space-x-1">
            {socialNetworks.map((socialNetwork) => (
              <SocialNetworkComponent key={socialNetwork.type} socialNetwork={socialNetwork} />
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:gap-4">
          <span>{footer.copyright.replace("{year}", String(new Date().getFullYear()))}</span>
          <Link className="underline-offset-4 hover:underline" href={`/${locale}/legal/`}>
            {footer.legal}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
