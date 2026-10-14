import { type TableOfContentsEntry } from "@/lib/helpers/posts";

type PostTocComponentProps = { title: string; entries: TableOfContentsEntry[] };

/** The summary of a post: one link per numbered section, to its anchor. */
const PostTocComponent = ({ title, entries }: PostTocComponentProps) => {
  return (
    <nav aria-label={title} className="flex flex-col gap-3 font-mono text-[13px]">
      <p className="text-muted">{title}</p>
      <ol className="flex list-none flex-col gap-2 border-l border-line pl-4">
        {entries.map((entry) => (
          <li key={entry.id} className="flex gap-2">
            <span aria-hidden className="text-muted">
              {entry.n}
            </span>
            <a href={`#${entry.id}`} className="text-text2 no-underline hover:text-accent">
              {entry.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default PostTocComponent;
