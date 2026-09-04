export interface IUser {
  id: string;
  email: string;
  password: string;
  username: string;
  avatar?: string;
  name?: string;
  bio?: string;
  _count?: { followers: number; following: number };
  lastSeen?: string;
}
export type TypeUserResponse = Omit<IUser, 'password'>;

export interface IProfileForm {
  name: string;
  username: string;
  bio: string;
}
