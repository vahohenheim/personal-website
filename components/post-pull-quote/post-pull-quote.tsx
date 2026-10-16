import { type ReactNode } from "react";

/** A large quote, set apart by an accent rule. */
const PostPullQuoteComponent = ({ children }: { children: ReactNode }) => {
  return (
    <blockquote className="my-6 max-w-[30ch] border-l-2 border-accent pl-6 type-quote text-balance text-text [&_p]:text-text">
      {children}
    </blockquote>
  );
};

export default PostPullQuoteComponent;
