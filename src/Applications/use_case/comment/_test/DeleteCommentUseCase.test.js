import CommentRepository from "../../../../Domains/comments/CommentRepository";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import JwtTokenManager from "../../../../Infrastructures/security/JwtTokenManager";
import DeleteCommentUseCase from "../DeleteCommentUseCase";

describe("DeleteCommentUseCase", () => {
  it("should return error when token auth is not provided", async () => {
    try {
      const deleteCommentUseCase = new DeleteCommentUseCase({
        commentRepository: {},
        threadRepository: {},
        tokenManager: {},
      });

      await deleteCommentUseCase.execute(undefined, "", "");
    } catch (error) {
      expect(error.message).toBe("AUTHENTICATION_HELPER.NOT_AUTHENTICATED");
    }
  });

  it("should return error when comment is not found", async () => {
    try {
      const mockCommentRepository = new CommentRepository();
      mockCommentRepository.isCommentExist = jest
        .fn()
        .mockImplementation(() => Promise.reject("comment not found"));

      const deleteCommentUseCase = new DeleteCommentUseCase({
        commentRepository: mockCommentRepository,
        tokenManager: {},
        threadRepository: {},
      });

      await deleteCommentUseCase.execute("Bearer token123", "thread-1", "");

      expect(mockCommentRepository.isCommentExist).toBeCalledTimes(1);
    } catch (error) {
      expect(error).toBe("comment not found");
    }
  });

  it("should return error when thread is not found", async () => {
    try {
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();
      mockCommentRepository.isCommentExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockThreadRepository.isThreadExist = jest
        .fn()
        .mockImplementation(() => Promise.reject("thread not found"));

      const deleteCommentUseCase = new DeleteCommentUseCase({
        commentRepository: mockCommentRepository,
        tokenManager: {},
        threadRepository: mockThreadRepository,
      });

      await deleteCommentUseCase.execute("Bearer token123", "thread-1", "");

      expect(mockThreadRepository.isThreadExist).toBeCalledTimes(1);
    } catch (error) {
      expect(error).toBe("thread not found");
    }
  });

  it("should return error when user is unauthorized", async () => {
    try {
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();
      const mockJwtTokenManager = new JwtTokenManager();
      mockCommentRepository.isCommentExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.getCommentById = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ user_id: "user-1" }));
      mockJwtTokenManager.decodePayload = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ id: "user-11" }));
      mockThreadRepository.isThreadExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      const deleteCommentUseCase = new DeleteCommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        tokenManager: mockJwtTokenManager,
      });

      await deleteCommentUseCase.execute(
        "Bearer token123",
        "thread-1",
        "comment-1"
      );
    } catch (error) {
      expect(error.message).toBe("AUTHORIZATION_HELPER.UNAUTHORIZED_USER");
    }
  });

  it("should orchestrate the delete comment action correctly", async () => {
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockJwtTokenManager = new JwtTokenManager();
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ user_id: "user-1" }));
    mockCommentRepository.deleteCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve("success"));
    mockJwtTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: "user-1" }));
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      tokenManager: mockJwtTokenManager,
    });

    await deleteCommentUseCase.execute(
      "Bearer token123",
      "thread-1",
      "comment-1"
    );

    expect(mockCommentRepository.isCommentExist).toBeCalledTimes(1);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith("comment-1");
    expect(mockThreadRepository.isThreadExist).toBeCalled();
    expect(mockThreadRepository.isThreadExist).toBeCalledWith("thread-1");
    expect(mockJwtTokenManager.decodePayload).toBeCalledTimes(1);
  });
});
