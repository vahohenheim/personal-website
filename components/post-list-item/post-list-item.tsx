import Link from "next/link";

type PostListItemComponentProps = {
  href: string;
  date: string;
  dateTime: string;
  title: string;
  description: string;
};

/** One post of the home page, in the grammar of the changelog: date, title, one line. */
const PostListItemComponent = ({
  href,
  date,
  dateTime,
  title,
  description,
}: PostListItemComponentProps) => {
  return (
    <li className="flex flex-wrap gap-x-8 gap-y-2 border-t border-line py-6">
      <time
        dateTime={dateTime}
        className="flex-[0_0_160px] font-mono text-[13px] leading-[1.9] whitespace-nowrap text-muted"
      >
        {date}
      </time>
      <div className="flex min-w-[min(100%,280px)] flex-1 flex-col gap-2">
        <h3 className="text-[19px] leading-[1.3] font-semibold tracking-[-0.01em]">
          <Link href={href} className="text-text no-underline hover:text-accent">
            {title}
          </Link>
        </h3>
        <p className="max-w-[64ch] text-text2">{description}</p>
      </div>
    </li>
  );
};

export default PostListItemComponent;
