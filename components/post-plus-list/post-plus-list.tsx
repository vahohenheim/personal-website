import { type ReactNode } from "react";

/** A list whose bullet is the `+` glyph. */
const PostPlusListComponent = ({ children }: { children: ReactNode }) => {
  return <ul className="flex max-w-[68ch] list-none flex-col gap-3">{children}</ul>;
};

/** One item: the title in bold, then the text, on the same line. */
export const PostPlusComponent = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <li className="flex gap-3">
      <span aria-hidden className="font-mono leading-[1.6] text-accent">
        +
      </span>
      <div className="text-text2 [&_p]:inline">
        <strong className="font-semibold text-text">{title}</strong> {children}
      </div>
    </li>
  );
};

export default PostPlusListComponent;
