import { SITE_URL } from './site';
import { Expertise, ExpertiseId } from '@/lib/models/expertise';
import { JsonLdAuthor, JsonLdAuthorType } from '@/lib/helpers/json-ld/json-ld.model';

export const AUTHOR: JsonLdAuthor = {
    avatar: '',
    firstname: 'Valentin',
    lastname: 'Bourreau',
    type: JsonLdAuthorType.PERSON,
    link: SITE_URL,
    job: 'Front-end Engineer',
    description: 'Numerical resume version. Introduce personal expertises, experiences and qualifications'
};

export const EXPERTISES: Array<Expertise> = [
    {
        id: ExpertiseId.ENGINEER_DEVELOPER
    },
    {
        id: ExpertiseId.LEAD_TECH_TEAM
    },
    {
        id: ExpertiseId.UX_CONCEPTION
    }
];
