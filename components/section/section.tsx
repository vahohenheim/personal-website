import { type ReactNode } from "react";
import { HeadingComponent } from "@/components/ui/heading/heading";
import { HeadingTags } from "@/components/ui/heading/heading.model";

const SectionComponent = ({ title, children }: { title?: string; children: ReactNode }) => {
  return (
    <section className="container mx-auto my-20 w-full max-w-[900px] md:my-36">
      {title && (
        <div className="mx-auto w-full max-w-[900px]">
          <HeadingComponent tag={HeadingTags.H2} className="mb-6">
            {title}
          </HeadingComponent>
        </div>
      )}
      {children}
    </section>
  );
};

export default SectionComponent;
