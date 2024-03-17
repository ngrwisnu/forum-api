import CommentRepository from "../../../../Domains/comments/CommentRepository";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import JwtTokenManager from "../../../../Infrastructures/security/JwtTokenManager";
import DeleteCommentUseCase from "../DeleteCommentUseCase";

describe("DeleteCommentUseCase", () => {
  it("should return error when comment is not found", async () => {
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.reject("comment not found"));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      tokenManager: {},
      threadRepository: {},
    });

    const params = {
      token: "token123",
      threadId: "thread-1",
      commentId: "comment-x",
    };

    try {
      await deleteCommentUseCase.execute(
        params.token,
        params.threadId,
        params.commentId
      );
    } catch (error) {
      expect(error).toBe("comment not found");
    }

    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
  });

  it("should return error when thread is not found", async () => {
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.reject("thread not found"));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      tokenManager: {},
      threadRepository: mockThreadRepository,
    });

    const params = {
      token: "token123",
      threadId: "thread-x",
      commentId: "comment-1",
    };

    try {
      await deleteCommentUseCase.execute(
        params.token,
        params.threadId,
        params.commentId
      );
    } catch (error) {
      expect(error).toBe("thread not found");
    }

    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
  });

  it("should return error when user is unauthorized", async () => {
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ user_id: "user-1" }));

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockJwtTokenManager = new JwtTokenManager();
    mockJwtTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: "user-11" }));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      tokenManager: mockJwtTokenManager,
    });

    const params = {
      token: "token123",
      threadId: "thread-1",
      commentId: "comment-1",
    };

    try {
      await deleteCommentUseCase.execute(
        params.token,
        params.threadId,
        params.commentId
      );
    } catch (error) {
      expect(error.message).toBe("AUTHORIZATION_HELPER.UNAUTHORIZED_USER");
    }

    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(mockCommentRepository.getCommentById).toBeCalledWith(
      params.commentId
    );
    expect(mockJwtTokenManager.decodePayload).toBeCalledWith("token123");
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
  });

  it("should orchestrate the delete comment action correctly", async () => {
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ user_id: "user-1" }));
    mockCommentRepository.deleteCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockJwtTokenManager = new JwtTokenManager();
    mockJwtTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: "user-1" }));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      tokenManager: mockJwtTokenManager,
    });

    const params = {
      token: "token123",
      threadId: "thread-1",
      commentId: "comment-1",
    };

    await deleteCommentUseCase.execute(
      params.token,
      params.threadId,
      params.commentId
    );

    expect(mockCommentRepository.isCommentExist).toBeCalledWith(
      params.commentId
    );
    expect(mockCommentRepository.getCommentById).toBeCalledWith(
      params.commentId
    );
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
      params.commentId
    );
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
    expect(mockJwtTokenManager.decodePayload).toBeCalledWith("token123");
  });
});
