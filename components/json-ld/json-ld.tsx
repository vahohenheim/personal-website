import { type PageId } from "@/lib/constants/pages";
import { getPageJsonLd } from "@/lib/helpers/json-ld";

/** Structured data of a page. Render it once, at the top of the page component. */
const JsonLdComponent = async ({ page }: { page: PageId }) => {
  const jsonLd = await getPageJsonLd(page);

  return (
    <script
      type="application/ld+json"
      // "<" is escaped so that a text can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
};

export default JsonLdComponent;
