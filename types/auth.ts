// types/auth.ts
export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  preferences: UserPreferences;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'fr';
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}