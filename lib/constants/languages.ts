import { type Language, LanguageId, LanguageLevel, type LanguageUser } from "@/lib/models/language";

export const LANGUAGES: Record<LanguageId, Language> = {
  [LanguageId.FR]: {
    icon: "🇫🇷",
    id: LanguageId.FR,
  },
  [LanguageId.EN]: {
    icon: "🇬🇧",
    id: LanguageId.EN,
  },
  [LanguageId.ES]: {
    icon: "🇪🇸",
    id: LanguageId.ES,
  },
};

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
