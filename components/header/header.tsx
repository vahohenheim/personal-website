import Link from "next/link";
import { getLanguageFallbacks, getPosts, getPostsPath } from "@/lib/helpers/posts";
import { LOCALES } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import HeaderNavComponent from "./header-nav";
import ThemeToggleComponent from "../theme-toggle/theme-toggle";

const HeaderComponent = async () => {
  const locale = await getLocale();
  const { header, a11y } = await getDictionary();
  const otherLocale = LOCALES.find((candidate) => candidate !== locale) ?? locale;

  return (
    <header className="container-page flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-6">
      <Link href={`/${locale}/`} className="logotype text-text no-underline">
        valentinbourreau
      </Link>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <HeaderNavComponent
          locale={locale}
          otherLocale={otherLocale}
          menuLabel={a11y.mainMenu}
          otherLocaleLabel={a11y.otherLanguage}
          languageFallbacks={getLanguageFallbacks(locale, otherLocale)}
          items={[
            { label: header.menu.resume, href: `/${locale}/resume/` },
            { label: header.menu.projects, href: `/${locale}/#projects` },
            // Shown once a post is published in this language.
            ...(getPosts(locale).length > 0
              ? [{ label: header.menu.posts, href: getPostsPath(locale) }]
              : []),
            { label: header.menu.contact, href: `/${locale}/#contact` },
          ]}
        />
        <ThemeToggleComponent label={a11y.toggleTheme} />
      </div>
    </header>
  );
};

export default HeaderComponent;
