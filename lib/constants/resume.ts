import { type JsonLdAuthor, JsonLdAuthorType } from "@/lib/helpers/json-ld/json-ld.model";
import { type Expertise, ExpertiseId } from "@/lib/models/expertise";
import { SITE_URL } from "./site";

export const AUTHOR: JsonLdAuthor = {
  avatar: "",
  firstname: "Valentin",
  lastname: "Bourreau",
  type: JsonLdAuthorType.PERSON,
  link: SITE_URL,
  job: "Front-end Engineer",
  description:
    "Numerical resume version. Introduce personal expertises, experiences and qualifications",
};

export const EXPERTISES: Expertise[] = [
  {
    id: ExpertiseId.ENGINEER_DEVELOPER,
  },
  {
    id: ExpertiseId.LEAD_TECH_TEAM,
  },
  {
    id: ExpertiseId.UX_CONCEPTION,
  },
];
