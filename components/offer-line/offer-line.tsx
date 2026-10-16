import HeadingComponent from "@/components/heading/heading";

type OfferLineComponentProps = {
  title: string;
  summary: string;
  /** The starting price, already written: `dès 1 900 €`. */
  price: string;
};

/**
 * One service on one line, under a rule: the title, a short summary, the starting price in
 * mono on the right. On a phone, the price follows the title and the summary goes under.
 * The offer block of the home page is made of it. Written from scratch: shadcn has no
 * price list.
 */
const OfferLineComponent = ({ title, summary, price }: OfferLineComponentProps) => {
  return (
    <li className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-line py-5 last:border-b">
      <HeadingComponent level={3} className="flex-1 sm:max-w-[320px] sm:flex-[0_0_320px]">
        {title}
      </HeadingComponent>
      <p className="order-last basis-full type-small text-text2 sm:order-none sm:min-w-[240px] sm:flex-1 sm:basis-auto">
        {summary}
      </p>
      <p className="type-label whitespace-nowrap text-text tabular-nums">{price}</p>
    </li>
  );
};

export default OfferLineComponent;
