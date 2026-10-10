import { JsonLd } from '@/lib/helpers/json-ld/json-ld';
import { PERSON_JSON_LD } from '@/lib/constants/structured-data';

const JsonLdPortfolioComponent = () => {
    const portfolioJsonLd = JsonLd.generatePortfolio({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: 'Portfolio',
        creator: JsonLd.generateAuthor(PERSON_JSON_LD),
        workExample: []
    });

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(portfolioJsonLd).replace(/</g, '\\u003c')
            }}
        />
    );
};

export default JsonLdPortfolioComponent;
