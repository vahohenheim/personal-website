import { Badge } from "@/components/ui/badge";

/** The tags of a post, as mono chips in a 1 px frame. */
const PostTagsComponent = ({ tags, label }: { tags: string[]; label: string }) => {
  return (
    <ul aria-label={label} className="flex list-none flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag}>
          <Badge variant="secondary" className="rounded border border-line px-2 py-0.5">
            {tag}
          </Badge>
        </li>
      ))}
    </ul>
  );
};

export default PostTagsComponent;
