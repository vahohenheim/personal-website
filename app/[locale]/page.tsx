import type { Metadata } from "next";
import Link from "next/link";
import ChangelogEntryComponent from "@/components/changelog-entry/changelog-entry";
import ContactTriggerComponent from "@/components/contact/contact-trigger";
import HeadingComponent from "@/components/heading/heading";
import JsonLdComponent from "@/components/json-ld/json-ld";
import KeyValueComponent from "@/components/key-value/key-value";
import LogEntryComponent from "@/components/log-entry/log-entry";
import PageHeaderComponent from "@/components/page-header/page-header";
import ProjectCardComponent from "@/components/project-card/project-card";
import SectionComponent, { SectionTitleComponent } from "@/components/section/section";
import SiteFooterComponent from "@/components/site-footer/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import { MAIL_ADDRESS } from "@/lib/constants/mail-address";
import { PROJECT_LINKS } from "@/lib/constants/project-links";
import { SOCIAL_NETWORKS } from "@/lib/constants/social-network";
import { getPageMetadata } from "@/lib/helpers/metadata";
import {
  formatPostDate,
  getPostForProject,
  getHomePosts,
  getPostPath,
  getPostsPath,
} from "@/lib/helpers/posts";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";

export const generateMetadata = (): Promise<Metadata> => getPageMetadata("home");

// Order of the footer links, as words rather than icons.

const FOOTER_NETWORKS = ["GitHub", "LinkedIn", "Dribbble", "Behance"];

export default async function HomePage() {
  const locale = await getLocale();
  const { home, a11y, contact, posts } = await getDictionary();
  const latestPosts = getHomePosts(locale);
  // The "read the post" link of a project card, when a post about the project is listed.
  const getProjectPost = (id: string) => {
    const post = getPostForProject(id, locale);

    return post && { href: getPostPath(post.slug, locale), label: posts.readPost };
  };
  const networks = FOOTER_NETWORKS.flatMap(
    (label) => SOCIAL_NETWORKS.find((network) => network.label === label) ?? [],
  );

  return (
    <>
      <main id="main" className="container-page">
        <JsonLdComponent page="home" />

        <PageHeaderComponent
          breadcrumb={{ label: a11y.breadcrumb }}
          avatar
          title={home.title}
          lead={home.lead}
        >
          <KeyValueComponent rows={home.card} />
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
        </PageHeaderComponent>

        <SectionComponent className="flex flex-col gap-8">
          <SectionTitleComponent>{home.brings.title}</SectionTitleComponent>
          <p className="max-w-[30em] type-quote">{home.brings.quote}</p>
          <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-px overflow-hidden rounded border border-line bg-line">
            {home.brings.items.map((item) => (
              <li key={item.title} className="bg-bg">
                <Card className="h-full gap-2 rounded-none border-0 p-6">
                  <p className="type-meta text-muted-foreground">{item.meta}</p>
                  <HeadingComponent level={3}>{item.title}</HeadingComponent>
                  <CardDescription>{item.text}</CardDescription>
                </Card>
              </li>
            ))}
          </ul>
        </SectionComponent>

        <SectionComponent className="flex flex-col gap-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <SectionTitleComponent>{home.changelog.title}</SectionTitleComponent>
            <Link href={`/${locale}/resume/`} className="type-label">
              {home.changelog.more}
            </Link>
          </div>
          <ol className="list-none">
            {home.changelog.entries.map((entry) => (
              <ChangelogEntryComponent key={entry.date} entry={entry} />
            ))}
          </ol>
        </SectionComponent>

        {/* Only once a post is published in this language. */}
        {latestPosts.length > 0 && (
          <SectionComponent id="posts" className="flex flex-col gap-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <SectionTitleComponent>{posts.home.title}</SectionTitleComponent>
              <Link href={getPostsPath(locale)} className="type-label">
                {posts.home.all}
              </Link>
            </div>
            <ol className="list-none">
              {latestPosts.map((post) => (
                <LogEntryComponent
                  key={post.slug}
                  date={
                    <time dateTime={post.publishedAt}>
                      {formatPostDate(post.publishedAt, locale)}
                    </time>
                  }
                  title={
                    <Link
                      href={getPostPath(post.slug, locale)}
                      className="text-text no-underline hover:text-accent"
                    >
                      {post.title}
                    </Link>
                  }
                >
                  <p className="max-w-[64ch] text-text2">{post.description}</p>
                </LogEntryComponent>
              ))}
            </ol>
          </SectionComponent>
        )}

        <SectionComponent id="projects" className="flex flex-col gap-6">
          <SectionTitleComponent>{home.projects.title}</SectionTitleComponent>
          <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
            {home.projects.items.map((project) => (
              <ProjectCardComponent
                key={project.id}
                project={project}
                href={PROJECT_LINKS[project.id]}
                statusLabels={home.projects.status}
                post={getProjectPost(project.id)}
              />
            ))}
          </ul>
          <p className="flex flex-wrap gap-x-2 type-label text-muted">
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

        <SectionComponent id="contact" className="flex flex-col gap-6">
          <SectionTitleComponent>{home.contact.title}</SectionTitleComponent>
          <ContactTriggerComponent
            href={`mailto:${MAIL_ADDRESS}`}
            variant="link"
            sentText={contact.sent.text}
            againText={contact.sent.again}
          >
            {home.contact.cta}
          </ContactTriggerComponent>
          <ul className="flex list-none flex-wrap gap-x-5 gap-y-2 type-label">
            {networks.map((network) => (
              <li key={network.type}>
                <a href={network.link} target="_blank" rel="noopener noreferrer">
                  {network.label.toLowerCase()}
                </a>
              </li>
            ))}
          </ul>
        </SectionComponent>
      </main>
      <SiteFooterComponent home />
    </>
  );
}
