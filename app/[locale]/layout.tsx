import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import ContactDialogProvider from "@/components/contact/contact-dialog";
import HeaderComponent from "@/components/header/header";
import SkipLinkComponent from "@/components/skip-link/skip-link";
import ThemeProvider from "@/components/theme-provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { MAIL_ADDRESS } from "@/lib/constants/mail-address";
import { LOCALES } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { ErrorMessagesProvider } from "@/lib/i18n/error-messages";
import { cn } from "@/lib/utils/cn";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const dictionary = await getDictionary();

  return (
    <html
      lang={locale}
      className={cn(GeistSans.variable, GeistMono.variable)}
      // next-themes sets the theme class before hydration, to avoid a flash.
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SkipLinkComponent label={dictionary.a11y.skipToContent} />
          <HeaderComponent />
          {/* The contact dialog is mounted once; any contact button below opens it. */}
          <ContactDialogProvider locale={locale} email={MAIL_ADDRESS} texts={dictionary.contact}>
            {/* Each page renders its own footer: the home page and the resume differ. */}
            <ErrorMessagesProvider messages={dictionary.error}>{children}</ErrorMessagesProvider>
          </ContactDialogProvider>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
