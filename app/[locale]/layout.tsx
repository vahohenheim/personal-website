import '../globals.css';
import { Geist } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { MAIL_LINK, SOCIAL_NETWORKS } from '@/lib/constants/social-network';
import { LOCALES } from '@/lib/i18n/config';
import { getDictionary, getLocale } from '@/lib/i18n/dictionaries';
import { ErrorMessagesProvider } from '@/lib/i18n/error-messages';
import { cn } from '@/lib/utils/cn';
import ThemeProvider from '@/components/theme-provider/theme-provider';
import HeaderComponent from '@/components/header/header';
import FooterComponent from '@/components/footer/footer';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

export function generateStaticParams() {
    return LOCALES.map(locale => ({ locale }));
}

export default async function RootLayout({ children }: LayoutProps<'/[locale]'>) {
    const locale = await getLocale();
    const dictionary = await getDictionary();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body
                className={cn(
                    'flex min-h-screen flex-col bg-background font-sans antialiased',
                    geistSans.className,
                    geistSans.variable
                )}
            >
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <HeaderComponent />
                    <ErrorMessagesProvider messages={dictionary.error}>{children}</ErrorMessagesProvider>
                    <FooterComponent socialNetworks={[MAIL_LINK, ...SOCIAL_NETWORKS]} />
                    <Analytics />
                </ThemeProvider>
            </body>
        </html>
    );
}
