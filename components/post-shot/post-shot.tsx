import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import PostFigureComponent from "../post-figure/post-figure";
import PostImageComponent from "../post-image/post-image";

type PostShotComponentProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  variant?: "hero";
  /** Set by `<Shots>`: the shot is part of a group and has no caption of its own. */
  isGrouped?: boolean;
};

/** One large screenshot in a 1 px frame, with a caption. */
export const PostShotComponent = ({
  src,
  alt,
  width,
  height,
  caption,
  variant,
  isGrouped = false,
}: PostShotComponentProps) => {
  const frame = (
    <div className="overflow-hidden rounded border border-line bg-surface">
      <PostImageComponent
        src={src}
        alt={alt}
        width={width}
        height={height}
        isHero={variant === "hero"}
      />
    </div>
  );

  return isGrouped ? frame : <PostFigureComponent caption={caption}>{frame}</PostFigureComponent>;
};

type PostShotsComponentProps = { caption: string; children: ReactNode };

/** Two shots side by side on wide screens, stacked below 768 px, one shared caption. */
const PostShotsComponent = ({ caption, children }: PostShotsComponentProps) => {
  return (
    <PostFigureComponent caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        {Children.map(children, (child) =>
          isValidElement(child)
            ? cloneElement(child as ReactElement<PostShotComponentProps>, { isGrouped: true })
            : child,
        )}
      </div>
    </PostFigureComponent>
  );
};

export default PostShotsComponent;
