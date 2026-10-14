import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type PostFigureComponentProps = {
  caption?: string;
  className?: string;
  children: ReactNode;
};

/** A figure of a post: the visual, then its caption in the muted colour. */
const PostFigureComponent = ({ caption, className, children }: PostFigureComponentProps) => {
  return (
    <figure className={cn("my-4 flex min-w-0 flex-col gap-3", className)}>
      {children}
      {caption && (
        <figcaption className="max-w-[68ch] text-[14px] leading-[1.5] text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default PostFigureComponent;
