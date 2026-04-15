import type { IUser } from './user.type';

export interface ISignInForm {
  email: string;
  password: string;
}
export interface ISignUpForm {
  email: string;
  password: string;
  username: string;
  avatar?: string;
  name?: string;
}

export interface IAuthResponse {
  access_token: string;
  user: IUser;
}
export interface IAuthError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export type TypeUserForm = Omit<IUser, 'id' | 'password'> & { password: string };
