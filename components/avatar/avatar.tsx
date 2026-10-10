import Image from "next/image";
import { AVATAR_PATH, SITE_NAME } from "@/lib/constants/site";

/** The portrait: 88 px, 6 px radius, no border. It is never shown larger. */
const AvatarComponent = () => {
  return (
    <Image
      src={AVATAR_PATH}
      alt={SITE_NAME}
      width={88}
      height={88}
      className="size-[88px] shrink-0 rounded-photo object-cover"
      // `preload` is the Next.js 16 name of `priority`: the portrait is above the fold.
      preload
    />
  );
};

export default AvatarComponent;
