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
