'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu/dropdown-menu';
import { Button } from '@/components/ui/button/button';
import { cn } from '@/lib/utils/cn';

const LanguageToggle = ({ defaultLanguage = 'en' }: { defaultLanguage?: 'en' | 'fr' }) => {
    const router = useRouter();
    const pathname = usePathname();

    const navigateToLanguage = (locale: 'en' | 'fr') => {
        if (defaultLanguage !== locale) {
            const nextPath = pathname.replace(`/${defaultLanguage}`, `/${locale}`);
            router.push(nextPath);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <p className={cn('size-[1.2rem] scale-0 transition-all', defaultLanguage === 'en' && 'scale-100')}>
                        🇺🇸
                    </p>
                    <p
                        className={cn(
                            'absolute size-[1.2rem] scale-0 transition-all',
                            defaultLanguage === 'fr' && 'scale-100'
                        )}
                    >
                        🇫🇷
                    </p>
                    <span className="sr-only">Toggle Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigateToLanguage('en')}>🇺🇸 English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigateToLanguage('fr')}>🇫🇷 Français</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageToggle;
