import { COMPANIES } from './companies';
import { CompanyId } from '../models/company';
import { Experience } from '../models/experience';
import { RoleId } from '../models/role';
import { Mission, MissionId } from '../models/mission';

export const MISSIONS: Record<MissionId, Mission> = {
    [MissionId.EP_LEAD_FRONT_END]: {
        id: MissionId.EP_LEAD_FRONT_END,
        roles: [RoleId.FRONT_END_LEAD],
        startDate: '2023-09-01',
        endDate: '2024-09-01'
    },
    [MissionId.EP_ENGINEER_FRONT_END]: {
        id: MissionId.EP_ENGINEER_FRONT_END,
        roles: [RoleId.FRONT_END_ENGINEER],
        startDate: '2021-06-01',
        endDate: '2023-08-01'
    },
    [MissionId.CONSERTO_ENGINEER_FRONT_END]: {
        id: MissionId.CONSERTO_ENGINEER_FRONT_END,
        roles: [RoleId.FRONT_END_ENGINEER]
    },
    [MissionId.TROOPERS_ENGINEER_FRONT_END]: {
        id: MissionId.TROOPERS_ENGINEER_FRONT_END,
        roles: [RoleId.FRONT_END_DEVELOPER]
    },
    [MissionId.CONNEXING_FULL_STACK_DEVELOPER_UI_UX_DESIGNER]: {
        id: MissionId.CONNEXING_FULL_STACK_DEVELOPER_UI_UX_DESIGNER,
        roles: [RoleId.FULL_STACK_DEVELOPER, RoleId.UI_UX_DESIGNER]
    },
    [MissionId.NANTES_METROPOLE_TEACHER]: {
        id: MissionId.NANTES_METROPOLE_TEACHER,
        roles: [RoleId.TEACHER]
    },
    [MissionId.ANJOU_FULL_STACK_DEVELOPER]: {
        id: MissionId.ANJOU_FULL_STACK_DEVELOPER,
        roles: [RoleId.FULL_STACK_DEVELOPER]
    },
    [MissionId.DROUAULT_SOFTWARE_DEVELOPER_HELP_DESK]: {
        id: MissionId.DROUAULT_SOFTWARE_DEVELOPER_HELP_DESK,
        roles: [RoleId.SOFTWARE_DEVELOPER, RoleId.HELP_DESK]
    }
};

export const EXPERIENCES: Array<Experience> = [
    {
        company: COMPANIES[CompanyId.EP],
        startDate: '2021-06-01',
        endDate: '2024-09-01',
        missions: [MISSIONS['ep-lead-front-end'], MISSIONS['ep-engineer-front-end']]
    },
    {
        company: COMPANIES[CompanyId.CONSERTO],
        startDate: '2020-02-01',
        endDate: '2021-06-01',
        missions: [MISSIONS['conserto-engineer-front-end']]
    },
    {
        company: COMPANIES[CompanyId.TROOPERS],
        startDate: '2018-06-01',
        endDate: '2020-01-01',
        missions: [MISSIONS['troopers-engineer-front-end']]
    },
    {
        company: COMPANIES[CompanyId.NANTES_METROPOLE],
        startDate: '2018-05-01',
        endDate: '2018-09-01',
        missions: [MISSIONS['nantes-metropole-teacher']]
    },
    {
        company: COMPANIES[CompanyId.CONNEXING],
        startDate: '2016-09-01',
        endDate: '2018-09-01',
        missions: [MISSIONS['connexing-full-stack-developer-ui-ux-designer']]
    },
    {
        company: COMPANIES[CompanyId.ANJOU],
        startDate: '2015-09-01',
        endDate: '2016-09-01',
        missions: [MISSIONS['anjou-full-stack-developer']]
    },
    {
        company: COMPANIES[CompanyId.DROUAULT],
        startDate: '2013-09-01',
        endDate: '2015-09-01',
        missions: [MISSIONS['drouault-software-developer-help-desk']]
    }
];
