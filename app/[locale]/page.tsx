import type { Metadata } from "next";
import Link from "next/link";
import AvatarComponent from "@/components/avatar/avatar";
import BreadcrumbComponent from "@/components/breadcrumb/breadcrumb";
import ChangelogEntryComponent from "@/components/changelog-entry/changelog-entry";
import ContactTriggerComponent from "@/components/contact/contact-trigger";
import JsonLdComponent from "@/components/json-ld/json-ld";
import ProfileCardComponent from "@/components/profile-card/profile-card";
import ProjectCardComponent from "@/components/project-card/project-card";
import SectionComponent, { SectionTitleComponent } from "@/components/section/section";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MAIL_ADDRESS } from "@/lib/constants/mail-address";
import { PROJECT_LINKS } from "@/lib/constants/project-links";
import { SITE_NAME } from "@/lib/constants/site";
import { SOCIAL_NETWORKS } from "@/lib/constants/social-network";
import { getPageMetadata } from "@/lib/helpers/metadata";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";

export const generateMetadata = (): Promise<Metadata> => getPageMetadata("home");

// Order of the footer links, as words rather than icons.
const FOOTER_NETWORKS = ["GitHub", "LinkedIn", "Dribbble", "Behance"];

export default async function HomePage() {
  const locale = await getLocale();
  const { home, a11y, footer, contact } = await getDictionary();
  const networks = FOOTER_NETWORKS.flatMap(
    (label) => SOCIAL_NETWORKS.find((network) => network.label === label) ?? [],
  );

  return (
    <>
      <main id="main" className="container-page">
        <JsonLdComponent page="home" />

        <section className="flex flex-col gap-8 pt-[clamp(48px,8vw,112px)] pb-[clamp(56px,7vw,96px)]">
          <div className="flex items-center gap-5">
            <AvatarComponent />
            <BreadcrumbComponent label={a11y.breadcrumb} />
          </div>
          <h1 className="text-[clamp(40px,6.4vw,76px)] leading-none font-semibold tracking-[-0.04em]">
            {home.title}
          </h1>
          <p className="max-w-[40em] text-[clamp(18px,1.6vw,21px)] leading-[1.5] text-text2">
            {home.lead}
          </p>
          <ProfileCardComponent rows={home.card} />
          <div className="flex flex-wrap gap-3">
            <ContactTriggerComponent
              href={`mailto:${MAIL_ADDRESS}`}
              variant="primary"
              sentText={contact.sent.text}
              againText={contact.sent.again}
            >
              {home.actions.contact}
            </ContactTriggerComponent>
            <Button asChild variant="secondary">
              <Link href={`/${locale}/resume/`}>{home.actions.resume}</Link>
            </Button>
          </div>
        </section>

        <SectionComponent className="flex flex-col gap-8">
          <SectionTitleComponent>{home.brings.title}</SectionTitleComponent>
          <p className="max-w-[30em] text-[clamp(22px,2.3vw,28px)] leading-[1.35] font-medium tracking-[-0.02em]">
            {home.brings.quote}
          </p>
          <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-px overflow-hidden rounded border border-line bg-line">
            {home.brings.items.map((item) => (
              <li key={item.title} className="bg-bg">
                <Card className="h-full gap-2 rounded-none border-0 p-6">
                  <p className="font-mono text-[12px] text-muted-foreground">{item.meta}</p>
                  <CardTitle asChild>
                    <h3 className="text-[20px] leading-[1.3] tracking-[-0.01em]">{item.title}</h3>
                  </CardTitle>
                  <CardDescription>{item.text}</CardDescription>
                </Card>
              </li>
            ))}
          </ul>
        </SectionComponent>

        <SectionComponent className="flex flex-col gap-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <SectionTitleComponent>{home.changelog.title}</SectionTitleComponent>
            <Link href={`/${locale}/resume/`} className="font-mono text-[13px]">
              {home.changelog.more}
            </Link>
          </div>
          <ol className="list-none">
            {home.changelog.entries.map((entry) => (
              <ChangelogEntryComponent key={entry.date} entry={entry} />
            ))}
          </ol>
        </SectionComponent>

        <SectionComponent id="projects" className="flex flex-col gap-6">
          <SectionTitleComponent>{home.projects.title}</SectionTitleComponent>
          <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
            {home.projects.items.map((project) => (
              <ProjectCardComponent
                key={project.id}
                project={project}
                href={PROJECT_LINKS[project.id]}
                statusLabels={home.projects.status}
              />
            ))}
          </ul>
          <p className="flex flex-wrap gap-x-2 font-mono text-[13px] text-muted">
            <span>{home.projects.more}</span>
            {home.projects.moreItems.map((project, index) => (
              <span key={project.id}>
                <a
                  href={PROJECT_LINKS[project.id]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent"
                >
                  {project.name}
                </a>
                {index < home.projects.moreItems.length - 1 && ","}
              </span>
            ))}
          </p>
        </SectionComponent>
      </main>

      <footer id="contact" className="container-page">
        <Separator />
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-8 pt-10 pb-12">
          <div className="flex flex-col gap-6">
            <SectionTitleComponent>{home.contact.title}</SectionTitleComponent>
            <ContactTriggerComponent
              href={`mailto:${MAIL_ADDRESS}`}
              variant="link"
              sentText={contact.sent.text}
              againText={contact.sent.again}
            >
              {home.contact.cta}
            </ContactTriggerComponent>
            <ul className="flex list-none flex-wrap gap-x-5 gap-y-2 font-mono text-[13px]">
              {networks.map((network) => (
                <li key={network.type}>
                  <a href={network.link} target="_blank" rel="noopener noreferrer">
                    {network.label.toLowerCase()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12px] text-muted">
            <span>
              © {new Date().getFullYear()} {SITE_NAME}
            </span>
            <Link href={`/${locale}/legal/`} className="text-muted no-underline hover:text-accent">
              {footer.legal}
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}
