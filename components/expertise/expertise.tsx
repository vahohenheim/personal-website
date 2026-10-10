import { HeadingComponent } from "@/components/ui/heading/heading";
import { HeadingTags } from "@/components/ui/heading/heading.model";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { type ExpertiseComponentProps } from "./expertise.model";

export const Expertise = async ({ expertise }: ExpertiseComponentProps) => {
  const { expertises } = await getDictionary();
  const texts = expertises.list[expertise.id];

  return (
    <div>
      <p
        className="text-base font-semibold text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: texts.label }}
      />
      <HeadingComponent tag={HeadingTags.H2} appearance={HeadingTags.H3} className="mb-0">
        {texts.title}
      </HeadingComponent>
      <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: texts.text }} />
    </div>
  );
};
