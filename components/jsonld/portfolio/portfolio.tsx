import { PERSON_JSON_LD } from "@/lib/constants/structured-data";
import { generateAuthor, generatePortfolio } from "@/lib/helpers/json-ld/json-ld";

const JsonLdPortfolioComponent = () => {
  const portfolioJsonLd = generatePortfolio({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Portfolio",
    creator: generateAuthor(PERSON_JSON_LD),
    workExample: [],
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(portfolioJsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
};

export default JsonLdPortfolioComponent;
