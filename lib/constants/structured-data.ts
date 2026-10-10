import { type JsonLdAuthor, JsonLdAuthorType } from "@/lib/helpers/json-ld/json-ld.model";
import { AVATAR_URL } from "./site";

export const PERSON_JSON_LD: JsonLdAuthor = {
  firstname: "Valentin",
  lastname: "Bourreau",
  avatar: AVATAR_URL,
  description:
    "Passionate about crafting static websites and web applications. Mainly works with React 19, Next.js 16 and Angular 17. A JavaScript lover.",
  link: "https://www.linkedin.com/in/valentin-bourreau/",
  job: "Senior front-end engineer",
  type: JsonLdAuthorType.PERSON,
};

export const PROFILE_PAGE_JSON_LD: {
  author: JsonLdAuthor[];
  dateCreated: string;
  dateModified: string;
} = {
  author: [PERSON_JSON_LD],
  dateCreated: "2024-07-12",
  dateModified: "2026-10-10",
};
