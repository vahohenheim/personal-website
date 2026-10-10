/** First focusable element of the page: lets keyboard users jump over the header. */
const SkipLinkComponent = ({ label }: { label: string }) => {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:shadow"
    >
      {label}
    </a>
  );
};

export default SkipLinkComponent;
