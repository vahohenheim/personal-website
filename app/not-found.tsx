import './globals.css';
import Link from 'next/link';
import { SearchX } from 'lucide-react';
import localFont from 'next/font/local';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button/button';
import type { Metadata } from 'next';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900'
});

export const metadata: Metadata = {
    title: '404 - Page not found',
    description: 'Page not found'
};

const NotFound = () => {
    return (
        <body
            className={cn('min-h-screen bg-background font-sans antialiased', geistSans.variable, geistSans.className)}
        >
            <main className="container">
                <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-md text-center">
                        <SearchX size={48} className="mx-auto mb-4" />
                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Oops, page not found!
                        </h1>
                        <p className="mt-4 text-muted-foreground">
                            The page you&#39;re looking for doesn&#39;t exist. It might have been moved or deleted.
                        </p>
                        <div className="mt-6">
                            <Link href={'/'} scroll={true}>
                                <Button variant="default">go to homepage</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </body>
    );
};

export default NotFound;
