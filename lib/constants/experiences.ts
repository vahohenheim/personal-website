import { CompanyId } from "@/lib/models/company";
import { type Experience } from "@/lib/models/experience";
import { type Mission, MissionId } from "@/lib/models/mission";
import { RoleId } from "@/lib/models/role";
import { COMPANIES } from "./companies";

export const MISSIONS: Record<MissionId, Mission> = {
  [MissionId.SOLO_LEAD_FRONT_END]: {
    id: MissionId.SOLO_LEAD_FRONT_END,
    roles: [RoleId.FRONT_END_LEAD],
    startDate: "2025-04-01",
    endDate: "2026-10-01",
  },
  [MissionId.SOLO_ENGINEER_FRONT_END]: {
    id: MissionId.SOLO_ENGINEER_FRONT_END,
    roles: [RoleId.FRONT_END_ENGINEER],
    startDate: "2024-10-21",
    endDate: "2025-04-01",
  },
  [MissionId.EP_LEAD_FRONT_END]: {
    id: MissionId.EP_LEAD_FRONT_END,
    roles: [RoleId.FRONT_END_LEAD],
    startDate: "2023-09-01",
    endDate: "2024-09-01",
  },
  [MissionId.EP_ENGINEER_FRONT_END]: {
    id: MissionId.EP_ENGINEER_FRONT_END,
    roles: [RoleId.FRONT_END_ENGINEER],
    startDate: "2021-06-01",
    endDate: "2023-08-01",
  },
  [MissionId.CONSERTO_ENGINEER_FRONT_END]: {
    id: MissionId.CONSERTO_ENGINEER_FRONT_END,
    roles: [RoleId.FRONT_END_ENGINEER],
  },
  [MissionId.TROOPERS_ENGINEER_FRONT_END]: {
    id: MissionId.TROOPERS_ENGINEER_FRONT_END,
    roles: [RoleId.FRONT_END_DEVELOPER],
  },
  [MissionId.CONNEXING_FULL_STACK_DEVELOPER_UI_UX_DESIGNER]: {
    id: MissionId.CONNEXING_FULL_STACK_DEVELOPER_UI_UX_DESIGNER,
    roles: [RoleId.FULL_STACK_DEVELOPER, RoleId.UI_UX_DESIGNER],
  },
  [MissionId.NANTES_METROPOLE_TEACHER]: {
    id: MissionId.NANTES_METROPOLE_TEACHER,
    roles: [RoleId.TEACHER],
  },
  [MissionId.ANJOU_FULL_STACK_DEVELOPER]: {
    id: MissionId.ANJOU_FULL_STACK_DEVELOPER,
    roles: [RoleId.FULL_STACK_DEVELOPER],
  },
  [MissionId.DROUAULT_SOFTWARE_DEVELOPER_HELP_DESK]: {
    id: MissionId.DROUAULT_SOFTWARE_DEVELOPER_HELP_DESK,
    roles: [RoleId.SOFTWARE_DEVELOPER, RoleId.HELP_DESK],
  },
};

// Used by the structured data only: the texts shown on the pages are in locales/content/.
// Freelance since 2026-10: no current employer, so every experience below has an end date.
export const EXPERIENCES: Experience[] = [
  {
    company: COMPANIES[CompanyId.SOLO],
    startDate: "2024-10-21",
    endDate: "2026-10-01",
    missions: [
      MISSIONS[MissionId.SOLO_LEAD_FRONT_END],
      MISSIONS[MissionId.SOLO_ENGINEER_FRONT_END],
    ],
  },
  {
    company: COMPANIES[CompanyId.EP],
    startDate: "2021-06-01",
    endDate: "2024-09-01",
    missions: [MISSIONS[MissionId.EP_LEAD_FRONT_END], MISSIONS[MissionId.EP_ENGINEER_FRONT_END]],
  },
  {
    company: COMPANIES[CompanyId.CONSERTO],
    startDate: "2020-02-01",
    endDate: "2021-06-01",
    missions: [MISSIONS["conserto-engineer-front-end"]],
  },
  {
    company: COMPANIES[CompanyId.TROOPERS],
    startDate: "2018-06-01",
    endDate: "2020-01-01",
    missions: [MISSIONS["troopers-engineer-front-end"]],
  },
  {
    company: COMPANIES[CompanyId.NANTES_METROPOLE],
    startDate: "2018-05-01",
    endDate: "2018-09-01",
    missions: [MISSIONS["nantes-metropole-teacher"]],
  },
  {
    company: COMPANIES[CompanyId.CONNEXING],
    startDate: "2016-09-01",
    endDate: "2018-09-01",
    missions: [MISSIONS["connexing-full-stack-developer-ui-ux-designer"]],
  },
  {
    company: COMPANIES[CompanyId.ANJOU],
    startDate: "2015-09-01",
    endDate: "2016-09-01",
    missions: [MISSIONS["anjou-full-stack-developer"]],
  },
  {
    company: COMPANIES[CompanyId.DROUAULT],
    startDate: "2013-09-01",
    endDate: "2015-09-01",
    missions: [MISSIONS["drouault-software-developer-help-desk"]],
  },
];
