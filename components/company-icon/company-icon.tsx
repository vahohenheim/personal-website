import { type ComponentType } from "react";
import { type Company, CompanyId } from "@/lib/models/company";
import AnjouIcon from "../icons/companies/anjou";
import ConnexingIcon from "../icons/companies/connexing";
import ConsertoIcon from "../icons/companies/conserto";
import DrouaultIcon from "../icons/companies/drouault";
import EpIcon from "../icons/companies/ep";
import NantesMetropoleIcon from "../icons/companies/nantes-metropole";
import SoloIcon from "../icons/companies/solo";
import TroopersIcon from "../icons/companies/troopers";
import { type IconProps } from "../icons/icon.model";

const COMPANY_ICONS: Record<CompanyId, ComponentType<IconProps>> = {
  [CompanyId.SOLO]: SoloIcon,
  [CompanyId.EP]: EpIcon,
  [CompanyId.CONSERTO]: ConsertoIcon,
  [CompanyId.TROOPERS]: TroopersIcon,
  [CompanyId.CONNEXING]: ConnexingIcon,
  [CompanyId.NANTES_METROPOLE]: NantesMetropoleIcon,
  [CompanyId.ANJOU]: AnjouIcon,
  [CompanyId.DROUAULT]: DrouaultIcon,
};

type CompanyIconComponentProps = IconProps & { company: Company };

const CompanyIconComponent = ({ company, ...iconProps }: CompanyIconComponentProps) => {
  const Icon = COMPANY_ICONS[company.id];

  return <Icon {...iconProps} />;
};

export default CompanyIconComponent;
