import { JsonLd } from '@/app/helpers/json-ld/json-ld';
import { PROFILE_PAGE_JSON_LD } from '@/app/constants/structured-data';

const JsonLdProfilePageComponent = () => {
    const profilePageJsonLd = JsonLd.generateProfilePage(
        PROFILE_PAGE_JSON_LD.author,
        PROFILE_PAGE_JSON_LD.dateCreated,
        PROFILE_PAGE_JSON_LD.dateModified
    );

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(profilePageJsonLd)
            }}
        />
    );
};

export default JsonLdProfilePageComponent;
