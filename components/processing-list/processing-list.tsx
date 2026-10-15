import RichTextComponent from "@/components/rich-text/rich-text";
import { type ProcessingItem } from "@/lib/models/legal";

/**
 * The processing of personal data, one row each: its name in bold, how long data is kept
 * in mono, then what happens. A definition list: shadcn has no equivalent.
 */
const ProcessingListComponent = ({ items }: { items: ProcessingItem[] }) => {
  return (
    <dl className="my-1 border-t border-line">
      {items.map((item) => (
        <div
          key={item.title}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b border-line py-4"
        >
          <dt className="font-semibold text-text">{item.title}</dt>
          <dd className="font-mono text-[12px] text-muted">{item.retention}</dd>
          <dd className="mt-1 basis-full">
            <RichTextComponent text={item.text} />
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default ProcessingListComponent;
