import React from "react";
import { cn } from "@/lib/utils/cn";
import { type HeadingComponentProps } from "./heading.model";

export const HeadingComponent = ({
  tag,
  className,
  appearance,
  children,
}: HeadingComponentProps) => {
  return React.createElement(tag, {
    className: cn(
      "w-full max-w-full px-[2px] py-[3px] font-bold break-words whitespace-pre-wrap",
      appearance,
      "mb-2",
      className,
    ),
    dangerouslySetInnerHTML: { __html: children },
  });
};
