import type { MDXComponents } from "mdx/types";

/**
 * How the elements of a post (content/posts/) are drawn. Required by @next/mdx.
 * Posts start at `##`: the title of the page is the only `h1`.
 */
const components: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2
      className="mt-6 text-[24px] leading-[1.25] font-semibold tracking-[-0.02em] text-text"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="mt-2 text-[19px] leading-[1.3] font-semibold tracking-[-0.01em] text-text"
      {...props}
    >
      {children}
    </h3>
  ),
  p: (props) => <p className="text-text2" {...props} />,
  ul: (props) => <ul className="flex list-disc flex-col gap-2 pl-5 text-text2" {...props} />,
  ol: (props) => <ol className="flex list-decimal flex-col gap-2 pl-5 text-text2" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l border-accent pl-5 text-[20px] leading-[1.4] font-medium tracking-[-0.01em] text-text [&>p]:text-text"
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
