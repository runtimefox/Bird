export interface IFollowUser {
  id: string;
  name: string | null;
  username: string;
  avatar: string | null;
}

export interface IFollow {
  id: string;
  followerId: string;
  followingId: string;
  following: IFollowUser;
  follower: IFollowUser;
  createdAt: string;
}
