import { Company, CompanyId } from '../models/company';

export const COMPANIES: Record<CompanyId, Company> = {
    [CompanyId.EP]: {
        id: CompanyId.EP,
        url: 'https://ep.fr',
        name: 'EP',
        location: 'Nantes, Pays de la Loire, France'
    },
    [CompanyId.CONSERTO]: {
        id: CompanyId.CONSERTO,
        url: 'https://conserto.pro/',
        name: 'Conserto',
        location: 'Nantes, Pays de la Loire, France'
    },
    [CompanyId.TROOPERS]: {
        id: CompanyId.TROOPERS,
        url: 'https://www.troopers.coop/',
        name: 'Troopers',
        location: 'Nantes, Pays de la Loire, France'
    },
    [CompanyId.NANTES_METROPOLE]: {
        id: CompanyId.NANTES_METROPOLE,
        url: 'https://metropole.nantes.fr/',
        name: 'Nantes Métropole',
        location: 'Nantes, Pays de la Loire, France'
    },
    [CompanyId.CONNEXING]: {
        id: CompanyId.CONNEXING,
        url: 'https://www.connexing.fr/',
        name: 'Connexing',
        location: 'Nantes, Pays de la Loire, France'
    },
    [CompanyId.ANJOU]: {
        id: CompanyId.ANJOU,
        url: 'https://www.maine-et-loire.fr/',
        name: 'Anjou',
        location: 'Angers, Pays de la Loire, France'
    },
    [CompanyId.DROUAULT]: {
        id: CompanyId.DROUAULT,
        url: 'https://www.drouault.net/',
        name: 'Drouault',
        location: 'Le Mans, Pays de la Loire, France'
    }
};
