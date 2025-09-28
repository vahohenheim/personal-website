import { Expertise, ExpertiseId } from '../models/expertise';
import { JsonLdAuthor, JsonLdAuthorType } from '../helpers/json-ld/json-ld.model';

export const AUTHOR: JsonLdAuthor = {
    avatar: '',
    firstname: 'Valentin',
    lastname: 'Bourreau',
    type: JsonLdAuthorType.PERSON,
    link: 'https://valentinbourreau.com',
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
