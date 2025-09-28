import { ReactNode } from "react";

export interface LinkComponentProps {
    href: string;
    emoji?: string;
    children: ReactNode;
}