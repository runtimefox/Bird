export interface IUser {
  id: string;
  email: string;
  password: string;
  username: string;
  avatar?: string;
  name?: string;
  bio?: string;
  followers?: { followerId: string }[];
  following?: { followingId: string }[];
}
export type TypeUserResponse = Omit<IUser, 'password'>;
