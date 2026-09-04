import { axiosAuthMock, axiosResponse, resetAxiosMocks } from '../helpers/axios-mock';
import { beforeEach, describe, expect, it } from 'bun:test';
import { makeComment } from '../helpers/fixtures';

const { commentsService } = await import('@/services/comments.service');

describe('commentsService', () => {
  beforeEach(resetAxiosMocks);

  it('sends the post id in both the path and the body', async () => {
    await commentsService.createComment('p1', 'Nice post');

    expect(axiosAuthMock.post).toHaveBeenCalledWith('/comments/posts/p1/comments', {
      postId: 'p1',
      content: 'Nice post',
    });
  });

  it('reads a post comments from the singular path', async () => {
    axiosAuthMock.get.mockResolvedValueOnce(axiosResponse([makeComment()]));

    const response = await commentsService.getCommentsByPostId('p1');

    expect(axiosAuthMock.get).toHaveBeenCalledWith('/comments/post/p1');
    expect(response.data).toHaveLength(1);
  });

  it('deletes a comment by its own id', async () => {
    await commentsService.deleteComment('c1');

    expect(axiosAuthMock.delete).toHaveBeenCalledWith('/comments/c1');
  });
});
