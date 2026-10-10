import { type ReactNode } from "react";

export type HeadingComponentProps = {
  tag: HeadingTags;
  className?: string;
  apperance?: HeadingTags;
  children: ReactNode;
};

export enum HeadingTags {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
}
