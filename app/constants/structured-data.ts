import { JsonLdAuthor, JsonLdAuthorType } from '../helpers/json-ld/json-ld.model';

export const PERSON_JSON_LD: JsonLdAuthor = {
    firstname: 'Valentin',
    lastname: 'Bourreau',
    avatar: 'https://avatars.githubusercontent.com/u/15048034?s=400&u=496078e2a68aaa3ea7e53c8eb2de313bed528b65&v=4',
    description:
        'Pationate by crafting static websites and web applications. Mainly work on React 18, Next.js 14 and Angular 17. A Javacript lover.',
    link: 'https://www.linkedin.com/in/valentin-bourreau/',
    job: 'Senior front-end engineer',
    type: JsonLdAuthorType.PERSON
};

export const PROFILE_PAGE_JSON_LD: { author: Array<JsonLdAuthor>; dateCreated: string; dateModified: string } = {
    author: [PERSON_JSON_LD],
    dateCreated: '2024-07-12',
    dateModified: '2024-07-12'
};
