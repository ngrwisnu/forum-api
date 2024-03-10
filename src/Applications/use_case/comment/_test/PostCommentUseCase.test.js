import CommentRepository from "../../../../Domains/comments/CommentRepository";
import PostComment from "../../../../Domains/comments/entities/PostComment";
import PostedComment from "../../../../Domains/comments/entities/PostedComment";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import JwtTokenManager from "../../../../Infrastructures/security/JwtTokenManager";
import PostCommentUseCase from "../PostCommentUseCase";
import NotFoundError from "../../../../Commons/exceptions/NotFoundError";

describe("PostCommentUseCase", () => {
  it("should return error when token auth is not provided", async () => {
    try {
      const payload = {
        content: "comment content",
      };

      const postCommentUseCase = new PostCommentUseCase({
        commentRepository: {},
        threadRepository: {},
        tokenManager: {},
      });

      await postCommentUseCase.execute(undefined, payload, "thread-1");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should return error when content is empty", async () => {
    const payload = {
      content: "",
    };

    const postCommentUseCase = new PostCommentUseCase({});

    expect(postCommentUseCase.execute("", payload, "")).rejects.toThrowError();
  });

  it("should return error when content has invalid data type", async () => {
    const payload = {
      content: 10,
    };

    const postCommentUseCase = new PostCommentUseCase({});

    expect(postCommentUseCase.execute("", payload, "")).rejects.toThrowError();
  });

  it("should return error when thread is not found", async () => {
    try {
      const mockThreadRepository = new ThreadRepository();
      mockThreadRepository.isThreadExist = jest
        .fn()
        .mockImplementation(() =>
          Promise.reject(new NotFoundError("thread is not found"))
        );

      const postCommentUseCase = new PostCommentUseCase({
        commentRepository: {},
        tokenManager: {},
        threadRepository: mockThreadRepository,
      });

      await postCommentUseCase.execute("Bearer token123", {}, "thread-1");

      expect(mockThreadRepository.isThreadExist).toBeCalledTimes(1);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("thread is not found");
    }
  });

  it("should orchestrate the post comment action correctly", async () => {
    const payload = {
      content: "comment content",
    };

    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const mockPostedComment = new PostedComment({
      id: "comment-1",
      content: payload.content,
      user_id: "user-1",
      thread_id: "thread-1",
      is_deleted: false,
      created_at: new Date().getTime(),
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockJwtTokenManager = new JwtTokenManager();
    mockCommentRepository.postComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockPostedComment));
    mockJwtTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: "user-1" }));
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const postCommentUseCase = new PostCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      tokenManager: mockJwtTokenManager,
    });

    const postedComment = await postCommentUseCase.execute(
      "Bearer token123",
      payload,
      "thread-1"
    );

    expect(postedComment).toStrictEqual(
      new PostedComment({
        id: "comment-1",
        content: payload.content,
        user_id: "user-1",
        thread_id: "thread-1",
        is_deleted: false,
        created_at: new Date(),
      })
    );
    expect(mockCommentRepository.postComment).toBeCalledTimes(1);
    expect(mockCommentRepository.postComment).toBeCalledWith(
      new PostComment({
        content: payload.content,
        user_id: "user-1",
        thread_id: "thread-1",
        created_at: new Date().getTime(),
      })
    );
    expect(mockThreadRepository.isThreadExist).toBeCalled();
  });
});
