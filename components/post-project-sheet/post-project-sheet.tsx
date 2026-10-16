import KeyValueComponent from "@/components/key-value/key-value";
import StatusDotComponent from "@/components/status-dot/status-dot";

type PostProjectSheetComponentProps = {
  rows: [label: string, value: string][];
  /** Current state of the project, marked by the accent dot. */
  status: string;
  link?: [label: string, href: string];
};

/**
 * The project sheet of a post (`<ProjectSheet>` in MDX): the key / value sheet of the site,
 * with the status and the link of the project under a rule.
 */
const PostProjectSheetComponent = ({ rows, status, link }: PostProjectSheetComponentProps) => {
  return (
    <KeyValueComponent
      className="my-2 max-w-[68ch]"
      rows={rows.map(([key, value]) => ({ key, value }))}
      footer={
        <>
          <span className="flex items-center gap-2">
            <StatusDotComponent />
            {status}
          </span>
          {link && (
            <a href={link[1]} target="_blank" rel="noopener noreferrer">
              {link[0]} →
            </a>
          )}
        </>
      }
    />
  );
};

export default PostProjectSheetComponent;
