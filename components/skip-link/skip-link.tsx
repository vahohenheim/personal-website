/** First focusable element of the page: lets keyboard users jump over the header. */
const SkipLinkComponent = ({ label }: { label: string }) => {
  return (
    <a
      href="#main"
      className="sr-only type-small focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:border focus:border-line focus:bg-bg focus:px-4 focus:py-2"
    >
      {label}
    </a>
  );
};

export default SkipLinkComponent;
