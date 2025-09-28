export type LanguageUser = {
  id: LanguageId;
  level: LanguageLevel;
};

export type Language = {
	icon: string;
	id: LanguageId;
};

export enum LanguageLevel {
	NATIVE = "native",
	PROGRESSION = "progression",
	NOTION = "notion"
}

export enum LanguageId {
	EN = "en",
	FR = "fr",
  ES = "es",
}
