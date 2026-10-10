import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Geist } from "next/font/google";
import FooterComponent from "@/components/footer/footer";
import HeaderComponent from "@/components/header/header";
import SkipLinkComponent from "@/components/skip-link/skip-link";
import ThemeProvider from "@/components/theme-provider/theme-provider";
import { MAIL_LINK, SOCIAL_NETWORKS } from "@/lib/constants/social-network";
import { LOCALES } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { ErrorMessagesProvider } from "@/lib/i18n/error-messages";
import { cn } from "@/lib/utils/cn";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const dictionary = await getDictionary();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "flex min-h-screen flex-col bg-background font-sans antialiased",
          geistSans.className,
          geistSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SkipLinkComponent label={dictionary.a11y.skipToContent} />
          <HeaderComponent />
          <ErrorMessagesProvider messages={dictionary.error}>{children}</ErrorMessagesProvider>
          <FooterComponent socialNetworks={[MAIL_LINK, ...SOCIAL_NETWORKS]} />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
