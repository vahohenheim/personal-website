import { LanguageId, LanguageLevel, type LanguageUser } from "@/lib/models/language";

export const USER_LANGUAGES: LanguageUser[] = [
  {
    id: LanguageId.FR,
    level: LanguageLevel.NATIVE,
  },
  {
    id: LanguageId.EN,
    level: LanguageLevel.PROFESSIONAL,
  },
  {
    id: LanguageId.ES,
    level: LanguageLevel.NOTION,
  },
];
