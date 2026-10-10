import { type CSSProperties, type ReactNode } from "react";

type AppearComponentProps = {
  children: ReactNode;
  /** Seconds before the entrance starts. Keep it short: the content is hidden meanwhile. */
  delay?: number;
  /** Reveal when the block scrolls into view instead of on page load. */
  onScroll?: boolean;
};

/**
 * Entrance animation, in CSS only (see `.appear` in globals.css): the content is in the
 * HTML and visible without JavaScript, and nothing moves under `prefers-reduced-motion`.
 */
const AppearComponent = ({ children, delay = 0, onScroll = false }: AppearComponentProps) => {
  return (
    <div
      className={onScroll ? "appear-on-scroll" : "appear"}
      style={{ "--appear-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
};

export default AppearComponent;
