import Link from "next/link";
import { LinkComponentProps } from "./link.model";

export const LinkComponent = ({ href, emoji, children }: LinkComponentProps) => {
    return (
        <Link className="underline" href={href}>
            {emoji && <span>{emoji} </span>}
            {children}
        </Link>
    );
}
