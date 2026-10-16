import { cn } from "@/lib/utils/cn";

type PostDefinitionsComponentProps = {
  items: [term: string, text: string][];
  /** The term above its text, for long terms. */
  stacked?: boolean;
};

/** A definition list: the term in mono, on the left or above its text. */
const PostDefinitionsComponent = ({ items, stacked = false }: PostDefinitionsComponentProps) => {
  return (
    <dl className="flex max-w-[68ch] flex-col border-t border-line">
      {items.map(([term, text]) => (
        <div
          key={term}
          className={cn(
            "flex flex-col gap-1 border-b border-line py-4",
            !stacked && "sm:grid sm:grid-cols-[minmax(96px,144px)_1fr] sm:gap-5",
          )}
        >
          <dt className={cn("pt-0.5 type-label", stacked ? "text-text" : "text-muted")}>{term}</dt>
          <dd className="text-text2">{text}</dd>
        </div>
      ))}
    </dl>
  );
};

export default PostDefinitionsComponent;
