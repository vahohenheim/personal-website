import { PROFILE_PAGE_JSON_LD } from "@/lib/constants/structured-data";
import { generateProfilePage } from "@/lib/helpers/json-ld/json-ld";

const JsonLdProfilePageComponent = () => {
  const profilePageJsonLd = generateProfilePage(
    PROFILE_PAGE_JSON_LD.author,
    PROFILE_PAGE_JSON_LD.dateCreated,
    PROFILE_PAGE_JSON_LD.dateModified,
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(profilePageJsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
};

export default JsonLdProfilePageComponent;
