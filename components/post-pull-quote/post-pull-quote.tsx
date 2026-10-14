import { type ReactNode } from "react";

/** A large quote, set apart by an accent rule. */
const PostPullQuoteComponent = ({ children }: { children: ReactNode }) => {
  return (
    <blockquote className="my-6 max-w-[30ch] border-l-2 border-accent pl-6 text-[clamp(22px,2.6vw,30px)] leading-[1.3] font-medium tracking-[-0.02em] text-balance text-text [&_p]:text-text">
      {children}
    </blockquote>
  );
};

export default PostPullQuoteComponent;
