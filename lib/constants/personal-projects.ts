import { PersonalProject, PersonalProjectId, PersonalProjectStatus } from '@/lib/models/personal-project';

export const PERSONAL_PROJECTS: Array<PersonalProject> = [
    {
        id: PersonalProjectId.BRUT,
        status: PersonalProjectStatus.ACTIVE,
        icon: '🚚',
        link: 'https://www.mangezbrut.fr'
    },
    {
        id: PersonalProjectId.BLOOM,
        status: PersonalProjectStatus.ACTIVE,
        icon: '🌷'
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
