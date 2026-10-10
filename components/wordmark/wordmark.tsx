import { SITE_NAME } from "@/lib/constants/site";

const [GIVEN_NAME, FAMILY_NAME] = SITE_NAME.toLowerCase().split(" ");

/** The site's signature: the name with a contrast of weights, shortened to initials on small screens. */
const WordmarkComponent = () => {
  return (
    <span className="text-lg leading-none tracking-tight">
      <span className="sr-only">{SITE_NAME}</span>
      <span aria-hidden className="sm:hidden">
        <span className="font-bold">{GIVEN_NAME[0]}</span>
        <span className="font-light">{FAMILY_NAME[0]}</span>
      </span>
      <span aria-hidden className="max-sm:hidden">
        <span className="font-bold">{GIVEN_NAME}</span>{" "}
        <span className="font-light">{FAMILY_NAME}</span>
      </span>
    </span>
  );
};

export default WordmarkComponent;
