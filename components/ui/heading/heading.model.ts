export type HeadingComponentProps = {
  tag: HeadingTags;
  className?: string;
  /** Renders the size of another heading level. */
  appearance?: HeadingTags;
  /** Text from the dictionaries. It may contain HTML, so never pass external data. */
  children: string;
};

export enum HeadingTags {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
}
