import { axiosAuthMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { beforeEach, describe, expect, it } from 'bun:test';
import type { IFollow } from '@/types/follow.type';

const { followsService } = await import('@/services/follows.service');

describe('followsService', () => {
  beforeEach(resetAxiosMocks);

  it('follows a user', async () => {
    await followsService.followUser('u2');

    expect(axiosAuthMock.post).toHaveBeenCalledWith('/follows/u2/follow');
  });

  it('unfollows a user through the bare id path', async () => {
    await followsService.unfollowUser('u2');

    expect(axiosAuthMock.delete).toHaveBeenCalledWith('/follows/u2');
  });

  it('reads followers and following from separate endpoints', async () => {
    await followsService.getFollowers('u2');
    await followsService.getFollowing('u2');

    expect(axiosAuthMock.get).toHaveBeenCalledWith('/follows/u2/followers');
    expect(axiosAuthMock.get).toHaveBeenCalledWith('/follows/u2/following');
  });

  it('returns the follow list untouched', async () => {
    const follow: IFollow = {
      id: 'f1',
      followerId: 'u1',
      followingId: 'u2',
      following: { id: 'u2', name: 'Anna', username: 'anna', avatar: null },
      follower: { id: 'u1', name: 'Ivan', username: 'ivan', avatar: null },
      createdAt: '2026-01-15T10:00:00Z',
    };
    axiosAuthMock.get.mockResolvedValueOnce(axiosResponse([follow]));

    const response = await followsService.getFollowing('u1');

    expect(response.data).toEqual([follow]);
  });
});
