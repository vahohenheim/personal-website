import { School } from "./school";

export interface Qualification {
    id: QualificationId;
    obtainDate: string;
    level: QualificationLevel;
    school: School;
}

export enum QualificationId {
  PROJECT_MANAGER_IN_IT = 'project-manager-in-it',
  ANALYST_AND_WEBDEVELOPER = 'analyst-and-webdeveloper',
  PRODUCT_DESIGNER = 'product-designer',
  SOFTWARE_DEVELOPER = 'software-developer'
}

export enum QualificationLevel {
  RNCP_LEVEL_I = 'rncp-level-i',
  RNCP_LEVEL_II = 'rncp-level-ii',
  UNIVERSITY_DEGREE = 'university-degree'
}
