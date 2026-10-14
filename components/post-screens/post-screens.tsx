import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import PostFigureComponent from "../post-figure/post-figure";
import PostImageComponent from "../post-image/post-image";

// Phone screenshots are prepared at 780 × 1688: a 390 × 844 screen at 2x.
const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 844;

type PostScreenComponentProps = {
  src: string;
  alt: string;
  mode?: "nuit";
  /** Set by `<Screens variant="hero">`, not written in the MDX. */
  isHero?: boolean;
};

/** One phone screen, in a 1 px frame. */
export const PostScreenComponent = ({ src, alt, mode, isHero }: PostScreenComponentProps) => {
  return (
    <div className="max-w-[240px] min-w-[140px] flex-[1_1_160px] overflow-hidden rounded border border-line bg-surface">
      <PostImageComponent
        src={src}
        alt={alt}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        mode={mode}
        isHero={isHero}
      />
    </div>
  );
};

type PostScreensComponentProps = {
  caption: string;
  variant?: "hero";
  children: ReactNode;
};

/** A row of phone screens, wrapping on small screens, with one caption. */
const PostScreensComponent = ({ caption, variant, children }: PostScreensComponentProps) => {
  const isHero = variant === "hero";

  return (
    <PostFigureComponent caption={caption}>
      <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
        {Children.map(children, (child) =>
          isValidElement(child)
            ? cloneElement(child as ReactElement<PostScreenComponentProps>, { isHero })
            : child,
        )}
      </div>
    </PostFigureComponent>
  );
};

export default PostScreensComponent;
