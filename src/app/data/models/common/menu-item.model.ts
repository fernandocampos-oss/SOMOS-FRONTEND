import { Role } from '@data/enums';
export interface MenuItem {
  path?: string;
  icon?: string;
  svg ?:boolean;
  label: string;
  roles?: Role[];
  children?: MenuItem[];
  type?:number; //type "2" = Boton para abrir en un PopUp ; type "3" = Sub Menu ; type "4" = Filtrado
  background?:string;
}
