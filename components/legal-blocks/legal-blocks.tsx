import HeadingComponent from "@/components/heading/heading";
import KeyValueComponent from "@/components/key-value/key-value";
import ProcessingListComponent from "@/components/processing-list/processing-list";
import RichTextComponent from "@/components/rich-text/rich-text";
import { type IdentityRow, type LegalBlock } from "@/lib/models/legal";

/** Identity rows as key / value rows: values may hold a link, written in Markdown. */
export const toKeyValueRows = (rows: IdentityRow[]) =>
  rows.map((row) => ({ key: row.key, value: <RichTextComponent text={row.value} /> }));

/** A stable key for a block: its text, or the anchor of a subsection. */
const keyOf = (block: LegalBlock) => {
  switch (block.type) {
    case "p":
      return block.text;
    case "ol":
    case "ul":
      return block.items.join();
    case "identity":
      return block.rows.map((row) => row.key).join();
    case "processing":
      return block.items.map((item) => item.title).join();
    case "subsection":
      return block.id;
  }
};

const LegalBlockComponent = ({ block }: { block: LegalBlock }) => {
  switch (block.type) {
    case "p":
      return (
        <p>
          <RichTextComponent text={block.text} />
        </p>
      );
    case "ol":
    case "ul": {
      const List = block.type;

      return (
        <List
          className={
            block.type === "ol"
              ? "flex list-decimal flex-col gap-1 pl-[22px] marker:text-muted"
              : "flex list-disc flex-col gap-1 pl-5 marker:text-muted"
          }
        >
          {block.items.map((item) => (
            <li key={item}>
              <RichTextComponent text={item} />
            </li>
          ))}
        </List>
      );
    }
    case "identity":
      return <KeyValueComponent rows={toKeyValueRows(block.rows)} className="mt-1" />;
    case "processing":
      return <ProcessingListComponent items={block.items} />;
    case "subsection":
      return (
        <>
          <HeadingComponent level={3} id={block.id} className="mt-2">
            <span className="type-label font-normal text-muted">{block.number}</span> {block.title}
          </HeadingComponent>
          <LegalBlocksComponent blocks={block.blocks} />
        </>
      );
  }
};

/** The body of a section of a legal document: paragraphs, lists, cards and subsections. */
const LegalBlocksComponent = ({ blocks }: { blocks: LegalBlock[] }) => {
  return (
    <>
      {blocks.map((block) => (
        <LegalBlockComponent key={keyOf(block)} block={block} />
      ))}
    </>
  );
};

export default LegalBlocksComponent;
