import type { MDXComponents } from "mdx/types";
import PostCalloutComponent from "@/components/post-callout/post-callout";
import PostDecisionTableComponent from "@/components/post-decision-table/post-decision-table";
import PostDefinitionsComponent from "@/components/post-definitions/post-definitions";
import PostDiagramComponent from "@/components/post-diagram/post-diagram";
import PostPlusListComponent, {
  PostPlusComponent,
} from "@/components/post-plus-list/post-plus-list";
import PostProjectSheetComponent from "@/components/post-project-sheet/post-project-sheet";
import PostPullQuoteComponent from "@/components/post-pull-quote/post-pull-quote";
import PostScreensComponent, { PostScreenComponent } from "@/components/post-screens/post-screens";
import PostSectionComponent from "@/components/post-section/post-section";
import PostShotsComponent, { PostShotComponent } from "@/components/post-shot/post-shot";
import PostStatsComponent from "@/components/post-stats/post-stats";

/**
 * Components a post may use, by the name the MDX gives them. Their props are documented
 * in docs/features/posts.md#mdx-components. A test fails when an MDX file uses a name
 * missing here.
 */
export const POST_COMPONENTS = {
  Screens: PostScreensComponent,
  Screen: PostScreenComponent,
  Shot: PostShotComponent,
  Shots: PostShotsComponent,
  Diagram: PostDiagramComponent,
  ProjectSheet: PostProjectSheetComponent,
  Section: PostSectionComponent,
  PlusList: PostPlusListComponent,
  Plus: PostPlusComponent,
  Definitions: PostDefinitionsComponent,
  Callout: PostCalloutComponent,
  DecisionTable: PostDecisionTableComponent,
  PullQuote: PostPullQuoteComponent,
  Stats: PostStatsComponent,
} satisfies MDXComponents;

/**
 * How the elements of a post (content/posts/) are drawn. Required by @next/mdx.
 * Posts start at `##`: the title of the page is the only `h1`. Text stays in a column of
 * 68 characters; figures may be wider.
 */
const components: MDXComponents = {
  ...POST_COMPONENTS,
  h2: ({ children, ...props }) => (
    <h2
      className="mt-6 max-w-[68ch] text-[24px] leading-[1.25] font-semibold tracking-[-0.02em] text-text"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="mt-4 max-w-[68ch] text-[19px] leading-[1.3] font-semibold tracking-[-0.01em] text-text"
      {...props}
    >
      {children}
    </h3>
  ),
  p: (props) => <p className="max-w-[68ch] text-text2" {...props} />,
  ul: (props) => (
    <ul className="flex max-w-[68ch] list-disc flex-col gap-2 pl-5 text-text2" {...props} />
  ),
  ol: (props) => (
    <ol className="flex max-w-[68ch] list-decimal flex-col gap-2 pl-5 text-text2" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="max-w-[60ch] border-l border-accent pl-5 text-[20px] leading-[1.4] font-medium tracking-[-0.01em] text-text [&>p]:text-text"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="overflow-x-auto rounded border border-line bg-surface p-5 font-mono text-[13px] leading-[1.6] text-text [&>code]:bg-transparent [&>code]:p-0"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-surface px-1.5 py-0.5 font-mono text-[0.85em] text-text"
      {...props}
    />
  ),
  hr: () => <hr className="my-2 border-line" />,
  strong: (props) => <strong className="font-semibold text-text" {...props} />,
};

export const useMDXComponents = (): MDXComponents => components;
