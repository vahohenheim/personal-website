import Link from "next/link";
import { type ReactNode } from "react";
import { parseRichText, type RichTextToken } from "@/lib/helpers/rich-text";
import { type RichText } from "@/lib/models/legal";

/**
 * One mark of a legal text. Written from scratch: shadcn has no component for inline text.
 * Pages of the site go through `next/link`; anchors, files and `mailto:` are plain links.
 */
const renderToken = (token: RichTextToken, key: string): ReactNode => {
  switch (token.type) {
    case "link":
      return token.href.startsWith("/") ? (
        <Link key={key} href={token.href}>
          {token.text}
        </Link>
      ) : (
        <a key={key} href={token.href}>
          {token.text}
        </a>
      );
    case "strong":
      return (
        <strong key={key} className="font-semibold text-text">
          {token.text}
        </strong>
      );
    case "code":
      return (
        <code key={key} className="font-mono text-[0.9em] text-text">
          {token.text}
        </code>
      );
    case "text":
      return token.text;
  }
};

/** A text of `locales/legal/` with its links, strong words and names. */
const RichTextComponent = ({ text }: { text: RichText }) => {
  const tokens = parseRichText(text);
  // The position of a mark in the text is a stable key: the text never changes at runtime.
  const offsets = tokens.map((_, position) =>
    tokens.slice(0, position).reduce((sum, token) => sum + token.text.length, 0),
  );

  return <>{tokens.map((token, position) => renderToken(token, `${offsets[position]}`))}</>;
};

export default RichTextComponent;
