import { type ReactNode } from "react";
import { getSectionId } from "@/lib/helpers/posts";

type PostSectionComponentProps = {
  /** Number shown in the label, `01`. */
  n?: string;
  /** Word after the number, `contexte`. */
  label?: string;
  /** The `h2` of the section, and the entry of the summary. */
  title?: string;
  children: ReactNode;
};

/**
 * A numbered section of a post (`01 · contexte`), whose title is an anchored `h2`. Without
 * a title, the continuation of the previous section after a full-width figure.
 */
const PostSectionComponent = ({ n, label, title, children }: PostSectionComponentProps) => {
  if (!title) {
    return <div className="flex flex-col gap-5">{children}</div>;
  }

  const id = getSectionId(title);
  const eyebrow = [n, label].filter(Boolean).join(" · ");

  return (
    <section aria-labelledby={id} className="mt-12 flex flex-col gap-5">
      {eyebrow && <p className="font-mono text-[13px] text-muted">{eyebrow}</p>}
      <h2
        id={id}
        className="-mt-3 max-w-[30ch] scroll-mt-8 text-[clamp(24px,2.6vw,30px)] leading-[1.2] font-semibold tracking-[-0.02em] text-text"
      >
        {title}
      </h2>
      {children}
    </section>
  );
};

export default PostSectionComponent;
