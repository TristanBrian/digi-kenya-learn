export type UserRole = 'STUDENT' | 'LECTURER' | 'REGISTRAR' | 'FINANCE_OFFICER' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

