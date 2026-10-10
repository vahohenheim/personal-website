import { School, SchoolId } from '@/lib/models/school';
import { Qualification, QualificationId, QualificationLevel } from '@/lib/models/qualification';

export const SCHOOLS: Record<SchoolId, School> = {
    [SchoolId.IMIE]: {
        id: SchoolId.IMIE,
        location: 'Nantes, Pays de la Loire, France'
    },
    [SchoolId.NANTES_UNIVERSITY]: {
        id: SchoolId.NANTES_UNIVERSITY,
        location: 'Nantes, Pays de la Loire, France'
    }
};

export const QUALIFICATIONS: Array<Qualification> = [
    {
        id: QualificationId.PROJECT_MANAGER_IN_IT,
        obtainDate: '2019-09-01',
        level: QualificationLevel.RNCP_LEVEL_I,
        school: SCHOOLS[SchoolId.IMIE]
    },
    {
        id: QualificationId.ANALYST_AND_WEBDEVELOPER,
        obtainDate: '2018-09-01',
        level: QualificationLevel.RNCP_LEVEL_II,
        school: SCHOOLS[SchoolId.IMIE]
    },
    {
        id: QualificationId.PRODUCT_DESIGNER,
        obtainDate: '2018-09-01',
        level: QualificationLevel.RNCP_LEVEL_II,
        school: SCHOOLS[SchoolId.IMIE]
    },
    {
        id: QualificationId.SOFTWARE_DEVELOPER,
        obtainDate: '2017-09-01',
        level: QualificationLevel.UNIVERSITY_DEGREE,
        school: SCHOOLS[SchoolId.NANTES_UNIVERSITY]
    }
];
