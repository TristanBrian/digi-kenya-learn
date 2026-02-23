import type { AuthUser } from './user.types';

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

