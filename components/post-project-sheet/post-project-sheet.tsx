import { Card, CardContent, CardFooter } from "@/components/ui/card";
import StatusDotComponent from "../status-dot/status-dot";

type PostProjectSheetComponentProps = {
  rows: [label: string, value: string][];
  /** Current state of the project, marked by the accent dot. */
  status: string;
  link?: [label: string, href: string];
};

/** The project sheet of a post: mono labels, values, then the status and the link. */
const PostProjectSheetComponent = ({ rows, status, link }: PostProjectSheetComponentProps) => {
  return (
    <Card className="my-2 max-w-[68ch] gap-4 bg-surface p-6 font-mono text-[13px]">
      <CardContent>
        <dl className="flex flex-col gap-3 sm:gap-2">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col sm:grid sm:grid-cols-[minmax(88px,128px)_1fr] sm:gap-5"
            >
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-[13px]">
        <span className="flex items-center gap-2 text-foreground">
          <StatusDotComponent />
          {status}
        </span>
        {link && (
          <a href={link[1]} target="_blank" rel="noopener noreferrer">
            {link[0]} →
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostProjectSheetComponent;
