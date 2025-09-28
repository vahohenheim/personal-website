import { Experience } from "../../../../models/experience";

export interface ExperiencesComponentProps {
    lang: 'fr' | 'en';
    experiences: Array<Experience>;
}
