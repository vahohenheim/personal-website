import SectionComponent from "@/components/section/section";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { type LanguageUser } from "@/lib/models/language";
import LanguageComponent from "../language/language";

const LanguagesComponent = async ({ languages }: { languages: LanguageUser[] }) => {
  const { languages: texts } = await getDictionary();

  return (
    <SectionComponent title={texts.title}>
      <div className="flex shrink-0 grow-0 flex-col items-start justify-start gap-4 self-stretch">
        {languages.map((language) => (
          <LanguageComponent key={language.id} language={language} />
        ))}
      </div>
    </SectionComponent>
  );
};

export default LanguagesComponent;
