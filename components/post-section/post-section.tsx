import { type ReactNode } from "react";
import NumberedSectionComponent from "@/components/numbered-section/numbered-section";
import { getSectionId } from "@/lib/helpers/posts";

type PostSectionComponentProps = {
  /** Number shown in the eyebrow, `01`. */
  n?: string;
  /** Word after the number, `contexte`. */
  label?: string;
  /** The `h2` of the section, and the entry of the summary. */
  title?: string;
  children: ReactNode;
};

/**
 * A numbered section of a post (`<Section n label title>` in MDX), drawn by the numbered
 * section shared with the legal pages, opened by a rule. Without a title, the continuation
 * of the previous section after a full-width figure.
 */
const PostSectionComponent = ({ n, label, title, children }: PostSectionComponentProps) => {
  if (!title) {
    return <div className="flex flex-col gap-5">{children}</div>;
  }

  return (
    <NumberedSectionComponent
      id={getSectionId(title)}
      number={n ?? ""}
      label={label}
      title={title}
      className="mt-10 border-t border-line pt-10"
    >
      {children}
    </NumberedSectionComponent>
  );
};

export default PostSectionComponent;
