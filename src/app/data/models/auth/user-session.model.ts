import { Role } from '../../enums/role.enum';
export interface UserSession {
  id: number;
  nombres: string;
  idRol: Role;
}
