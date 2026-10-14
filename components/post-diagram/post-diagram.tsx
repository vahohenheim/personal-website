import PostFigureComponent from "../post-figure/post-figure";
import PostImageComponent from "../post-image/post-image";

type PostDiagramComponentProps = {
  /** Always a pair, without extension: the diagram is drawn for each theme. */
  src: string;
  /** Describes the whole diagram. */
  alt: string;
  width: number;
  height: number;
  caption: string;
  variant?: "hero";
};

/** A diagram, on the surface colour, with its caption. */
const PostDiagramComponent = ({
  src,
  alt,
  width,
  height,
  caption,
  variant,
}: PostDiagramComponentProps) => {
  return (
    <PostFigureComponent caption={caption}>
      <div className="overflow-hidden rounded border border-line">
        <PostImageComponent
          src={src}
          alt={alt}
          width={width}
          height={height}
          isHero={variant === "hero"}
        />
      </div>
    </PostFigureComponent>
  );
};

export default PostDiagramComponent;
