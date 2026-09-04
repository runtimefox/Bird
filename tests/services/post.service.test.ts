import { axiosAuthMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { beforeEach, describe, expect, it } from 'bun:test';
import { makePost } from '../helpers/fixtures';

const { postService } = await import('@/services/post.service');

describe('postService', () => {
  beforeEach(resetAxiosMocks);

  it('creates a post as multipart form data', async () => {
    const body = new FormData();
    body.append('content', 'Hello');

    await postService.createPost(body);

    expect(axiosAuthMock.post).toHaveBeenCalledWith('/posts/create-post', body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  });

  it('defaults the feed to the first page of ten', async () => {
    await postService.getPosts();

    expect(axiosAuthMock.get).toHaveBeenCalledWith('/posts/all', {
      params: { page: 1, limit: 10 },
    });
  });

  it('passes pagination through to the feed', async () => {
    await postService.getPosts({ page: 3, limit: 25 });

    expect(axiosAuthMock.get).toHaveBeenCalledWith('/posts/all', {
      params: { page: 3, limit: 25 },
    });
  });

  it('returns the paginated payload untouched', async () => {
    const payload = { data: [makePost()], total: 1 };
    axiosAuthMock.get.mockResolvedValueOnce(axiosResponse(payload));

    const response = await postService.getPosts();

    expect(response.data).toEqual(payload);
  });

  it('hits the following feed on its own endpoint', async () => {
    await postService.getFollowingPosts({ page: 2 });

    expect(axiosAuthMock.get).toHaveBeenCalledWith('/posts/following', {
      params: { page: 2, limit: 10 },
    });
  });

  it('updates a post by id', async () => {
    await postService.updatePost('p1', { content: 'Edited' });

    expect(axiosAuthMock.put).toHaveBeenCalledWith('/posts/update-post/p1', { content: 'Edited' });
  });

  it('deletes a post by id', async () => {
    await postService.deletePost('p1');

    expect(axiosAuthMock.delete).toHaveBeenCalledWith('/posts/p1');
  });

  it('likes and unlikes through different verbs and paths', async () => {
    await postService.likePost('p1');
    await postService.unlikePost('p1');

    expect(axiosAuthMock.post).toHaveBeenCalledWith('/posts/p1/like');
    expect(axiosAuthMock.delete).toHaveBeenCalledWith('/posts/p1/unlike');
  });

  it('fetches a single post and a user feed', async () => {
    await postService.getPostById('p1');
    await postService.getPostsByUserId('u1');

    expect(axiosAuthMock.get).toHaveBeenCalledWith('/posts/p1');
    expect(axiosAuthMock.get).toHaveBeenCalledWith('/posts/user/u1', {
      params: { page: 1, limit: 10 },
    });
  });

  it('pages through a user feed', async () => {
    await postService.getPostsByUserId('u1', { page: 3, limit: 5 });

    expect(axiosAuthMock.get).toHaveBeenCalledWith('/posts/user/u1', {
      params: { page: 3, limit: 5 },
    });
  });

  it('fetches popular hashtags', async () => {
    axiosAuthMock.get.mockResolvedValueOnce(axiosResponse([{ tag: 'bun', count: 4 }]));

    const response = await postService.getPopularHashtags();

    expect(axiosAuthMock.get).toHaveBeenCalledWith('/posts/hastags/popular');
    expect(response.data).toEqual([{ tag: 'bun', count: 4 }]);
  });

  it('searches by hashtag with pagination', async () => {
    await postService.searchByHastag('bun', { page: 2, limit: 5 });

    expect(axiosAuthMock.get).toHaveBeenCalledWith('/posts/search/hashtag', {
      params: { tag: 'bun', page: 2, limit: 5 },
    });
  });
});
