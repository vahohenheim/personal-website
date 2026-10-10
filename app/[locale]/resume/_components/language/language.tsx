import { getDictionary } from "@/lib/i18n/dictionaries";
import { type LanguageUser } from "@/lib/models/language";

const LanguageComponent = async ({ language }: { language: LanguageUser }) => {
  const { languages } = await getDictionary();

  return (
    <div className="flex shrink-0 grow-0 flex-col items-start justify-start gap-4 self-stretch rounded-lg">
      <div className="flex shrink-0 grow-0 flex-col items-start justify-start gap-2 self-stretch">
        <div className="relative flex shrink-0 grow-0 flex-col items-start justify-start gap-0.5 self-stretch">
          <p className="text-2xl font-bold">{languages.list[language.id].name}</p>
          <p className="text-secondary-foreground">{languages.level[language.level].name}</p>
        </div>
      </div>
    </div>
  );
};

export default LanguageComponent;
