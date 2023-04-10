import { Role } from '@data/enums';
export interface MenuItem {
  path: string;
  icon: string;
  svg ?:boolean;
  label: string;
  roles?: Role[];
}
