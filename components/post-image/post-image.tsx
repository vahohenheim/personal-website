import Image from "next/image";
import { resolvePostImage } from "@/lib/helpers/posts";
import { cn } from "@/lib/utils/cn";

export type PostImageProps = {
  /** Without extension: a pair `-jour.webp` / `-nuit.webp`. With one: a single image. */
  src: string;
  alt: string;
  /** Intrinsic size in CSS pixels (files are prepared at 2x). */
  width: number;
  height: number;
  /** `nuit` shows the night image of a pair whatever the theme. */
  mode?: "nuit";
  /** The first visual of a post: loaded at once, with high priority. */
  isHero?: boolean;
  className?: string;
};

/**
 * An image of a post. A pair renders both images and hides one with the `dark:` variant
 * (the `.dark` class set by next-themes before the first paint): no client code, no
 * flash. Served as prepared, without the optimizer, which may not read post images.
 */
const PostImageComponent = ({
  src,
  alt,
  width,
  height,
  mode,
  isHero = false,
  className,
}: PostImageProps) => {
  const image = resolvePostImage(src);
  const common = {
    width,
    height,
    unoptimized: true,
    ...(isHero
      ? { loading: "eager" as const, fetchPriority: "high" as const }
      : { loading: "lazy" as const }),
  };
  const classes = cn("block h-auto w-full", className);

  if (image.kind === "single") {
    return <Image src={image.src} alt={alt} className={classes} {...common} />;
  }

  if (mode === "nuit") {
    return <Image src={image.dark} alt={alt} className={classes} {...common} />;
  }

  return (
    <>
      <Image src={image.light} alt={alt} className={cn(classes, "dark:hidden")} {...common} />
      <Image src={image.dark} alt={alt} className={cn(classes, "hidden dark:block")} {...common} />
    </>
  );
};

export default PostImageComponent;
