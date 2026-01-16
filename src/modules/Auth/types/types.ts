export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export type LoginData = Pick<SignupData, 'email' | 'password'>;

export interface AnalystResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginContext {
  userAgent?: string;
  ipAddress?: string;
}

export interface ActiveSession {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
  expiresAt: Date;
}
