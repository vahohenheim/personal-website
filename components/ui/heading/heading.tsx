import React from 'react';
import { HeadingComponentProps } from './heading.model';
import { cn } from '@/lib/utils/cn';

export const HeadingComponent = ({ tag, className, apperance, children }: HeadingComponentProps) => {
    return React.createElement(tag, {
        className: cn("max-w-full w-full whitespace-pre-wrap break-words py-[3px] px-[2px] font-bold", apperance, 'mb-2', className),
        dangerouslySetInnerHTML: { __html: children }
    });
};
