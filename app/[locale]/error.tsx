'use client';

import Link from 'next/link';
import { SOCIAL_NETWORK_LINKS } from '../constants/social-network';
import { SocialNetworkType } from '../models/social-network';
import { CircleX } from 'lucide-react';
import { Button } from '@/components/ui/button/button';

const Error = () => {
    return (
        <main className="container flex h-full grow flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
                <CircleX size={48} className="mx-auto mb-4" />
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Oops, something went wrong!
                </h1>
                <p className="mt-4 text-muted-foreground">
                    We&apos;re sorry, but there seems to be a problem on our end. Please try again later or contact me
                    directly by <Link href={SOCIAL_NETWORK_LINKS[SocialNetworkType.LINKEDIN]}>linkedin</Link> if the
                    issue persists.
                </p>
                <div className="mt-6">
                    <Link href={'/'} scroll={true}>
                        <Button>go to homepage</Button>
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Error;

export const metadata = {
    title: '404 - Page not found',
    description: 'Page not found'
};
