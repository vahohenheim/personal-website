import Link from 'next/link';
import CompanyIconComponent from '../company-icon/company-icon';
import { Company } from '@/lib/models/company';

const CompanyComponent = ({ company }: { company: Company }) => {
    return (
        <Link href={company.url} target="_blank">
            <CompanyIconComponent
                company={company}
                className="shrink-0 cursor-pointer fill-gray-500 dark:fill-gray-400"
            />
        </Link>
    );
};

const CompaniesComponent = ({ companies = [] }: { companies: Array<Company> }) => {
    return (
        <div className="w-full bg-gray-100 dark:bg-gray-500/10">
            <div className="flex w-full shrink-0 grow items-center justify-start gap-12 overflow-y-scroll p-8 lg:justify-center">
                {companies.map(company => (
                    <CompanyComponent key={company.id} company={company} />
                ))}
            </div>
        </div>
    );
};

export default CompaniesComponent;
