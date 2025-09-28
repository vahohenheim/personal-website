import { PersonalProject, PersonalProjectId, PersonalProjectStatus } from '../models/personal-project';

export const PERSONAL_PROJECTS: Array<PersonalProject> = [
    {
        id: PersonalProjectId.BLOOM,
        status: PersonalProjectStatus.ACTIVE,
        icon: '🌷',
        link: 'https://github.com/vahohenheim/bloom'
    },
    {
        id: PersonalProjectId.EDITORIALS,
        status: PersonalProjectStatus.ARCHIVED,
        icon: '📚',
        link: 'https://github.com/vahohenheim/editorials'
    },
    {
        id: PersonalProjectId.NOTION_BLOG,
        status: PersonalProjectStatus.ARCHIVED,
        icon: '📦',
        link: 'https://github.com/vahohenheim/notion-blog'
    },
    {
        id: PersonalProjectId.FINANCE,
        status: PersonalProjectStatus.ARCHIVED,
        icon: '🏛️',
        link: 'https://github.com/vahohenheim/personal-finance'
    }
];
