import { UserRole } from 'src/common/enums/user-role.enum';

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
