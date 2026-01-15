export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export type LoginData = Pick<SignupData, 'email' | 'password'>;
