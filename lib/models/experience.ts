import { type Company } from "./company";
import { type Mission } from "./mission";

/** Calendar date written `YYYY-MM-DD`. */
export type IsoDate = `${number}-${number}-${number}`;

export type Experience = {
  company: Company;
  startDate: IsoDate;
  /** `'today'` marks the current position. */
  endDate: IsoDate | "today";
  missions: Mission[];
};
