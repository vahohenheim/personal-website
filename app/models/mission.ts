import { RoleId } from "./role";

export type Mission = {
  id: MissionId;
  startDate?: string;
  endDate?: string;
  roles: Array<RoleId>;
}

export enum MissionId {
  EP_LEAD_FRONT_END = 'ep-lead-front-end',
  EP_ENGINEER_FRONT_END = 'ep-engineer-front-end',
  CONSERTO_ENGINEER_FRONT_END = 'conserto-engineer-front-end',
  TROOPERS_ENGINEER_FRONT_END = 'troopers-engineer-front-end',
  CONNEXING_FULL_STACK_DEVELOPER_UI_UX_DESIGNER = 'connexing-full-stack-developer-ui-ux-designer',
  NANTES_METROPOLE_TEACHER = 'nantes-metropole-teacher',
  ANJOU_FULL_STACK_DEVELOPER = 'anjou-full-stack-developer',
  DROUAULT_SOFTWARE_DEVELOPER_HELP_DESK = 'drouault-software-developer-help-desk',
}
