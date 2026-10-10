import { getDictionary } from "@/lib/i18n/dictionaries";
import { type Company } from "@/lib/models/company";
import CompanyIconComponent from "../company-icon/company-icon";

const CompaniesComponent = async ({ companies }: { companies: Company[] }) => {
  const { companies: texts, a11y } = await getDictionary();

  return (
    <div className="w-full bg-muted dark:bg-muted/40">
      <ul className="flex w-full shrink-0 grow list-none items-center justify-start gap-12 overflow-x-auto p-8 lg:justify-center">
        {companies.map((company) => (
          <li key={company.id} className="shrink-0">
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              // The link only shows a logo: this is its name for screen readers.
              aria-label={`${texts.list[company.id].name} ${a11y.newTab}`}
            >
              <CompanyIconComponent company={company} className="fill-muted-foreground shrink-0" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompaniesComponent;
