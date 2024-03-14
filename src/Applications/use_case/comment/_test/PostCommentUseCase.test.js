import CommentRepository from "../../../../Domains/comments/CommentRepository";
import PostComment from "../../../../Domains/comments/entities/PostComment";
import PostedComment from "../../../../Domains/comments/entities/PostedComment";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import JwtTokenManager from "../../../../Infrastructures/security/JwtTokenManager";
import PostCommentUseCase from "../PostCommentUseCase";

describe("PostCommentUseCase", () => {
  it("should return error when token auth is not provided", async () => {
    const payload = {
      content: "comment content",
    };

    const postCommentUseCase = new PostCommentUseCase({
      commentRepository: {},
      threadRepository: {},
      tokenManager: {},
    });

    expect(
      postCommentUseCase.execute(undefined, payload, "thread-1")
    ).rejects.toThrow();
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
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.reject("thread not found"));

    const postCommentUseCase = new PostCommentUseCase({
      commentRepository: {},
      tokenManager: {},
      threadRepository: mockThreadRepository,
    });

    const params = {
      token: "Bearer token123",
      payload: {},
      threadId: "",
    };

    try {
      await postCommentUseCase.execute(
        params.token,
        params.payload,
        params.threadId
      );
    } catch (error) {
      expect(error).toBeDefined();
    }

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
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

    const params = {
      token: "Bearer token123",
      payload,
      threadId: "thread-1",
    };

    const postedComment = await postCommentUseCase.execute(
      params.token,
      params.payload,
      params.threadId
    );

    expect(postedComment).toStrictEqual(
      new PostedComment({
        id: "comment-1",
        content: payload.content,
        user_id: "user-1",
        thread_id: params.threadId,
        is_deleted: false,
        created_at: new Date(),
      })
    );
    expect(mockCommentRepository.postComment).toBeCalledWith(
      new PostComment({
        content: payload.content,
        user_id: "user-1",
        thread_id: params.threadId,
        created_at: new Date().getTime(),
      })
    );
    expect(mockJwtTokenManager.decodePayload).toBeCalledWith("token123");
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(params.threadId);
  });
});
