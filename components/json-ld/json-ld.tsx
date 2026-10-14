import { type PageId } from "@/lib/constants/pages";
import { getPageJsonLd, getPostJsonLd } from "@/lib/helpers/json-ld";
import { type LocalizedPost } from "@/lib/models/post";

type JsonLdComponentProps = { page: PageId } | { post: LocalizedPost };

/** Structured data of a page or of a post. Render it once, at the top of the page component. */
const JsonLdComponent = async (props: JsonLdComponentProps) => {
  const jsonLd = "post" in props ? getPostJsonLd(props.post) : await getPageJsonLd(props.page);

  return (
    <script
      type="application/ld+json"
      // "<" is escaped so that a text can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
};

export default JsonLdComponent;
