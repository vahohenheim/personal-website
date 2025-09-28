import { Company } from './company';
import { Mission } from './mission';

export type Experience = {
    company: Company;
    startDate: string;
    endDate: string;
    missions: Array<Mission>;
};
