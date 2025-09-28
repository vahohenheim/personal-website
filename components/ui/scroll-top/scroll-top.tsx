'use client';

import { useFixScrollTopInNavigation } from "./scroll-top.hook";

/**
 * Fix NextJs bug who persist scroll height when navigate 
 */
export const ScrollTopComponent = () => {
    useFixScrollTopInNavigation();
    return <></>;
}