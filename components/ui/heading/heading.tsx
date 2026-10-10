import React from "react";
import { cn } from "@/lib/utils/cn";
import { type HeadingComponentProps } from "./heading.model";

export const HeadingComponent = ({
  tag,
  className,
  apperance,
  children,
}: HeadingComponentProps) => {
  return React.createElement(tag, {
    className: cn(
      "w-full max-w-full px-[2px] py-[3px] font-bold break-words whitespace-pre-wrap",
      apperance,
      "mb-2",
      className,
    ),
    dangerouslySetInnerHTML: { __html: children },
  });
};
