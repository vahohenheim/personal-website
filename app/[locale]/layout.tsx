import '../globals.css';
import { MAIL_LINK, SOCIAL_NETWORKS } from '../constants/social-network';
import { cn } from '@/lib/utils/cn';
import { ReactNode } from 'react';
import { Geist } from 'next/font/google';
import ThemeProvider from '@/components/theme-provider/theme-provider';
import HeaderComponent from '@/components/header/header';
import FooterComponent from '@/components/footer/footer';
import { AnalyticsWrapper } from '@/components/analytics/analytics';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'fr' }];
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const validLocale = locale === 'fr' ? 'fr' : 'en';
    return (
        <html lang={validLocale} suppressHydrationWarning>
            <head>
                <meta content="width=device-width, initial-scale=1" name="viewport" />
            </head>
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased flex flex-col',
                    geistSans.className,
                    geistSans.variable
                )}
            >
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <HeaderComponent lang={validLocale} />
                    {children}
                    <FooterComponent socialNetworks={[MAIL_LINK, ...SOCIAL_NETWORKS]} />
                    <AnalyticsWrapper />
                </ThemeProvider>
            </body>
        </html>
    );
}
