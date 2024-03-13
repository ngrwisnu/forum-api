import CommentRepository from "../../../../Domains/comments/CommentRepository";
import ReplyRepository from "../../../../Domains/replies/ReplyRepository";
import PostReply from "../../../../Domains/replies/entities/PostReply";
import PostedReply from "../../../../Domains/replies/entities/PostedReply";
import ThreadRepository from "../../../../Domains/threads/ThreadRepository";
import JwtTokenManager from "../../../../Infrastructures/security/JwtTokenManager";
import PostReplyUseCase from "../PostReplyUseCase";

describe("PostReplyUseCase", () => {
  it("should return error when token auth is not provided", async () => {
    const postReplyUseCase = new PostReplyUseCase({});

    const params = {
      token: undefined,
      payload: {},
      threadId: "",
      commentId: "",
    };

    expect(() => postReplyUseCase.execute(params)).rejects.toThrow(
      "AUTHENTICATION_HELPER.NOT_AUTHENTICATED"
    );
  });

  it("should return error when content is empty", async () => {
    const payload = {
      content: "",
    };

    const params = {
      token: "",
      payload,
      threadId: "",
      commentId: "",
    };

    const postReplyUseCase = new PostReplyUseCase({});

    expect(postReplyUseCase.execute(params)).rejects.toThrow();
  });

  it("should return error when content has invalid data type", async () => {
    const payload = {
      content: true,
    };

    const params = {
      token: "",
      payload,
      threadId: "",
      commentId: "",
    };

    const postReplyUseCase = new PostReplyUseCase({});

    expect(postReplyUseCase.execute(params)).rejects.toThrow();
  });

  it("should return error when thread is not found", async () => {
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.reject("thread not found"));

    const postReplyUseCase = new PostReplyUseCase({
      replyRepository: {},
      commentRepository: {},
      tokenManager: {},
      threadRepository: mockThreadRepository,
    });

    const params = {
      token: "Bearer token123",
      payload: {},
      threadId: "thread-1",
      commentId: "",
    };

    expect(postReplyUseCase.execute(params)).rejects.toBe("thread not found");
  });

  it("should orchestrate the post comment action correctly", async () => {
    const payload = {
      content: "reply content",
    };

    const mockTime = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockTime);

    const mockPostedReply = new PostedReply({
      id: "reply-1",
      content: payload.content,
      user_id: "user-1",
      comment_id: "comment-1",
      is_deleted: false,
      created_at: new Date().getTime(),
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockJwtTokenManager = new JwtTokenManager();
    mockReplyRepository.postReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockPostedReply));
    mockJwtTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: "user-1" }));
    mockThreadRepository.isThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.isCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const postReplyUseCase = new PostReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      tokenManager: mockJwtTokenManager,
    });

    const params = {
      token: "Bearer token123",
      payload,
      threadId: "thread-1",
      commentId: "comment-1",
    };

    const postedReply = await postReplyUseCase.execute(params);

    expect(postedReply).toStrictEqual(
      new PostedReply({
        id: "reply-1",
        content: payload.content,
        user_id: "user-1",
        comment_id: "comment-1",
        is_deleted: false,
        created_at: new Date(),
      })
    );
    expect(mockReplyRepository.postReply).toBeCalledTimes(1);
    expect(mockReplyRepository.postReply).toBeCalledWith(
      new PostReply({
        content: payload.content,
        user_id: "user-1",
        comment_id: "comment-1",
        created_at: new Date().getTime(),
      })
    );
    expect(mockThreadRepository.isThreadExist).toBeCalled();
    expect(mockCommentRepository.isCommentExist).toBeCalled();
  });
});
